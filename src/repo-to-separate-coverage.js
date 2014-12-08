require('lazy-ass');
var check = require('check-more-types');
var R = require('ramda');
var d3h = require('d3-helpers');

var folders = require('./folder');
var commits = require('./commits');
var sourceFiles = require('./js-source-files');
var commitPerLine = require('./commit-per-line');
var fileCoverage = require('./file-coverage');
var coveragePerCommit = require('./coverage-per-commit');

function repoToSeparateCoverage(folder, commitFilter) {
  if (!commitFilter) {
    commitFilter = R.take(100);
  }

  var filenames, commitsById, initialCoverage;

  return commits.all(folder)
    .then(commitFilter)
    .then(commits.byId)
    .then(function (c) {
      commitsById = c;
      console.log('commits by id', commitsById);
    })
    .then(folders.to.bind(null, folder))
    .then(d3h.hermit(sourceFiles))
    .then(function (names) {
      la(check.arrayOfStrings(names), 'could not find filenames', names);
      filenames = names;
      return filenames;
    })
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

module.exports = check.defend(repoToSeparateCoverage,
  check.unemptyString, 'need git repo folder name',
  check.maybe.fn, 'need commit filter function');
