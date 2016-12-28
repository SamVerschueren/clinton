'use strict';
const semver = require('semver');

module.exports = ctx => ctx.fs.readFile('package.json').then(pkg => {
	if (!semver.valid(pkg.version)) {
		ctx.report({
			message: 'The specified `version` in package.json is invalid.',
			file: ctx.fs.resolve('package.json')
		});
	}
});
