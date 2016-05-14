# gh-lint [![Build Status](https://travis-ci.org/SamVerschueren/gh-lint.svg?branch=master)](https://travis-ci.org/SamVerschueren/gh-lint)

> Project style linter

**WIP: This is a work-in-progress library that is not yet available. Lots of things have to be added, tweaked and removed.**

## Install

```
$ npm install --save gh-lint
```


## Usage

```js
const lint = require('gh-lint');

lint('/Users/sam/projects/gh-lint').then(validations => {
	console.log(validations);
	//=> error and warning objects
});
```


## API

### lint(path, [options])

#### path

Type: `string`

Project path.

#### options

##### plugins

Type: `string[]`

List of plugin names.

##### cwd

Type: `string`

Current working directory when linting local projects.


## CLI

```
  Usage
    $ gh-lint <path>

  Examples
    $ gh-lint ~/projects/project
	  error    No MIT license found. (license-mit)
```


## Related

- [gh-lint-brainstorm](https://github.com/SamVerschueren/gh-lint-brainstorm) - Brainstorming repository for this module


## License

MIT © [Sam Verschueren](http://github.com/SamVerschueren)
