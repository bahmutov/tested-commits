require('lazy-ass');
var check = require('check-more-types');

function repoNameToSlug(repoName) {
  la(check.unemptyString(repoName), 'missing repo name', repoName);
  var name = require('path').basename(repoName);
  var slug = require('slug');
  return slug(name);
}

module.exports = {
  repoNameToSlug: repoNameToSlug
};
