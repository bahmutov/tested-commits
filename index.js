require('q').longStackSupport = true;

require('lazy-ass');
var check = require('check-more-types');
require('./src/commit-id');
require('console.table');
var join = require('path').join;

var options = require('./src/cli-options')();
la(check.object(options), 'could not get cli options', options);

var repoToCoverage = require('./src/repo-to-separate-coverage');
var reportCoverage = require('./src/report-coverage');
var updateCoverage = require('./src/update-coverage');

// var gitRepoFolder = '../foo-bar-baz';
la(check.unemptyString(options.repo), 'missing git repo path', options);

// either compute initial split coverage
repoToCoverage(options.repo, R.take(3))
  // .tap(console.log)
  .then(function (separateCoverage) {
    check.object(separateCoverage, 'missing separate coverage', separateCoverage);
    reportCoverage(separateCoverage, false);
  })
  .done();

// or update prepared split coverage

// updateCoverage(join(gitRepoFolder, 'coverage.json'));

