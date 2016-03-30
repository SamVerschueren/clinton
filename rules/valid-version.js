'use strict';
const semver = require('semver');

module.exports = function (ctx) {
	return ctx.fs.readFile('package.json').then(pkg => {
		if (!semver.valid(pkg.version)) {
			throw new Error('The specified `version` in package.json is invalid.');
		}
	});
};
