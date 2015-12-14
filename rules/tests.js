'use strict';
const travisGot = require('travis-got');
module.exports = (repository, opts, pkg) => {
	const messages = [];

	if (repository._tree.indexOf('.travis.yml') < 0) {
		messages.push({
			name: 'travis',
			severity: 'warn',
			message: 'Use travis to automatically run your tests.'
		});
	}

	if (!pkg.scripts || !pkg.scripts.test) {
		messages.push({
			name: 'package-test-property',
			severity: 'error',
			message: 'Missing property `scripts.test` in package.json.'
		});
	} else if (pkg.scripts && /no test specified/.test(pkg.scripts.test)) {
		messages.push({
			name: 'package-untested',
			severity: 'error',
			message: 'The package is untested.'
		});
	}

	messages.push(travisGot(`repos/${repository._fullName}`).then(data => {
		if (data.body.repo && data.body.repo.last_build_state === 'errored') {
			return Promise.resolve({
				name: 'travis-build-status',
				severity: 'error',
				message: 'Travis build failed.'
			});
		}
	}));

	return Promise.all(messages).then(err => {
		throw err.filter(Boolean);
	});
};

module.exports._dependencies = ['pkg-loader'];
