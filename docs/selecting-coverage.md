## Selecting coverage

You can update current coverage from a file or url. Just make sure
the coverage JSON was generated using [istanbul](https://www.npmjs.org/package/istanbul).
Some tools that use istanbul are [Karma](https://www.npmjs.org/package/karma), 
[gt](https://github.com/bahmutov/gt) and [was-tested](https://github.com/bahmutov/was-tested).

* `--update <path/to/cover.json>` reads file from disk
* `--update <hostname/url/to/coverage>` loads JSON file from given url

After loading the combined coverage information, each commit's data will be updated
and saved again. Multiple updates keep incrementing the counters inside the individual commits.
