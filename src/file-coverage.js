require('lazy-ass');
var check = require('check-more-types');
var R = require('ramda');
var read = require('fs').readFileSync;
var istanbul = require('istanbul');

function fileCoverage(filenames) {
  var coverages = filenames.map(codeLinesInFile);
  var coverage = R.zipObj(filenames, coverages);
  return coverage;
}

function codeLinesInFile(filename) {
  var src = read(filename, 'utf-8');
  la(check.unemptyString(src), 'could not read file', filename);

  var instrumenter = new istanbul.Instrumenter();
  var instrumented = instrumenter.instrumentSync(src, filename);
  // console.log('instrumented code');
  // console.log(instrumented);
  var coverage = instrumenter.lastFileCoverage();

  // remove branch and function coverage
  coverage.f = {};
  coverage.b = {};
  coverage.fnMap = {};

  return coverage;
}

module.exports = check.defend(fileCoverage,
  check.arrayOfStrings, 'need list of files');
