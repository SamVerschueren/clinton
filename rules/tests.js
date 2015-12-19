'use strict';
const travisGot = require('../utils/cache').travisGot;
const loadFile = require('../utils/load-file');
module.exports = repository => {
	const messages = [];

	if (repository._tree.indexOf('.travis.yml') < 0) {
		messages.push({
			name: 'travis',
			severity: 'warn',
			message: 'Use travis to automatically run your tests.'
		});
	}

	return Promise.all([
		loadFile(repository, 'package.json'),
		travisGot(`repos/${repository._fullName}`).then(data => data.body)
	]).then(result => {
		const pkg = result[0];
		const travis = result[1];

		// Valid script property
		if (!pkg.scripts || !pkg.scripts.test) {
			messages.push({
				name: 'package-test-property',
				severity: 'error',
				message: 'Missing property `scripts.test` in package.json.'
			});
		} else if (pkg.scripts && (/no test specified/.test(pkg.scripts.test) || pkg.script.test === '')) {
			messages.push({
				name: 'package-untested',
				severity: 'error',
				message: 'The package is untested.'
			});
		}

		// Validate travis build
		if (travis.repo && travis.repo.last_build_state === 'errored') {
			messages.push({
				name: 'travis-build-status',
				severity: 'error',
				message: 'Travis build failed.'
			});
		}

		return Promise.reject(messages);
	});
};

module.exports._dependencies = ['pkg-loader'];
