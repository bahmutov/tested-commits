require('lazy-ass');
var check = require('check-more-types');
var ggit = require('ggit');
var fs = require('fs');
var folders = require('./folder');

// returns commit info inside given repo folder
function commits(gitRepoRootFolder) {
  la(check.unemptyString(gitRepoRootFolder), 'missing git repo folder');
  la(fs.existsSync(gitRepoRootFolder), 'cannot find folder', gitRepoRootFolder);

  return folders.to(gitRepoRootFolder)
    .then(ggit.getOneLineLog)
    .tap(folders.comeBack);
}

module.exports = commits;

/*
  // returns commits from given repo folder
  // latest commits first

  // get last 2 commits and print them
  commits(gitRepoFolder)
    .then(R.take(2))
    .then(console.table)
    .done();
*/
