'use strict';
const ghGot = require('./utils/cache').ghGot;

exports.load = function (repository, ctx) {
	// Load the repository data
	return ghGot(`repos/${repository}`, {token: ctx.opts.token})
		.then(res => {
			const data = res.body;

			if (data.language.toLowerCase() !== 'javascript') {
				throw new TypeError('We can only validate JavaScript projects.');
			}

			ctx.repository = data;

			// Load the default branch data
			// TODO Use `opts.branch` if defined
			return ghGot(`repos/${repository}/branches/${data.default_branch}`, {token: ctx.opts.token});
		})
		.then(res => {
			/* eslint-disable camelcase */
			ctx.repository.default_branch = res.body;

			// Retrieve the files from the master branch
			return ghGot(`repos/${repository}/git/trees/${res.body.commit.sha}`, {token: ctx.opts.token});
		})
		.then(res => {
			ctx.files = res.body.tree.map(file => file.path);
		})
		.then(() => ctx);
};
