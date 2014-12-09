require('lazy-ass');
var check = require('check-more-types');
var getSavedCommitsFor = require('./get-commits-folders');
var savedCommitFolder = require('./utils').savedCommitFolder;
var opener = require('opener');
var exists = require('fs').existsSync;
var join = require('path').join;

function openReports(repoName) {
  if (!repoName || repoName === '.') {
    repoName = require('path').basename(process.cwd());
  }
  console.log('opening saved commit reports for repo', repoName);

  var ids = getSavedCommitsFor(repoName);
  ids.forEach(function (commitId) {
    var commitFolder = savedCommitFolder(repoName, commitId);
    la(check.unemptyString(commitFolder), 'could not form saved commit folder', repoName, commitId);
    if (!exists(commitFolder)) {
      console.error('Cannot find folder', commitFolder);
      return;
    }

    var index = join(commitFolder, 'index.html');
    if (!exists(commitFolder)) {
      console.error('Cannot find html report file', index);
      return;
    }
    opener(index);
  });
}

module.exports = check.defend(openReports,
  check.maybe.unemptyString, 'missing repo name');

/* takes separate coverages by commit id and updates them with new test coverage info */
