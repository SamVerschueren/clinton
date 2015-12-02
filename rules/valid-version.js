'use strict';
const semver = require('semver');
module.exports = (repository, opts, pkg) => {
	if (!semver.valid(pkg.version)) {
		return Promise.reject({
			name: 'valid-version',
			severity: 'error',
			message: 'The specified `version` in package.json is invalid.'
		});
	}
};

module.exports._dependencies = ['pkg-loader'];
