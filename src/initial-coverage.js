require('lazy-ass');
var check = require('check-more-types');
var d3h = require('d3-helpers');

var folders = require('chdir-promise');
var sourceFiles = require('ggit').trackedFiles;
var fileCoverage = require('./file-coverage');

function initialCoverage(folder) {
  return folders.to(folder)
    .then(d3h.hermit(sourceFiles))
    .tap(check.arrayOfStrings)
    .then(fileCoverage)
    .tap(folders.comeBack);
}

module.exports = check.defend(initialCoverage,
  check.unemptyString, 'need git repo folder name');

/* returns initial default instrumented coverage for js files in given repo
  var initialCover;
  initialCoverage(gitRepoFolder)
    .then(function (coverage) {
      initialCover = coverage;
    })
    .done();
*/
