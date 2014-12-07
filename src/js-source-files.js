require('lazy-ass');
var check = require('check-more-types');
var glob = require('glob');
var q = require('q');
var folder = require('./folder');

function findFiles(pattern) {
  pattern = pattern || '**/*.js';
  var jsFiles = glob.sync(pattern);
  return q(jsFiles);
  // console.log('found js files');
  // console.log(jsFiles.join('\n'));
}

function sourceFiles(folderName, pattern) {
  if (folderName) {
    return folder.to(folderName)
      .then(findFiles.bind(null, pattern))
      .tap(folder.comeBack);
  }
  return findFiles(pattern);
}

module.exports = check.defend(sourceFiles,
  check.maybe.unemptyString, 'expected folder name',
  check.maybe.unemptyString, 'expected glob pattern');
