'use strict';
const path = require('path');
const fs = require('fs');
const context = require('./lib/context');
const github = require('./lib/github');

module.exports = (repository, opts) => {
	const rulesPath = path.join(__dirname, 'rules');

	opts = opts || {};

	// Create a new context
	const ctx = context.create(opts);

	// The default loader is the GitHub loader
	const loader = github;

	if (opts.local) {
		// loader = local;
		throw new Error('not supported yet');
	}

	return loader.load(repository, ctx)
		.then(ctx => {
			const rules = fs.readdirSync(rulesPath);

			return Promise.all(rules.map(rule => {
				const mod = require(path.join(rulesPath, rule));

				return Promise.resolve(mod(ctx)).catch(result => {
					if (result) {
						ctx.addValidation(result);
					}
				});
			}));
		})
		.then(() => ctx.validations);
};
