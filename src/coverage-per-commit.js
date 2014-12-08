require('lazy-ass');
var check = require('check-more-types');
var _ = require('lodash');

function isLineInCommit(commitId, filename, blames, lineNumber) {
  la(check.unemptyString(commitId), 'expected commit id', commitId);
  la(check.positiveNumber(lineNumber), 'expected line number', lineNumber);

  var blameForFile = blames[filename];
  if (!blameForFile) {
    return false;
  }

  la(check.array(blameForFile), 'expected line info for file', filename, 'got', blameForFile);

  var blameInfoForLine = blameForFile[lineNumber - 1];
  la(check.object(blameInfoForLine), 'could not get blame info for file', filename,
    'line', lineNumber);
  la(check.unemptyString(blameInfoForLine.commit), blameInfoForLine);
  return blameInfoForLine.commit === commitId;
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

function coveragePerCommit(coverage, commits, commitsPerLine) {
  var ids = Object.keys(commits);
  la(ids.every(check.commitId), 'expected commit ids', ids);

  var commitIdToCoverage = {};
  ids.forEach(function (commitId) {
    console.log('coverage for commit', commitId);
    var commitCoverage = _.cloneDeep(coverage);
    leaveModifiedStatements(commitId, commitCoverage, commitsPerLine);
    // reportCoverage(commitCoverage, commitId);
    commitIdToCoverage[commitId] = commitCoverage;
  });

  return commitIdToCoverage;
}

module.exports = check.defend(coveragePerCommit,
  check.object, 'expected coverage object',
  check.object, 'need object of commits',
  check.object, 'need object of commits per line');
