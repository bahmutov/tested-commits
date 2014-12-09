require('lazy-ass');
var check = require('check-more-types');
var fs = require('fs');
var path = require('path');
var join = path.join;
var read = fs.readFileSync;
var exists = fs.existsSync;
var _ = require('lodash');
var R = require('ramda');
var q = require('q');
var reportCoverage = require('./report-coverage');
var config = require('./config')();
var getSavedCommitsFor = require('./get-commits-folders');
var savedCommitFolder = require('./utils').savedCommitFolder;

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

function updateCommitCoverage(combinedCoverage, repoName, commitId) {
  la(check.commitId(commitId), 'expected commit id', commitId);

  var commitFolder = savedCommitFolder(repoName, commitId);

  var filename = join(commitFolder, config.latestCommitCoverageFilename);
  if (!exists(filename)) {
    filename = join(commitFolder, config.initialCommitCoverageFilename);
  }

  if (!exists(filename)) {
    console.log('cannot find individual commit coverage file', filename);
    return;
  }

  console.log('updating split coverage for commit', commitId);

  var initialCoverage = JSON.parse(read(filename, 'utf-8'));
  var modified = updateCoverage(initialCoverage, combinedCoverage);
  la(check.object(modified), 'could not get modified coverage for commit', commitId);
  la(modified !== initialCoverage, 'we should not modify initial coverage for commit', commitId);

  reportCoverage(modified, commitId, true, repoName);
}

function updateSplitCoverages(updatedCoverage, repoName) {
  var ids = getSavedCommitsFor(repoName);
  la(check.arrayOfStrings(ids), 'could not get saved commit ids for repo', repoName);
  // console.log('updating split coverage for ids');
  // console.log(ids);

  ids.forEach(R.lPartial(updateCommitCoverage, updatedCoverage, repoName));
}

function isCoverageJsonFilename(arg) {
  return check.unemptyString(arg) &&
    path.extname(arg.toLowerCase()) === '.json';
}

function isRemoteUrl(x) {
  return check.unemptyString(x) &&
    (check.webUrl(x) || /^localhost/.test(x) || /^127\.0\.0\.1/.test(x));
}

function isFolder(arg) {
  return exists(arg) &&
    fs.statSync(arg).isDirectory();
}

function downloadCoverage(url) {
  if (!/^http/.test(url)) {
    url = 'http://' + url;
  }
  console.log('downloading coverage from', url);
  var request = require('request');
  request.debug = true;
  var defer = q.defer();
  request.get(url, function (err, response, body) {
    if (err) {
      defer.reject(err);
    }
    defer.resolve(JSON.parse(body));
  });
  return defer.promise;
}

function getCoverage(filename) {
  console.log('getting coverage from', filename);
  if (isRemoteUrl(filename)) {
    return downloadCoverage(filename);
  } else {
    la(check.unemptyString(filename), 'expected filename', arguments);
    la(exists(filename), 'cannot find file', filename);
    return q(JSON.parse(read(filename, 'utf-8')));
  }
}

function splitCoverage(baseFolder, coverage) {
  la(check.object(coverage), 'expected coverage object', coverage);
  R.values(coverage).forEach(function (fileCoverage) {
    la(check.has(fileCoverage, 'path'),
      'cannot find path property in file coverage', fileCoverage);

    if (!check.absolute(fileCoverage.path)) {
      fileCoverage.path = path.resolve(baseFolder, fileCoverage.path);
    }
  });
  return updateSplitCoverages(coverage, baseFolder);
}

function updateSplitCoverageFromRepo(filename, baseFolder) {
  la(check.unemptyString(filename), 'cannot find coverage file', filename);

  return getCoverage(filename)
    .then(R.lPartial(splitCoverage, baseFolder));
}

function updateSplitCoverageFromFile(filename) {
  return updateSplitCoverageFromRepo(filename, path.dirname(filename));
}

function update() {
  switch (arguments.length) {
    case 1:
      if (isRemoteUrl(arguments[0]) || isCoverageJsonFilename(arguments[0])) {
        return updateSplitCoverageFromFile(arguments[0]);
      }
    break;
    case 2:
      if ((isRemoteUrl(arguments[0]) || isCoverageJsonFilename(arguments[0])) &&
        isFolder(arguments[1])) {
        return updateSplitCoverageFromRepo(arguments[0], arguments[1]);
      }
    break;
  }

  la(false, 'Cannot update split coverage from arguments', arguments);
}

module.exports = update;

/* takes separate coverages by commit id and updates them with new test coverage info */
