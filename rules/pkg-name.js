'use strict';
const validate = require('validate-npm-package-name');

const KEYWORDS = [
	'name',
	'favicon.ico',
	'node_modules'
];

const normalize = message => {
	for (const keyword of KEYWORDS) {
		message = message.replace(new RegExp(`\\b(${keyword})\\b`), '`$1`');
	}

	return message;
};

module.exports = ctx => ctx.fs.readFile('package.json').then(pkg => {
	const file = ctx.fs.resolve('package.json');

	const errors = validate(pkg.name).errors || [];

	for (const error of errors) {
		ctx.report({
			message: normalize(error),
			file
		});
	}
});
