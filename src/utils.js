require('lazy-ass');
var check = require('check-more-types');
var path = require('path');
var join = path.join;
var config = require('./config')();

function repoNameToSlug(repoName) {
  la(check.unemptyString(repoName), 'missing repo name', repoName);

  if (repoName === '.') {
    repoName = process.cwd();
  }

  var name = path.basename(repoName);
  var slug = require('slug');
  return slug(name);
}

function savedCommitFolder(repoName, commitId) {
  var slugName = repoNameToSlug(repoName);
  var commitFolder = join(config.commitsFolder, slugName, commitId);
  return commitFolder;
}

module.exports = {
  repoNameToSlug: repoNameToSlug,
  savedCommitFolder: check.defend(savedCommitFolder,
    check.unemptyString, 'need repo name',
    check.commitId, 'need commit id')
};
