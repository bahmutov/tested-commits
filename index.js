require('q').longStackSupport = true;

require('lazy-ass');
var check = require('check-more-types');
require('./src/commit-id');
require('console.table');

var options = require('./src/cli-options')();
la(check.object(options), 'could not get cli options', options);

var repoToCoverage = require('./src/repo-to-separate-coverage');
var reportCoverage = require('./src/report-coverage');
var updateCoverage = require('./src/update-coverage');

// var gitRepoFolder = '../foo-bar-baz';
la(check.unemptyString(options.repo), 'missing git repo path', options);

// either compute initial split coverage
if (options.reset) {
  console.log('resetting split commits in', options.repo);

  la(check.fn(options.commits), 'missing commits filter function', options);
  repoToCoverage(options.repo, options.commits)
    // .tap(console.log)
    .then(function (separateCoverage) {
      check.object(separateCoverage, 'missing separate coverage', separateCoverage);
      reportCoverage(separateCoverage, false);
    })
    .done();
}

// or update prepared split coverage
if (options.coverage) {
  console.log('updating split coverage from', options.coverage);

  updateCoverage(options.coverage);
}

