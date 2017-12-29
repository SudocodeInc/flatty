const path = require('path');

const processFile = require('../../lib/processFile');

const validFrom = ['csv', 'json'];
const validTo = ['csv', 'json'];

module.exports = (program) => {
  program
    .command('convert <file>')
    .description('Convert a file')
    .option('-f, --from <format>', 'Format of input file')
    .option('-t, --to <format>', 'Format of output')
    .option('-o, --offset <rows>', 'Number of rows to skip')
    .option('-l, --limit <rows>', 'Limit the number of rows to process')
    .option('-T, --transform <file>', 'Transformer for the data')
    .action((file, options) => {
      if (!file) {
        console.log();
        console.log('  error: missing required argument `file\'');
        console.log();
        process.exit(1);
        return;
      }

      if (!options.from) {
        console.log();
        console.log('  error: missing required option `--from\'');
        console.log();
        process.exit(1);
        return;
      }

      if (!options.to) {
        console.log();
        console.log('  error: missing required option `--to\'');
        console.log();
        process.exit(1);
        return;
      }

      const from = options.from;
      const to = options.to;

      if (!validFrom.includes(options.from)) {
        console.log();
        console.log('  error: invalid value for option `--from\'');
        console.log('  valid values: ' + validFrom.join(', '));
        console.log();
        process.exit(1);
        return;
      }

      if (!validTo.includes(options.to)) {
        console.log();
        console.log('  error: invalid value for option `--to\'');
        console.log('  valid values: ' + validTo.join(', '));
        console.log();
        process.exit(1);
        return;
      }

      let transform = (data) => { return data };

      if (options.transform) {
        transform = require(path.join(process.cwd(), options.transform));
      }

      let limit = parseInt(options.limit);
      let offset = parseInt(options.offset);

      if (isNaN(offset)) {
        offset = 0;
      }

      const opts = {
        from: from,
        to: to,
        transform: transform,
        offset: offset,
        limit: limit,
      };

      processFile(file, opts);
    });
};