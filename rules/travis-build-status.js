'use strict';
module.exports = function (ctx) {
	if (ctx.files.indexOf('.travis.yml') === -1) {
		return Promise.resolve();
	}

	// TODO this will not work when executed locally
	return ctx.travisGot(`repos/${ctx.repository.full_name}`).then(res => {
		const data = res.body;

		// Validate travis build
		if (data.repo && data.repo.last_build_state === 'errored') {
			return Promise.reject({
				name: 'travis-build-status',
				severity: 'error',
				message: 'Travis build failed.'
			});
		}
	});
};
