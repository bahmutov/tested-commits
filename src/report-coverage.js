require('lazy-ass');
var check = require('check-more-types');
var istanbul = require('istanbul');
var Collector = istanbul.Collector;
var fs = require('fs');
var R = require('ramda');
var join = require('path').join;

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

  var dir = commitId ? 'commit_' + commitId : 'html_report';
  var fullDir = join(process.cwd(), dir);
  console.log('full dir', fullDir);
  var htmlReport = Report.create('html', {
    dir: fullDir
  });
  htmlReport.writeReport(collector, true);

  var coverageFilename = join(fullDir,
    update ? 'updated-coverage.json' : 'commit-coverage.json');
  fs.writeFileSync(coverageFilename, JSON.stringify(coverage, null, 2), 'utf-8');
}

function reportSeparateCoverage(coverageByCommitId, update) {
  R.keys(coverageByCommitId)
    .map(function (id) {
      reportCoverage(coverageByCommitId[id], id, update);
    });
}

module.exports = check.defend(reportSeparateCoverage,
  check.object, 'need separate coverage object',
  check.maybe.bool, 'expected optional bool flag');
