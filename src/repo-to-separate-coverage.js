require('lazy-ass');
var check = require('check-more-types');
var R = require('ramda');
var d3h = require('d3-helpers');

var folders = require('chdir-promise');
var commits = require('./commits');
var sourceFiles = require('./js-source-files');
var commitPerLine = require('./commit-per-line');
var fileCoverage = require('./file-coverage');
var coveragePerCommit = require('./coverage-per-commit');

function repoToSeparateCoverage(folder, commitFilter, filenameFilter) {
  if (!commitFilter) {
    commitFilter = R.take(100);
  }
  if (!filenameFilter) {
    filenameFilter = R.alwaysTrue;
  }

  var filenames;
  function filterFiles(names) {
    la(check.arrayOfStrings(names), 'could not find filenames', names);
    filenames = names.filter(filenameFilter);
    return filenames;
  }

  var commitsById, initialCoverage;

  return commits.all(folder)
    .then(commitFilter)
    .tap(console.table)
    .then(commits.byId)
    .then(function (c) {
      commitsById = c;
    })
    .then(folders.to.bind(null, folder))
    .then(d3h.hermit(sourceFiles))
    .then(filterFiles)
    .then(fileCoverage)
    .then(function (coverage) {
      la(check.object(coverage), 'expected initial coverage');
      initialCoverage = coverage;
    })
    .then(function () {
      return commitPerLine(filenames);
    })
    .then(function (commitBlame) {
      var separateCoverage = coveragePerCommit(initialCoverage, commitsById, commitBlame);
      la(check.object(separateCoverage), 'could not separate coverage per commit', separateCoverage);
      return separateCoverage;
    })
    .tap(folders.comeBack);
}

/* optional argument is a filter on commits, newest first, for example
  to keep only last 2 commits use R.take(2) */
module.exports = check.defend(repoToSeparateCoverage,
  check.unemptyString, 'need git repo folder name',
  check.maybe.fn, 'need commit filter function',
  check.maybe.fn, 'need filename filter function');
