# tested-commits v0.4.0

> JavaScript code coverage split by commit

[![NPM][tested-commits-icon] ][tested-commits-url]

[![Build status][tested-commits-ci-image] ][tested-commits-ci-url]
[![dependencies][tested-commits-dependencies-image] ][tested-commits-dependencies-url]
[![devdependencies][tested-commits-devdependencies-image] ][tested-commits-devdependencies-url]
[![Codacy Badge][tested-commits-codacy-image] ][tested-commits-codacy-url]

[tested-commits-icon]: https://nodei.co/npm/tested-commits.png?downloads=true
[tested-commits-url]: https://npmjs.org/package/tested-commits
[tested-commits-ci-image]: https://travis-ci.org/bahmutov/tested-commits.png?branch=master
[tested-commits-ci-url]: https://travis-ci.org/bahmutov/tested-commits
[tested-commits-dependencies-image]: https://david-dm.org/bahmutov/tested-commits.png
[tested-commits-dependencies-url]: https://david-dm.org/bahmutov/tested-commits
[tested-commits-devdependencies-image]: https://david-dm.org/bahmutov/tested-commits/dev-status.png
[tested-commits-devdependencies-url]: https://david-dm.org/bahmutov/tested-commits#info=devDependencies
[tested-commits-codacy-image]: https://www.codacy.com/project/badge/a5a2347fd20446dfa100b1535e0183b7
[tested-commits-codacy-url]: https://www.codacy.com/public/bahmutov/tested-commits.git



```
tested-commits - JavaScript code coverage split by commit
  version: 0.4.0
  author: "Gleb Bahmutov <gleb.bahmutov@gmail.com>"

Options:
  --version, -v   show version and exit                          [default: false]
  --repo          git repo path                                  [default: "."]
  --reset, -r     erase previously collected coverage            [default: false]
  --commits, -c   commit filter, for example pick last two -c 2  [default: 5]
  --coverage, -x  path to JSON coverage file to use            
  --files, -f     filter input files expression

```

### Selecting commits

You can pick commits to track coverage for using `--commits` option.

* `--commits <N>` picks last N commits to look at
* `--commits <SHA-1>` picks commit with full SHA id (40 hex characters)
* `--commits <short SHA-1>` picks commit with short SHA id (7 hex characters), usually
displayed when you call `git log --oneline` inside a repo.
* `--commits <part of the commit message>` finds latest commit that contains exact message.



### Selecting coverage

You can update current coverage from a file or url. Just make sure
the coverage JSON was generated using [istanbul](https://www.npmjs.org/package/istanbul).
Some tools that use istanbul are [Karma](https://www.npmjs.org/package/karma), 
[gt](https://github.com/bahmutov/gt) and [was-tested](https://github.com/bahmutov/was-tested).

* `--coverage <path/to/cover.json>` reads file from disk
* `--coverage <hostname/url/to/coverage>` loads JSON file from given url



### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/tested-commits/issues) on Github



## MIT License

The MIT License (MIT)

Copyright (c) 2014 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


