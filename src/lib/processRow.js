module.exports = (input, stats, opts, cb) => {
  stats.row++;

  if (stats.row <= opts.offset) {
    cb();
    return;
  }

  if (stats.row > opts.offset + opts.limit) {
    cb();
    return;
  }

  let data = opts.transform(input, stats);

  if (data == null) {
    cb();
    return;
  }

  cb(null, {
    data: data,
  })
};