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

> Tip: Use the config in `package.json` whenever possible for maintainability and to make it easier for eventual other tools to read the config.


## Rules

- [ava](docs/rules/ava.md) - Enforces the use of [AVA](https://github.com/avajs/ava). *(fixable)*
- [cli](docs/rules/cli.md) - Enforces the existance and executability of the cli file.
- [editorconfig](docs/rules/editorconfig.md) - Enforces the use and rules of  [EditorConfig](http://editorconfig.org).
- [filename-case](docs/rules/filename-case.md) - Enforce a case style for filenames.
- [gitignore](docs/rules/gitignore.md) - Enforce the use of `.gitignore`. *(fixable)*
- [gulp](docs/rules/gulp.md) - Enforces the correct `devDependencies` when Gulp is detected.
- [keywords](docs/rules/keywords.md) - Enforces the use of `keywords` in `package.json`.
- [license](docs/rules/license.md) - Enforce the use of a specific license.
- [max-depth](docs/rules/max-depth.md) - Enforce the maximum depth of the directory structure.
- [no-callback](docs/rules/no-callback.md) - Enforces the use of promises instead of callbacks.
- [no-dup-keywords](docs/rules/no-dup-keywords.md) - Enforce not having duplicate keywords in `package.json`. *(fixable)*
- [no-empty-keywords](docs/rules/no-empty-keywords.md) - Enforce not having empty keywords in `package.json`. *(fixable)*
- [no-git-merge-conflict](docs/rules/no-git-merge-conflict.md) - Prevents having Git merge conflict markers.
- [pkg-dependency-order](docs/rules/pkg-dependency-order.md) - Enforces alphabetical order of `dependencies` and `devDependencies` in `package.json`. *(fixable)*
- [pkg-description](docs/rules/pkg-description.md) - Enforces the description to start with a capital letter and not end with a dot. *(fixable)*
- [pkg-engine](docs/rules/pkg-engine.md) - Enforces the use of a `engines.node` field in `package.json`.
- [pkg-main](docs/rules/pkg-main.md) - Enforces the existance of the main file.
- [pkg-name](docs/rules/pkg-name.md) - Enforces a valid package name.
- [pkg-normalize](docs/rules/pkg-normalize.md) - Enforces package normalization. *(fixable)*
- [pkg-property-order](docs/rules/pkg-property-order.md) - Enforces order of properties in in `package.json`. *(fixable)*
- [pkg-schema](docs/rules/pkg-schema.md) - Enforces a valid `package.json`.
- [pkg-shorthand-repository](docs/rules/pkg-shorthand-repository.md) - Enforces the use of the shorthand repository URL. *(fixable)*
- [pkg-user-order](docs/rules/pkg-user-order.md) - Enforces order of properties in user objects in `package.json`. *(fixable)*
- [readme](docs/rules/readme.md) - Enforce having a readme.
- [test-script](docs/rules/test-script.md) - Enforces the use of tests.
- [travis](docs/rules/travis.md) - Enforces the correct versions in `.travis.yml`. *(fixable)*
- [use-travis](docs/rules/use-travis.md) - Enforces the use of [Travis CI](https://travis-ci.org/).
- [valid-properties](docs/rules/valid-properties.md) - Enforce recommended properties in `package.json`.
- [valid-version](docs/rules/valid-version.md) - Enforces a valid version identifier in `package.json`.
- [xo](docs/rules/xo.md) - Enforces the use of [XO](https://github.com/sindresorhus/xo). *(fixable)*


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
		ctx.report({
			message: `File ${fileName} does not exist.`
		});
	}
};
```

You can also return a promise if you are performing asynchronous operations.

You can wrap this up in a project, publish it to [npm](https://www.npmjs.com/) and install it in every project where you want to check if a file in your project really exists.

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
		"plugins": [
			"file-exists"
		],
		"rules": {
			"file-exists": ["error", "index.js"]
		}
	}
}
```

When running `npm test`, `clinton` will execute your plugin and will use `index.js` as the option argument. The first that is passed to the plugin, `error` in this example, indicates the severity of the error.


## Related

- [gh-lint-brainstorm](https://github.com/SamVerschueren/gh-lint-brainstorm) - Brainstorming repository for this module


## License

MIT © [Sam Verschueren](http://github.com/SamVerschueren)
