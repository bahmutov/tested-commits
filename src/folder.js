require('lazy-ass');
var check = require('check-more-types');
var q = require('q');
var fs = require('fs');
var S = require('spots');

// stack
var folders = [];

function _to(folderName) {
  la(check.unemptyString(folderName), 'missing git repo folder');
  la(fs.existsSync(folderName), 'cannot find folder', folderName);

  var current = process.cwd();
  la(check.unemptyString(folderName), 'missing folder');
  process.chdir(folderName);
  console.log('in folder', process.cwd());

  folders.push(current);

  return current;
}

function comeBack() {
  if (!folders.length) {
    return;
  }
  var folder = folders.pop();
  process.chdir(folder);
  console.log('restored folder', folder);
  return folder;
}

module.exports = {
  to: S(q.try, _to, S),
  comeBack: comeBack
};

/* typical example
  var folders = require('./src/folder');
  folders.to('foo/bar/folder')
    // do something inside foo/bar/folder
    .then(folders.comeBack)
    .done();

  if you need to return value before returning use Q.tap
  folders.to('foo/bar/folder')
    .then(function () {
      return 'foo';
    })
    .tap(folders.comeBack);
    // resolved with value 'foo'
*/
