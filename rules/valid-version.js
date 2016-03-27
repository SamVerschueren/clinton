'use strict';
const semver = require('semver');

module.exports = function (ctx) {
	return ctx.readFile('package.json').then(pkg => {
		if (!semver.valid(pkg.version)) {
			return Promise.reject({
				name: 'valid-version',
				severity: 'error',
				message: 'The specified `version` in package.json is invalid.'
			});
		}
	});
};
