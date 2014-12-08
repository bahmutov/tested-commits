require('lazy-ass');
var check = require('check-more-types');
var glob = require('glob');
var q = require('q');
var folder = require('./folder');
var isTracked = require('ggit').isTracked;
var R = require('ramda');

function findFiles(pattern) {
  pattern = pattern || '**/*.js';
  var jsFiles = glob.sync(pattern);
  return q(jsFiles);
  // console.log('found js files');
  // console.log(jsFiles.join('\n'));
}

function leaveTracked(filenames) {
  la(check.arrayOfStrings(filenames), 'expected list of filenames', filenames);
  return q.all(filenames.map(isTracked))
    .then(R.zipObj(filenames))
    .then(R.pickBy(R.eq(true)))
    .then(R.keys);
}

function sourceFiles(folderName, pattern) {
  if (folderName) {
    return folder.to(folderName)
      .then(findFiles.bind(null, pattern))
      .then(leaveTracked)
      .tap(folder.comeBack);
  }
  return findFiles(pattern)
    .then(leaveTracked);
}

module.exports = check.defend(sourceFiles,
  check.maybe.unemptyString, 'expected folder name',
  check.maybe.unemptyString, 'expected glob pattern');
