var check = require('check-more-types');
var R = require('ramda');
var pkg = require('../package.json');
var info = pkg.name + ' - ' + pkg.description + '\n' +
  '  version: ' + pkg.version + '\n' +
  '  author: ' + JSON.stringify(pkg.author);

function isSmall(s) {
  return s < 100;
}

function isJustNumber(s) {
  return check.number(s) || (Number(s).toString() === s);
}

var isNumberOfCommits = R.allPredicates([isJustNumber, isSmall]);

function filterByCommitId(id, comparison) {
  return function (commits) {
    return commits.filter(function (c) {
      la(check.object(c), 'expected commit object', c);
      la(check.has(c, 'id'), 'commit object is missing id property', c);
      la(check.commitId(c.id), 'invalid commit id', c);
      return comparison(c.id, id);
    });
  };
}

function startsWith(start, s) {
  la(check.unemptyString(s), 'missing full string', arguments);
  la(check.unemptyString(start), 'missing start string', arguments);
  return s.indexOf(start) === 0;
}

function processOptions(options) {
  var R = require('ramda');
  var join = require('path').join;

  if (isNumberOfCommits(options.commits)) {
    options.commits = R.take(Number(options.commits));
  } else if (check.commitId(options.commits)) {
    options.commits = filterByCommitId(options.commits, R.eq);
  } else if (check.shortCommitId(options.commits)) {
    options.commits = filterByCommitId(options.commits,
      R.lPartial(startsWith, options.commits));
  }

  if (options.coverage && !check.absolute(options.coverage)) {
    options.coverage = join(options.repo, options.coverage);
  }

  if (!options.files) {
    options.files = R.alwaysTrue;
  } else {
    var filesFilter = new RegExp(options.files);
    options.files = function (filename) {
      return filesFilter.test(filename);
    };
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
      alias: 'x',
      description: 'path to JSON coverage file to use'
    })
    .option('files', {
      string: true,
      alias: 'f',
      description: 'filter input files expression'
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
