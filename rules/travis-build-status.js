'use strict';
module.exports = ctx => {
	if (ctx.files.indexOf('.travis.yml') === -1) {
		return;
	}

	// TODO what if repository is not something like `SamVerschueren/clinton`?
	return ctx.travis.get(`repos/${ctx.pkg.repository}`).then(res => {
		const data = res.body;

		// Validate travis build
		if (data.repo && data.repo.last_build_state === 'errored') {
			return {
				message: 'Travis build failed.'
			};
		}
	});
};
