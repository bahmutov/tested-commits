// internal config (options)
var pkg = require('../package');
var join = require('path').join;
var tmpdir = require('os').tmpdir;

function config() {
  return {
    commitsFolder: join(tmpdir(), pkg.name, 'commits'),
    initialCommitCoverageFilename: 'commit-coverage.json',
    latestCommitCoverageFilename: 'updated-coverage.json'
  };
}

module.exports = config;
