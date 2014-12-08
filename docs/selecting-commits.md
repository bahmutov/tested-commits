## Selecting commits

You can pick commits to track coverage for using `--coverage` option.

* `--coverage <N>` picks last N commits to look at
* `--coverage <SHA-1>` picks commit with full SHA id (40 hex characters)
* `--coverage <short SHA-1>` picks commit with short SHA id (7 hex characters), usually
displayed when you call `git log --oneline` inside a repo.
