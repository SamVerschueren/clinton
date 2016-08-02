#!/usr/bin/env node
'use strict';
const path = require('path');
const meow = require('meow');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const updateNotifier = require('update-notifier');
const groupBy = require('lodash.groupby');
const ghLint = require('./');

const cli = meow(`
	Usage
	  $ clinton [<path>]

	Options
	  --no-inherit  Prevent inheriting from the default rules.
	  --fix         Automatically fix problems.

	Examples
	  $ clinton
	    ${chalk.underline('/Users/sam/projects/foo/.editorconfig')}
	      ${logSymbols.warning}  Use \`.editorconfig\` to define and maintain consistent coding styles between editors. (editorconfig)

	  $ clinton ~/projects/project
	    ${chalk.underline('/Users/sam/projects/project/license')}
	      ${logSymbols.error}  No MIT license found. (license-mit)
`, {
	boolean: ['inherit', 'fix'],
	default: {
		inherit: true
	}
});

updateNotifier({pkg: cli.pkg}).notify();

const root = path.resolve(cli.flags.cwd || process.cwd(), cli.input[0] || '.');

const logHelper = validation => {
	let severity = 'error';

	if (validation.severity === 'warn') {
		severity = 'warning';
	}

	console.log(`    ${logSymbols[severity]} ${validation.message} ${chalk.gray(`(${validation.ruleId})`)}`);
};

const log = validations => {
	const files = groupBy(validations, 'file');

	if (files.undefined) {
		console.log(`  ${chalk.underline('Project')}`);
		(files.undefined || []).forEach(logHelper);

		delete files.undefined;

		console.log();
	}

	for (const file of Object.keys(files)) {
		console.log(`  ${chalk.underline(path.relative(root, file))}`);

		files[file].forEach(logHelper);

		console.log();
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
