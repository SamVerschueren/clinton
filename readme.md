# gh-lint [![Build Status](https://travis-ci.org/SamVerschueren/gh-lint.svg?branch=master)](https://travis-ci.org/SamVerschueren/gh-lint)

> GitHub style linter

**WIP: This is a work-in-progress library that is not yet available. Lots of things have to be added, tweaked and removed.**

## Install

```
$ npm install --save gh-lint
```


## Usage

```js
const lint = require('gh-lint');

lint('SamVerschueren/gh-lint', {token: 'my-github-token'}).then(validations => {
	console.log(validations);
	//=> errors and warning objects
});
```


## API

### lint(input, [options])

#### input

Type: `string`

Name of the repository or local path.

#### options

##### cwd

Type: `string`

Current working directory when linting local projects.

##### branch

Type: `string`<br>
Default: *`default branch`*

Branch name of the GitHub repository.

##### token

Type: `string`

GitHub [access token](https://github.com/settings/tokens/new).

Can be overriden globally with the `GITHUB_TOKEN` environment variable.


## Related

- [gh-lint-brainstorm](https://github.com/SamVerschueren/gh-lint-brainstorm) - Brainstorming repository for this module


## License

MIT © [Sam Verschueren](http://github.com/SamVerschueren)
