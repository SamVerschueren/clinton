# clinton [![Build Status](https://travis-ci.org/SamVerschueren/clinton.svg?branch=master)](https://travis-ci.org/SamVerschueren/clinton)

> Project style linter

**WIP: This is a work-in-progress library that is not yet available. Lots of things have to be added, tweaked and removed.**

## Install

```
$ npm install --save clinton
```


## Usage

```js
const lint = require('clinton');

lint('/Users/sam/projects/clinton', {rules: {'license-mit': 'error'}}).then(validations => {
	console.log(validations);
	/*
		[
			{
				name: 'license-mit',
				severity: 'error',
				message: 'No MIT license found.'
			}
		]
	*/
});
```

Instead of passing the rules as an option, you can also add them to your `package.json` file.

```json
{
  "name": "foo",
  "license": "ISC",
  "clinton": {
    "rules": {
      "license-mit": "error"
    }
  }
}
```


## API

### lint(path, [options])

#### path

Type: `string`

Project path.

#### options

##### rules

Type: `object`

Rules map. Overrides the rules configured in the `package.json` of the project.

##### plugins

Type: `string[]`

List of plugin names.

##### cwd

Type: `string`

Current working directory when linting local projects.


## CLI

```
  Usage
    $ clinton <path>

  Examples
    $ clinton ~/projects/project
	  error    No MIT license found. (license-mit)
```


## Related

- [gh-lint-brainstorm](https://github.com/SamVerschueren/gh-lint-brainstorm) - Brainstorming repository for this module


## License

MIT © [Sam Verschueren](http://github.com/SamVerschueren)
