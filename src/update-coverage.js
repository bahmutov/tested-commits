require('lazy-ass');
var check = require('check-more-types');
var fs = require('fs');
var path = require('path');
var join = path.join;
var read = fs.readFileSync;
var exists = fs.existsSync;
var _ = require('lodash');

function updateCoverage(initial, updated) {
  var modified = _.deepClone(initial);
  initial = null;

  Object.keys(updated).forEach(function (updatedName) {
    var updatedPath = updated[updatedName].path;
    la(check.absolute(updatedPath), 'expected updated path to be absolute', updated[updatedName]);

    console.log('updating coverage for file', updatedPath);
    if (!modified[updatedPath]) {
      console.log('  no initial coverage for file', updatedPath);
      return;
    }

    /*
    var updatedFileCoverage = updatedCoverage[coveredFilename];
    Object.keys(updatedFileCoverage.s).forEach(function (statementId) {
      var covered = updatedFileCoverage.s[statementId];
      if (covered) {
        if (check.has(initialCoverage[coveredFilename].s, statementId)) {
          initialCoverage[coveredFilename].s[statementId] = covered;
        }
      }
    });*/
  });

  return modified;
}

function updateCommitCoverage(commitId, combinedCoverage) {
  la(check.commitId(commitId), 'expected commit id', commitId);
  var filename = join(process.cwd(), 'commits', commitId, 'commit-coverage.json');
  if (!exists(filename)) {
    console.log('cannot find individual commit coverage file', filename);
  }

  var initialCoverage = JSON.parse(read(filename, 'utf-8'));
  return updateCoverage(initialCoverage, combinedCoverage);
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}


function updateSeparateCoverages(updatedCoverage) {
  var commitsFolder = join(process.cwd(), 'commits');
  la(exists(commitsFolder), 'cannot find folder', commitsFolder);
  var ids = getDirectories(commitsFolder);
  la(check.arrayOfStrings(ids), 'expected subfolders');
  la(ids.every(check.commitId), 'expected SHA ids as subfolders', ids);
  console.log(ids);
}

/*
function updateSeparateCoverages(updatedCoverage, commitFolder) {
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

module.exports = check.defend(updateSeparateCoverages,
  check.object, 'need updated coverage object');

/* takes separate coverages by commit id and updates them with new test coverage info */
