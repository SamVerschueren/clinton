'use strict';
const got = require('got');
module.exports = repository => {
	if (repository._tree.indexOf('.travis.yml') < 0) {
		return Promise.reject({
			name: 'travis',
			severity: 'warn',
			message: 'Use travis to automatically run your tests.'
		});
	}

	return got(`https://api.travis-ci.org/repos/${repository._fullName}`, {json: true, headers: {Accept: 'application/vnd.travis-ci.2+json'}}).then(data => {
		if (data.body.repo && data.body.repo.last_build_state === 'errored') {
			return Promise.reject({
				name: 'travis-build-status',
				severity: 'error',
				message: 'Travis build failed.'
			});
		}
	});
};
