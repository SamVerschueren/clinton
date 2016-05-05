'use strict';
const semver = require('semver');

module.exports = ctx => ctx.fs.readFile('package.json').then(pkg => {
	if (!semver.valid(pkg.version)) {
		return {
			message: 'The specified `version` in package.json is invalid.'
		};
	}
});
