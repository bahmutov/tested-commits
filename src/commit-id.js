var check = require('check-more-types');

// typical git SHA commit id is 40 digit hex string, like
// 3b819803cdf2225ca1338beb17e0c506fdeedefc
function isCommitId(id) {
  return check.string(id) && id.length === 40;
}

check.mixin(isCommitId, 'commitId');

var resolve = require('path').resolve;

function isAbsolutePath(path) {
  return resolve(path) === path;
}

check.mixin(isAbsolutePath, 'absolute');
