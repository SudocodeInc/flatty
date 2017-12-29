const fs = require('fs');

const csv = require("fast-csv");
const ndjson = require("ndjson");
const through = require('through2');

const processRow = require('./processRow');

module.exports = (file, opts) => {
  const stats = {
    row: 0,
  };

  let parser = null;

  if (opts.from === 'csv') {
    parser = csv.parse();
  } else if (opts.from === 'json') {
    parser = ndjson.parse();
  }

  if (!parser) {
    throw new Error('Unsupported input format: ' + opts.from);
  }

  let serializer = null;

  if (opts.to === 'csv') {
    serializer = csv.format();
  } else if (opts.to === 'json') {
    serializer = ndjson.serialize();
  }

  const proc = through.obj(
    function (data, enc, done) {
      processRow(data, stats, opts, (err, output) => {
        if (err) {
          throw err;
        }

        if (output) {
          this.push(output.data);
        }

        done();
      });
    }
  );

  fs.createReadStream(file)
    .pipe(parser)
    .pipe(proc)
    .pipe(serializer)
    .pipe(process.stdout)
};