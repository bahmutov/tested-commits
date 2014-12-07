require('lazy-ass');
var check = require('check-more-types');
var ggit = require('ggit');
var fs = require('fs');

// returns commit info inside given repo folder
function commits(gitRepoRootFolder) {
  la(check.unemptyString(gitRepoRootFolder), 'missing git repo folder');
  la(fs.existsSync(gitRepoRootFolder), 'cannot find folder', gitRepoRootFolder);

  return ggit.getOneLineLog().then(function (commits) {
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
}

module.exports = commits;
