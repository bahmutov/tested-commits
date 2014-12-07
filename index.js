require('q').longStackSupport = true;

require('lazy-ass');
var check = require('check-more-types');
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

var folders = require('./src/folder');

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

folders.to(gitRepoFolder)
  .then(folders.comeBack)
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

function codeLinesInFile(filename) {
  var src = read(filename, 'utf-8');
  la(check.unemptyString(src), 'could not read file', filename);
  var instrumented = instrumenter.instrumentSync(src, filename);
  // console.log('instrumented code');
  // console.log(instrumented);
  var coverage = instrumenter.lastFileCoverage();

  // remove branch and function coverage
  coverage.f = {};
  coverage.b = {};
  coverage.fnMap = {};

  return coverage;
}

function totalCoverage(filenames) {
  la(check.arrayOfStrings(filenames), 'expected array of filenames', filenames);
  var coverage = {};
  filenames.forEach(function (name) {
    var fileCoverage = codeLinesInFile(name);
    la(check.object(fileCoverage), 'could not get code coverage for', name);
    coverage[name] = fileCoverage;
  });
  return coverage;
}

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

function modifiedLinesForCommit(blames, commitId) {
  la(check.unemptyString(commitId), 'expected commit id');
  // console.log(blames);
  var n = 0;
  _.forEach(blames, function (lines, filename) {
    // console.log('lines');
    // console.log(lines);

    la(check.array(lines), 'expected line info for file', filename);
    lines.forEach(function (blame) {
      la(check.unemptyString(blame.commit), blame);
      if (blame.commit === commitId) {
        n += 1;
      }
    });
  });
  return n;
}

function isLineInCommit(commitId, filename, blames, lineNumber) {
  la(check.unemptyString(commitId), 'expected commit id', commitId);
  la(check.positiveNumber(lineNumber), 'expected line number', lineNumber);

  var blameForFile = blames[filename];
  if (!blameForFile) {
    return false;
  }

  la(check.array(blameForFile), 'expected line info for file', filename);

  var blameInfoForLine = blameForFile[lineNumber - 1];
  la(check.object(blameInfoForLine), 'could not get blame info for file', filename,
    'line', lineNumber);
  la(check.unemptyString(blameInfoForLine.commit), blameInfoForLine);
  return blameInfoForLine.commit === commitId;
}

function modifiedLineNumberPerCommit(info) {
  la(check.object(info.commits));
  var ids = Object.keys(info.commits);
  var ns = _.map(ids, _.partial(modifiedLinesForCommit, info.files));

  console.log('modified lines per commit');
  console.log(ns);

  var modified = {};

  ids.forEach(function (id, k) {
    modified[id] = ns[k];
  });
  console.table('commits', info.commits);
  console.table('modified lines', modified);
}

function leaveModifiedStatements(commitId, coverage, filesBlame) {
  _.forEach(filesBlame, function (lines, filename) {
    var fileCoverage = coverage[filename];
    if (!fileCoverage) {
      return;
    }

    var notCovered = [];

    _.forEach(fileCoverage.s, function (bit, s) {
      var statementMap = fileCoverage.statementMap[s];
      var coveredLines = {
        start: statementMap.start.line,
        end: statementMap.end.line
      };
      la(check.positiveNumber(coveredLines.start), 'missing start line', statementMap);
      la(check.positiveNumber(coveredLines.end), 'missing end line', statementMap);
      la(coveredLines.end >= coveredLines.start, 'invalid start and end lines', statementMap);

      var k, statementInCommit = false;
      for (k = coveredLines.start; k <= coveredLines.end; k += 1) {
        var lineInCommit = isLineInCommit(commitId, filename, filesBlame, k);
        if (lineInCommit) {
          statementInCommit = true;
        }
      }
      // console.log(filename, 'statement', s, 'was coveraged?', Boolean(bit), 'in this commit?', statementInCommit);
      if (!statementInCommit) {
        notCovered.push(s);
      }
    });

    // console.log('removing statement coverage', notCovered);
    notCovered.forEach(function removeStatementCoverage(id) {
      delete fileCoverage.s[id];
      delete fileCoverage.statementMap[id];
    });
  });
}

function modifiedCoveragePerCommit(info) {
  var ids = Object.keys(info.commits);
  ids.forEach(function (commitId) {
    console.log('processing commit', commitId);
    var commitCoverage = _.cloneDeep(initialCoverage);
    leaveModifiedStatements(commitId, commitCoverage, info.files);
    reportCoverage(commitCoverage, commitId);
  });
}
*/

// compute per-commit coverage for foo-bar-baz project
/*
ggit.getOneLineLog().then(function (commits) {
  la(check.array(commits), 'commits', commits);
  console.log('found', commits.length, 'commits');

  var ids = R.map(R.prop('id'))(commits);
  var messages = R.map(R.prop('message'))(commits);
  var commitInfo = R.zipObj(ids, messages);

  return q.all(blameForFiles).then(function (blames) {
    la(check.array(blames), 'blame info', blames);
    console.log('found blame info for', blames.length, 'files');

    var fileBlame = R.zipObj(jsFiles, blames);

    // console.log(blames);
    return {
      commits: commitInfo,
      files: fileBlame
    };
  });

}).then(modifiedCoveragePerCommit)
.finally(function () {
  process.chdir(currentFolder);
}).done();
*/

/*
ggit.blame('./app.js').then(function (blames) {
  console.log(blames);
}).done();
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
