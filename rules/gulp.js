'use strict';
const multiFind = require('array-multi-find');

const TS_PEERS = [
	'ts-node',
	'typescript-node',
	'typescript-register',
	'typescript-require'
];

module.exports = ctx => {
	const isRequired = ctx.options[0] !== 'optional';
	const fileName = ctx.files.find(file => file.toLowerCase().indexOf('gulpfile') === 0);
	const pkg = Object.assign({
		devDependencies: {}
	}, ctx.env.pkg);

	if (!isRequired && !fileName) {
		// Exit if gulp file is optional and not found
		return;
	}

	const messages = [];

	if (!fileName) {
		messages.push({
			message: 'No Gulpfile found.'
		});
	}

	if (!pkg.devDependencies.gulp) {
		messages.push({
			message: '`gulp` dependency not found in `devDependencies`.',
			file: ctx.fs.resolve('package.json')
		});
	}

	// TypeScript
	if (fileName === 'gulpfile.ts') {
		const dependencies = multiFind(Object.keys(pkg.devDependencies), TS_PEERS);

		if (dependencies.length === 0) {
			messages.push({
				message: `Expected one of \`${TS_PEERS.join('`, `')}\` in \`devDependencies\`.`,
				file: ctx.fs.resolve('package.json')
			});
		}
	}

	// CoffeeScript
	if (fileName === 'gulpfile.coffee') {
		if (!pkg.devDependencies['coffee-script']) {
			messages.push({
				message: `Expected \`coffee-script\` in \`devDependencies\`.`,
				file: ctx.fs.resolve('package.json')
			});
		}
	}

	return messages;
};
