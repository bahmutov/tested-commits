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
var reportCoverage = require('./src/report-coverage');
var initialCoverage = require('./src/initial-coverage');
var updateCoverage = require('./src/update-coverage');

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

/*
repoToCoverage(gitRepoFolder, R.take(2))
  // .tap(console.log)
  .then(function (separateCoverage) {
    check.object(separateCoverage, 'missing separate coverage', separateCoverage);
    reportCoverage(separateCoverage, false);
  })
  .done();*/

/*
var initialCover;
initialCoverage(gitRepoFolder)
  .tap(console.log)
  .then(function (coverage) {
    initialCover = coverage;
  })
  .done();
*/

updateCoverage({});


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
