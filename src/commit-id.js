var check = require('check-more-types');

// typical git SHA commit id is 40 digit hex string, like
// 3b819803cdf2225ca1338beb17e0c506fdeedefc
var shaReg = /^[0-9a-f]{40}$/;
function isCommitId(id) {
  return check.string(id) &&
    id.length === 40 &&
    shaReg.test(id);
}

check.mixin(isCommitId, 'commitId');

// when using git log --oneline short ids are displayed, first 7 characters
var shortShaReg = /^[0-9a-f]{7}$/;
function isShortCommitId(id) {
  return check.string(id) &&
    id.length === 7 &&
    shortShaReg.test(id);
}

check.mixin(isShortCommitId, 'shortCommitId');

var resolve = require('path').resolve;

function isAbsolutePath(path) {
  la(check.unemptyString(path), 'expected path string, got', path);
  return resolve(path) === path;
}

check.mixin(isAbsolutePath, 'absolute');
