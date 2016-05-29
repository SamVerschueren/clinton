# clinton [![Build Status](https://travis-ci.org/SamVerschueren/clinton.svg?branch=master)](https://travis-ci.org/SamVerschueren/clinton)

> JavaScript project style linter


## Install

```
$ npm install --save clinton
```


## Usage

```js
const lint = require('clinton');

lint('/Users/sam/projects/clinton', {rules: {'license': ['error', 'MIT']}}).then(validations => {
	console.log(validations);
	/*
		[
			{
				name: 'license',
				severity: 'error',
				message: 'License is not of type MIT (http://www.opensource.org/licenses/MIT).'
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
      "license": ["error", "MIT"]
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
    $ clinton [<path>]

  Examples
    $ clinton
      warn     Use `.editorconfig` to define and maintain consistent coding styles between editors. (editorconfig)

    $ clinton ~/projects/project
	  error    License is not of type MIT (http://www.opensource.org/licenses/MIT). (license)
```


## Rules

- **editorconfig** - Check if a `.editorconfig` file is present.
- **license** - Check if a license file exist.
  - *[type]*: The type of the license. For example `MIT`.
- **no-callback** - Check if the project uses promises instead of callbacks.
- **pkg-files** - `files` property in `package.json` should be provided.
- **pkg-main** - Checks if the file provided in the `main` property in `package.json` exists.
- **pkg-property-order** - Checks the `package.json` property order.
  - *[...order]* - Custom list of properties.
- **pkg-schema** - Validates the schema of `package.json`
- **readme** - Check if a `readme` file is present.
- **test-script** - Check if the `test` script is set.
- **use-travis** - Checks if [Travis CI](https://travis-ci.org/) is used.
- **valid-properties** - Checks if a certain set of properties is defined in `package.json`.
- **valid-version** - Checks if the `version` in `package.json` is a valid semver version.


## Plugins

Everyone can create plugins or custom rules that can be validated with `Clinton`. The name of the plugin should be
`clinton-plugin-*` where `*` is the name of the plugin.

### Example

Let's create a `clinton-plugin-file-exists` rule that checks if the file provided as argument really exists.

```js
'use strict';
const pathExists = require('path-exists');

module.exports = ctx => {
	const fileName = ctx.options[0];

	return pathExists(fileName).then(exists => {
		if(!exists) {
			return {
				message: `File ${fileName} does not exist.`
			};
		}
	});
};
```

You can either return a promise or return an object immediately with a `message` property. The rule is successful if the function
returns nothing.

You can wrap this up in a project, publish it to [npm](https://www.npmjs.com/) and install it in every project where you
want to check if a file in your project really exists.

```json
{
  "name": "Unicorn",
  "description": "My unicorn package",
  "version": "1.0.0",
  "scripts": {
    "test": "clinton"
  },
  "devDependencies": {
    "clinton": "*",
	"clinton-plugin-file-exists": "*"
  },
  "clinton": {
    "file-exists": ["error", "index.js"]
  }
}
```

When running `npm test`, `clinton` will execute your plugin and will use `index.js` as the option argument. The first argument `error`
indicates the severity of the error.


## Related

- [gh-lint-brainstorm](https://github.com/SamVerschueren/gh-lint-brainstorm) - Brainstorming repository for this module


## License

MIT © [Sam Verschueren](http://github.com/SamVerschueren)
