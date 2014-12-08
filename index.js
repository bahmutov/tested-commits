require('q').longStackSupport = true;

require('lazy-ass');
var check = require('check-more-types');
require('./src/commit-id');

var ggit = require('ggit');
var q = require('q');
var R = require('ramda');
var _ = require('lodash');
require('console.table');
var join = require('path').join;
var fs = require('fs');

var istanbul = require('istanbul');
var Collector = istanbul.Collector;
var instrumenter = new istanbul.Instrumenter();
var read = require('fs').readFileSync;
var d3h = require('d3-helpers');

var folders = require('./src/folder');
var commits = require('./src/commits');
var sourceFiles = require('./src/js-source-files');
var commitPerLine = require('./src/commit-per-line');
var fileCoverage = require('./src/file-coverage');
var coveragePerCommit = require('./src/coverage-per-commit');
var repoToCoverage = require('./src/repo-to-separate-coverage');

var gitRepoFolder = '../foo-bar-baz';
/*
var currentFolder;

function toFolder(folder) {
  var current = process.cwd();
  la(check.unemptyString(folder), 'missing folder');
  process.chdir(gitRepoFolder);
  console.log('in folder', process.cwd());
  return current;
}
currentFolder = toFolder(gitRepoFolder);
*/

/*
folders.to(gitRepoFolder)
  .then()
  .then(folders.comeBack)
  .done();*/

/*
commits.all(gitRepoFolder)
  .then(R.take(2))
  .then(commits.byId)
  .then(console.log)
  .done();
*/

/*
sourceFiles(gitRepoFolder)
  .then(console.log)
  .done();
*/

// find commit responsible for each line in the found source files
/*
folders.to(gitRepoFolder)
  .then(d3h.hermit(sourceFiles))
  .tap(console.log)
  .then(commitPerLine)
  .then(console.log)
  .then(folders.comeBack)
  .done();
*/

repoToCoverage(gitRepoFolder, R.take(2))
  .then(console.log)
  .done();

/*
var glob = require('glob');
var jsFiles = glob.sync('*.js');
console.log('found js files');
console.log(jsFiles.join('\n'));

var initialCoverage = totalCoverage(jsFiles);
la(check.object(initialCoverage), 'could not compute initial coverage', jsFiles);
// console.log(initialCoverage['app.js'].statementMap);

var blameForFiles = jsFiles.map(function (filename) {
  return ggit.blame(filename);
});

function reportCoverage(coverage, commitId, update) {
  la(check.maybe.unemptyString(commitId), 'commit id should be a string', commitId);

  // console.log(coverage);

  var collector = new Collector();
  collector.add(coverage);

  var Report = istanbul.Report;

  var summaryReport = Report.create('text-summary');
  summaryReport.writeReport(collector);

  var dir = commitId ? 'commit_' + commitId : 'html_report';
  var fullDir = join(__dirname, dir);
  console.log('full dir', fullDir);
  var htmlReport = Report.create('html', {
    dir: fullDir
  });
  htmlReport.writeReport(collector, true);

  var coverageFilename = join(fullDir,
    update ? 'updated-coverage.json' : 'commit-coverage.json');
  fs.writeFileSync(coverageFilename, JSON.stringify(coverage, null, 2), 'utf-8');
}
*/

// codeLinesInFile('./app.js');
/*
var updatedCoverageFilename = join(__dirname, '../html-report/coverage.json');
la(fs.existsSync(updatedCoverageFilename),
  'cannot find updated coverage', updatedCoverageFilename);
var updatedCoverage = JSON.parse(fs.readFileSync(updatedCoverageFilename, 'utf-8'));
console.log('updated coverage from file', updatedCoverageFilename);

var commitFolders = glob.sync(__dirname + '/commit_*');
console.log('commit folders', commitFolders);
var commitIds = commitFolders.map(R.replace(/^commit\_/, ''));
// console.log('commit ids', commitIds);

// console.log('updated coverage');
// console.log(updatedCoverage);

function updateCommitCoverageFolder(updatedCoverage, commitFolder) {
  la(check.unemptyString(commitFolder), 'missing commit folder');
  console.log('updating coverage in folder', commitFolder);
  var initialCommitCoverageFilename = join(commitFolder, 'commit-coverage.json');
  la(fs.existsSync(initialCommitCoverageFilename), 'cannot find file', initialCommitCoverageFilename);
  var initialCoverage = JSON.parse(fs.readFileSync(initialCommitCoverageFilename, 'utf-8'));
  Object.keys(updatedCoverage).forEach(function (coveredFilename) {
    console.log('covered file', coveredFilename);
    if (!initialCoverage[coveredFilename]) {
      return;
    }

    var updatedFileCoverage = updatedCoverage[coveredFilename];
    Object.keys(updatedFileCoverage.s).forEach(function (statementId) {
      var covered = updatedFileCoverage.s[statementId];
      if (covered) {
        if (check.has(initialCoverage[coveredFilename].s, statementId)) {
          initialCoverage[coveredFilename].s[statementId] = covered;
        }
      }
    });
  });

  var commitId = commitFolder.replace(/^.*commit\_/, '');
  la(check.unemptyString(commitId), 'could not find commit id', commitFolder);
  reportCoverage(initialCoverage, commitId, true);
}
commitFolders.forEach(_.partial(updateCommitCoverageFolder, updatedCoverage));
*/
