'use strict';
const semver = require('semver');
const loadFile = require('../utils/load-file');
module.exports = repository =>
	loadFile(repository, 'package.json').then(pkg => {
		if (!semver.valid(pkg.version)) {
			return Promise.reject({
				name: 'valid-version',
				severity: 'error',
				message: 'The specified `version` in package.json is invalid.'
			});
		}
	});
