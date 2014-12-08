var pkg = require('../package.json');
var info = pkg.name + ' - ' + pkg.description + '\n' +
  '  version: ' + pkg.version + '\n' +
  '  author: ' + JSON.stringify(pkg.author);

function isJustNumber(s) {
  return Number(s).toString() === s;
}

function processOptions(options) {
  var R = require('ramda');
  var check = require('check-more-types');
  var join = require('path').join;

  if (isJustNumber(options.commits)) {
    options.commits = R.take(options.commits);
  }

  if (options.coverage && !check.absolute(options.coverage)) {
    options.coverage = join(options.repo, options.coverage);
  }

  return options;
}

function cliOptions() {
  var optimist = require('optimist');

  var program = optimist
    .option('version', {
      boolean: true,
      alias: 'v',
      description: 'show version and exit',
      default: false
    })
    .option('repo', {
      string: true,
      description: 'git repo path',
      default: '.'
    })
    .option('reset', {
      boolean: true,
      alias: 'r',
      description: 'erase previously collected coverage',
      default: false
    })
    .option('commits', {
      string: true,
      alias: 'c',
      description: 'commit filter, for example pick last two -c 2',
      default: 5
    })
    .option('coverage', {
      string: true,
      alias: 'f',
      description: 'path to JSON coverage file to use'
    })
    .usage(info)
    .argv;

  if (program.version) {
    console.log(info);
    process.exit(0);
  }

  if (program.help || program.h) {
    optimist.showHelp();
    process.exit(0);
  }

  return processOptions(program);
}

module.exports = cliOptions;
