require('lazy-ass');
var check = require('check-more-types');
var istanbul = require('istanbul');
var Collector = istanbul.Collector;
var fs = require('fs');
var R = require('ramda');
var join = require('path').join;
var config = require('./config')();

function verifyFileCoverage(fileCoverage) {
  la(check.unemptyString(fileCoverage.path), 'coverage object should have path property', fileCoverage);
  la(check.object(fileCoverage.s), 'coverage object should have s property', fileCoverage);
  la(check.absolute(fileCoverage.path), 'expected source path to be absolute', fileCoverage);
}

function reportCoverage(coverage, commitId, update) {
  la(check.maybe.commitId(commitId), 'expected commit id', commitId);

  R.values(coverage).forEach(verifyFileCoverage);

  // console.log(coverage);

  var collector = new Collector();
  collector.add(coverage);

  var Report = istanbul.Report;

  var summaryReport = Report.create('text-summary');
  summaryReport.writeReport(collector);

  var dir = commitId ? commitId : 'html_report';
  la(check.unemptyString(config.commitsFolder), 'expected commits folder', config);
  var fullDir = join(process.cwd(), config.commitsFolder, dir);
  console.log('full dir', fullDir);
  var htmlReport = Report.create('html', {
    dir: fullDir
  });
  htmlReport.writeReport(collector, true);

  var coverageFilename = join(fullDir,
    update ? config.latestCommitCoverageFilename : config.initialCommitCoverageFilename);
  fs.writeFileSync(coverageFilename, JSON.stringify(coverage, null, 2), 'utf-8');
}

function reportSeparateCoverage(coverageByCommitId, update) {
  la(check.object(coverageByCommitId), 'need split coverage object', coverageByCommitId);
  la(check.maybe.bool(update), 'expected optional bool flag', update);

  R.keys(coverageByCommitId)
    .map(function (id) {
      reportCoverage(coverageByCommitId[id], id, update);
    });
}

function report() {
  if (arguments.length >= 2 && check.commitId(arguments[1])) {
    return reportCoverage.apply(null, arguments);
  }
  return reportSeparateCoverage.apply(null, arguments);
}

module.exports = report;

/*
  Example grab last 2 commits, split coverage and save HTML report for each commit
  separately. Each commit will only show its modified source lines, excluding the other source.

  repoToCoverage(gitRepoFolder, R.take(2))
    // .tap(console.log)
    .then(function (separateCoverage) {
      check.object(separateCoverage, 'missing separate coverage', separateCoverage);
      reportCoverage(separateCoverage, false);
    })
    .done();
*/
