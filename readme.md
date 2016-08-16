# clinton

[![Build Status: Linux](https://travis-ci.org/SamVerschueren/clinton.svg?branch=master)](https://travis-ci.org/SamVerschueren/clinton) [![Build status: Windows](https://ci.appveyor.com/api/projects/status/1lcv1c0eqjtcg83s/branch/master?svg=true)](https://ci.appveyor.com/project/SamVerschueren/clinton/branch/master) [![Coverage Status](https://coveralls.io/repos/github/SamVerschueren/clinton/badge.svg?branch=master)](https://coveralls.io/github/SamVerschueren/clinton?branch=master)


> JavaScript project style linter


## Install

```
$ npm install --save clinton
```


## Usage

```js
const clinton = require('clinton');

clinton.lint('/Users/sam/projects/clinton', {rules: {'license': ['error', 'MIT']}}).then(validations => {
	console.log(validations);
	/*
		[
			{
				ruleId: 'license',
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

### .lint(path, [options])

#### path

Type: `string`

Project path.

#### options

##### rules

Type: `object`

Override any of the [default rules](https://github.com/SamVerschueren/clinton/blob/master/config.js).

##### inherit

Type: `boolean`<br>
Default: `true`

Inherit from the [default rules](https://github.com/SamVerschueren/clinton/blob/master/config.js). Set to `false` if you want to start with a clean sheet.

##### plugins

Type: `string[]`

List of plugin names.

##### ignores

Type: `string[]`

Paths in `.gitignore` are ignored by default. Additional ignores can be added here.

##### cwd

Type: `string`

Current working directory when linting local projects.


## CLI

```
	Usage
	  $ clinton [<path>]

	Options
	  --no-inherit  Prevent inheriting from the default rules.
	  --ignores     Ignore files. Can be added multiple times.
	  --fix         Automatically fix problems.

	Examples
	  $ clinton
        .editorconfig
        ⚠  Use .editorconfig to define and maintain consistent coding styles between editors.     editorconfig

        1  warning

	  $ clinton ~/projects/project
        license
        ✖  No MIT license found.  license-mit

        1  error
```


## Rules

- **ava** - Check if [AVA](https://github.com/avajs/ava) is used and is used correctly.
	- *[version]*: The minimum required `AVA` version or `*` if you want to go unicorn.
- **xo** - Check if [XO](https://github.com/sindresorhus/xo) is used and is used correctly.
	- *[version]*: The minimum required `XO` version or `*` if you want to go unicorn.
- **editorconfig** - Check if a `.editorconfig` file is present and if the project files adhere to the `.editorconfig` settings.
- **license** - Check if a license file exist.
	- *[type]*: The type of the license. For example `MIT`.
- **no-callback** - Check if the project uses promises instead of callbacks.
- **pkg-files** - `files` property in `package.json` should be provided.
- **pkg-main** - Checks if the file provided in the `main` property in `package.json` exists.
- **pkg-normalize** - Enforces package [normalization](https://github.com/npm/normalize-package-data#what-normalization-currently-entails) and warns on moot properties.
- **pkg-property-order** - Checks the `package.json` property order.
	- *[...order]* - Custom list of properties.
- **pkg-user-order** - Checks the order of the properties of user objects in `package.json` like `author`, `contributors` and `maintainers`.
	- *[...order]* - (default `['name', 'email', 'url']`) Custom property order.
- **pkg-schema** - Validates the schema of `package.json`
- **pkg-name** - [Validates](https://github.com/npm/normalize-package-data#rules-for-name-field) the `name` property of `package.json`.
- **pkg-description** - Enforces the `description` in `package.json` to start with a capital letter and not end with a dot.
- **pkg-shorthand-repository** - Enforces the `repository` field in `package.json` to be `SamVerschueren/clinton` instead of an object or the full blown url.
- **readme** - Check if a `readme` file is present.
- **test-script** - Check if the `test` script is set.
- **use-travis** - Checks if [Travis CI](https://travis-ci.org/) is used.
- **travis** - Checks if the correct versions are being tested in `.travis.yml`.
- **valid-properties** - Checks if a certain set of properties is defined in `package.json`.
- **valid-version** - Checks if the `version` in `package.json` is a valid semver version.
- **cli** - Checks if the `bin` file specified in `package.json` exists and is executable.
- **max-depth** - This rule enforces a maximum depth that directories can be nested to reduce project complexity.
	- *[max]* - (default `5`) enforces a maximum depth that directories can be nested.
- **filename-case** - Enforces all linted files to have their names in a certain case style. Default is `kebabCase`.
	- *{case: _type_}* - _type_ can be one of `kebabCase`, `camelCase`, `snakeCase` or `pascalCase`.

## Plugins

Everyone can create plugins or custom rules that can be validated with `Clinton`. The name of the plugin should be
`clinton-plugin-*` where `*` is the name of the plugin.

### Example

Let's create a `clinton-plugin-file-exists` rule that checks if the file provided as argument really exists.

```js
'use strict';
module.exports = ctx => {
	const fileName = ctx.options[0];

	if (!ctx.files.includes(fileName)) {
		return {
			message: `File ${fileName} does not exist.`
		};
	}
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
		"clinton-plugin-file-exists": "1.0.0"
	},
	"clinton": {
		"rules": {
			"file-exists": ["error", "index.js"]
		}
	}
}
```

When running `npm test`, `clinton` will execute your plugin and will use `index.js` as the option argument. The first argument `error`
indicates the severity of the error.


## Related

- [gh-lint-brainstorm](https://github.com/SamVerschueren/gh-lint-brainstorm) - Brainstorming repository for this module


## License

MIT © [Sam Verschueren](http://github.com/SamVerschueren)
