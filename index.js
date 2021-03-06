#!/usr/bin/env node

require('q').longStackSupport = true;

require('lazy-ass');
var check = require('check-more-types');
require('./src/commit-id');
require('console.table');
var quote = require('quote');

var options = require('./src/cli-options')();
la(check.object(options), 'could not get cli options', options);

var repoToCoverage = require('./src/repo-to-separate-coverage');
var reportCoverage = require('./src/report-coverage');
var updateCoverage = require('./src/update-coverage');
var openReports = require('./src/open-reports');
var config = require('./src/config')();

la(check.unemptyString(options.repo), 'missing git repo path', options);

if (options.open) {
  openReports();
  process.exit(0);
}

// either compute initial split coverage
if (options.reset && options.update) {
  console.error('Please reset coverage separately from updating it.');
  process.exit(1);
}

if (options.reset) {
  console.log('resetting split commits in', options.repo);

  if (require('fs').existsSync(config.commitsFolder)) {
    require('rimraf').sync(config.commitsFolder);
    console.log('removed commits folder', quote(config.commitsFolder));
  }

  la(check.fn(options.commits), 'missing commits filter function', options);
  repoToCoverage(options.repo, options.commits, options.files)
    // .tap(console.log)
    .then(function (separateCoverage) {
      check.object(separateCoverage, 'missing separate coverage', separateCoverage);
      reportCoverage(separateCoverage, false, options.repo);
    })
    .done();
}

// or update prepared split coverage
if (options.update) {
  console.log('updating split coverage from', options.update);

  updateCoverage(options.update, options.repo)
    .done();
}

