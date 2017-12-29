#!/usr/bin/env node

const program = require('commander');

const convert = require('./commands/convert');

program.version('1.0.0');
convert(program);


program.parse(process.argv);