require('lazy-ass');
var check = require('check-more-types');
var fs = require('fs');
var path = require('path');
var join = path.join;
var read = fs.readFileSync;
var exists = fs.existsSync;
var _ = require('lodash');
var R = require('ramda');
var reportCoverage = require('./report-coverage');

function findCoverage(coverage, path) {
  la(check.absolute(path), 'expected absolute path to search for', path);
  return R.find(R.propEq('path', path))(R.values(coverage));
}

function updateCoverage(initial, updated) {
  var modified = _.cloneDeep(initial);
  initial = null;

  Object.keys(updated).forEach(function (updatedName) {
    var updatedPath = updated[updatedName].path;
    la(check.absolute(updatedPath), 'expected updated path to be absolute', updated[updatedName]);

    console.log('updating coverage for file', updatedPath);
    var fileCoverage = findCoverage(modified, updatedPath);
    if (!fileCoverage) {
      console.log('  no initial coverage for file', updatedPath);
      return;
    }

    var updatedFileCoverage = updated[updatedName];
    Object.keys(updatedFileCoverage.s).forEach(function (statementId) {
      var covered = updatedFileCoverage.s[statementId];
      if (covered) {
        if (check.has(fileCoverage.s, statementId)) {
          fileCoverage.s[statementId] = covered;
        }
      }
    });
  });

  return modified;
}

function updateCommitCoverage(combinedCoverage, commitId) {
  la(check.commitId(commitId), 'expected commit id', commitId);
  var filename = join(process.cwd(), 'commits', commitId, 'commit-coverage.json');
  if (!exists(filename)) {
    console.log('cannot find individual commit coverage file', filename);
  }

  console.log('updating split coverage for commit', commitId);

  var initialCoverage = JSON.parse(read(filename, 'utf-8'));
  var modified = updateCoverage(initialCoverage, combinedCoverage);
  la(check.object(modified), 'could not get modified coverage for commit', commitId);
  la(modified !== initialCoverage, 'we should not modify initial coverage for commit', commitId);

  reportCoverage(modified, commitId, true);
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function updateSplitCoverages(updatedCoverage) {
  var commitsFolder = join(process.cwd(), 'commits');
  la(exists(commitsFolder), 'cannot find folder', commitsFolder);
  var ids = getDirectories(commitsFolder);
  la(check.arrayOfStrings(ids), 'expected subfolders');
  la(ids.every(check.commitId), 'expected SHA ids as subfolders', ids);

  // console.log('updating split coverage for ids');
  // console.log(ids);

  ids.forEach(R.lPartial(updateCommitCoverage, updatedCoverage));
}

function isCoverageJsonFilename(arg) {
  return check.unemptyString(arg) &&
    path.extname(arg.toLowerCase()) === '.json';
}

function updateSplitCoverageFromFile(filename) {
  la(check.unemptyString(filename) && exists(filename),
    'cannot find coverage file', filename);
  var coverage = JSON.parse(read(filename, 'utf-8'));
  la(check.object(coverage), 'could not read coverage from file', filename);

  var baseFolder = path.dirname(filename);
  R.values(coverage).forEach(function (fileCoverage) {
    la(check.has(fileCoverage, 'path'),
      'cannot find path property in file coverage', fileCoverage, 'in file', filename);

    if (!check.absolute(fileCoverage.path)) {
      fileCoverage.path = path.resolve(baseFolder, fileCoverage.path);
    }
  });
  return updateSplitCoverages(coverage);
}

function update() {
  if (arguments.length === 1 && isCoverageJsonFilename(arguments[0])) {
    return updateSplitCoverageFromFile(arguments[0]);
  }

  la(false, 'Cannot update split coverage from arguments', arguments);
}

module.exports = update;

/* takes separate coverages by commit id and updates them with new test coverage info */
