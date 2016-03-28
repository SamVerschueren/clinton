'use strict';
const path = require('path');
const fs = require('fs');
const objectAssign = require('object-assign');
const context = require('./lib/context');
const github = require('./lib/github-loader');
const local = require('./lib/local-loader');

module.exports = (repository, opts) => {
	// Location of the default rules
	const rulesPath = path.join(__dirname, 'rules');

	opts = objectAssign({
		cwd: process.cwd()
	}, opts);

	// Create a new context
	const ctx = context.create(opts);

	// The default loader is the GitHub loader
	let loader = github;

	if (opts.local) {
		loader = local;
	}

	return loader.load(repository, ctx)
		.then(() => {
			return ctx.readFile('package.json');
		})
		.then(pkg => {
			ctx.pkg = pkg;
		})
		.then(() => {
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
