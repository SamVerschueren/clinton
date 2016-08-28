#!/usr/bin/env node
'use strict';
const meow = require('meow');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const updateNotifier = require('update-notifier');
const groupBy = require('lodash.groupby');
const formatter = require('eslint-formatter-pretty');
const ghLint = require('./');

const cli = meow(`
	Usage
	  $ clinton [<path>]

	Options
	  --no-inherit  Prevent inheriting from the default rules.
	  --ignores     Ignore files. Can be added multiple times.
	  --fix         Automatically fix problems.

	Examples
	  $ clinton
	    ${chalk.underline('.editorconfig')}
	    ${logSymbols.warning}  Use ${chalk.bold('.editorconfig')} to define and maintain consistent coding styles between editors. 	${chalk.dim('editorconfig')}

	    ${chalk.yellow('1  warning')}

	  $ clinton ~/projects/project
	    ${chalk.underline('license')}
	    ${logSymbols.error}  No MIT license found. 	${chalk.dim('license-mit')}

	    ${chalk.red('1  error')}
`, {
	boolean: ['inherit', 'fix'],
	default: {
		inherit: true
	}
});

updateNotifier({pkg: cli.pkg}).notify();

const log = validations => {
	const files = groupBy(validations, 'file');

	const filePaths = Object.keys(files);

	const ret = [];

	for (const filePath of filePaths) {
		ret.push({
			filePath: filePath === 'undefined' ? 'Project' : filePath,
			errorCount: files[filePath].reduce((c, m) => c + (m.severity === 'error' ? 1 : 0), 0),
			warningCount: files[filePath].reduce((c, m) => c + (m.severity === 'warn' ? 1 : 0), 0),
			messages: files[filePath]
		});
	}

	if (ret.length > 0) {
		console.log(formatter(ret));
	}
};

const exit = validations => {
	const hasError = validations.some(validation => validation.severity === 'error');

	if (hasError) {
		process.exit(1);
	}
};

if (cli.flags.fix) {
	ghLint.fix(cli.input[0] || '.', cli.flags);
	return;
}

ghLint.lint(cli.input[0] || '.', cli.flags)
	.then(validations => {
		log(validations);
		exit(validations);
	});
