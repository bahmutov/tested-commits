require('q').longStackSupport = true;

require('lazy-ass');
var check = require('check-more-types');
require('./src/commit-id');
require('console.table');

var repoToCoverage = require('./src/repo-to-separate-coverage');
var reportCoverage = require('./src/report-coverage');
var updateCoverage = require('./src/update-coverage');

var gitRepoFolder = '../foo-bar-baz';

// either compute initial split coverage

/*
repoToCoverage(gitRepoFolder, R.take(3))
  // .tap(console.log)
  .then(function (separateCoverage) {
    check.object(separateCoverage, 'missing separate coverage', separateCoverage);
    reportCoverage(separateCoverage, false);
  })
  .done();
*/

// or update prepared split coverage

updateCoverage(join(gitRepoFolder, 'coverage.json'));

