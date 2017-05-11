'use strict';
const semver = require('semver');

module.exports = ctx => ctx.fs.readFile('package.json').then(pkg => {
	const engines = pkg.engines || {};

	if (!engines.node) {
		ctx.report({
			message: 'Use `engines.node` in `package.json`',
			file: ctx.fs.resolve('package.json')
		});
	} else if (!semver.validRange(engines.node)) {
		ctx.report({
			message: 'Invalid `engines.node` range found in `package.json`',
			file: ctx.fs.resolve('package.json')
		});
	}
});
