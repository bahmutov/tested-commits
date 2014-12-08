require('lazy-ass');
var ggit = require('ggit');
var check = require('check-more-types');
var q = require('q');
var R = require('ramda');

function toArray(x) {
  return Array.isArray(x) ? x : [x];
}

function zipBlames(filenames, blames) {
  la(check.array(blames), 'blame info', blames);
  console.log('found blame info for', blames.length, 'files');
  la(check.sameLength(filenames, blames),
    'mismatch in blame lengths', filenames, blames);

  var lineBlames = blames.map(toArray);
  var fileBlame = R.zipObj(filenames, lineBlames);
  return fileBlame;
}

// assumes we are inside folder where filenames make sense
// probably inside git repo folder and filenames are relative
// to the repo's root
function commitForEachLine(filenames) {
  var blameForFiles = filenames.map(ggit.blame);
  console.log('blames for', filenames);

  return q.all(blameForFiles)
    .tap(console.log)
    .then(
      R.lPartial(zipBlames, filenames)
    );
}

module.exports = check.defend(commitForEachLine,
  check.arrayOfStrings, 'need filenames');
