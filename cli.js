#!/usr/bin/env node
'use strict';
const meow = require('meow');
const chalk = require('chalk');
const ghLint = require('./');

const cli = meow(`
	Usage
	  $ clinton [<path>]

	Examples
	  $ clinton
	    warn     Use \`.editorconfig\` to define and maintain consistent coding styles between editors. (editorconfig)

	  $ clinton ~/projects/project
	    error    No MIT license found. (license-mit)
`);

const log = validation => {
	let color = 'red';
	let message = 'error  ';

	if (validation.severity === 'warn') {
		color = 'yellow';
		message = 'warning';
	}

	console.log(`  ${chalk[color](message)}  ${validation.message} ${chalk.gray(`(${validation.name})`)}`);
};

const exit = validations => {
	const hasError = validations.some(validation => validation.severity === 'error');

	if (hasError) {
		process.exit(1);
	}
};

ghLint(cli.input[0] || '.', cli.flags)
	.then(validations => {
		validations.forEach(log);

		exit(validations);
	});
