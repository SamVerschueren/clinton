'use strict';
module.exports = function (ctx) {
	if (ctx.files.indexOf('.travis.yml') === -1) {
		return Promise.resolve();
	}

	// TODO what if repository is not something like `SamVerschueren/gh-lint`?
	return ctx.travis.get(`repos/${ctx.pkg.repository}`).then(res => {
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
