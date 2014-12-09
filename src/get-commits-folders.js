require('lazy-ass');
var check = require('check-more-types');
var fs = require('fs');
var path = require('path');
var join = path.join;
var exists = fs.existsSync;
var config = require('./config')();
var utils = require('./utils');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function (file) {
    return fs.statSync(join(srcpath, file)).isDirectory();
  });
}

function getSavedCommitIdsFor(repoName) {
  la(check.unemptyString(repoName), 'cannot determine repo name', repoName);
  if (repoName === '.') {
    repoName = require('path').basename(process.cwd());
  }
  console.log('repo name', repoName);
  var slugName = utils.repoNameToSlug(repoName);
  la(check.unemptyString(slugName), 'could not convert to slug', repoName);

  var commitsFolder = join(config.commitsFolder, repoName);
  la(exists(commitsFolder), 'cannot find folder', commitsFolder);

  var ids = getDirectories(commitsFolder);
  la(check.arrayOfStrings(ids), 'expected subfolders');
  la(ids.every(check.commitId), 'expected SHA ids as subfolders', ids, 'in folder', commitsFolder);

  return ids;
}

module.exports = check.defend(getSavedCommitIdsFor,
  check.unemptyString, 'need repo name');
