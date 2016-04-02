#!/usr/bin/env node
'use strict';
const meow = require('meow');
const chalk = require('chalk');
const ghLint = require('./');

const cli = meow(`
	Usage
	  $ gh-lint <path>

	Options
	  --token		GitHub access token

  Examples
	  $ gh-lint SamVerschueren/gh-lint

	  $ gh-lint ~/projects/gh-lint
`);

if (cli.input.length === 0) {
	console.error('Provide an input path');
	process.exit(1);
}

function log(validation) {
	let color = 'red';
	let message = 'error  ';

	if (validation.severity === 1) {
		color = 'yellow';
		message = 'warning';
	}

	console.log(`  ${chalk[color](message)}  ${validation.message} ${chalk.gray('(' + validation.name + ')')}`);
}

ghLint(cli.input[0], cli.flags)
	.then(validations => {
		validations.forEach(log);
	});
