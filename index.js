'use strict';
const path = require('path');
const pathExists = require('path-exists');
const Environment = require('./lib/environment');
const context = require('./lib/context');
const rules = require('./lib/rules');
const pkg = require('./package.json');

module.exports = (input, opts) => {
	if (typeof input !== 'string') {
		return Promise.reject(new TypeError('No input provided.'));
	}

	opts = Object.assign({
		cwd: process.cwd(),
		plugins: []
	}, opts);

	const filePath = path.resolve(opts.cwd, input);

	if (!pathExists.sync(filePath)) {
		return Promise.reject(new Error(`Path ${input} does not exist.`));
	}

	// Location of the default rules
	const rulesPath = path.join(__dirname, 'rules');

	// Create a new environment
	const env = new Environment(filePath, opts);

	const validations = [];

	return env.load()
		.then(() => {
			// Parse the rules
			let ruleList = opts.rules;
			let plugins = opts.plugins;
			if (!opts.rules && env.pkg[pkg.name] && env.pkg[pkg.name].rules) {
				ruleList = env.pkg[pkg.name].rules;
			}

			if (plugins.length === 0 && env.pkg[pkg.name] && env.pkg[pkg.name].plugins) {
				plugins = env.pkg[pkg.name].plugins;
			}

			if (!ruleList) {
				throw new Error('No rules found');
			}

			ruleList = rules.parse(ruleList);
			const ruleIds = Object.keys(ruleList);

			return Promise.all(ruleIds.map(ruleId => {
				let mod;

				if (plugins.indexOf(ruleId) >= 0) {
					try {
						mod = require(`${pkg.name}-plugin-${ruleId}`);
					} catch (err) {
						try {
							mod = require(ruleId);
						} catch (err) {
							throw new Error(`Could not find module for plugin '${ruleId}'.`);
						}
					}
				} else {
					mod = require(path.join(rulesPath, ruleId));
				}

				const rule = ruleList[ruleId];

				// Create a rule context
				const ctx = context.create(env, rule.slice(1));

				// Execute the rule
				return Promise.resolve()
					.then(() => mod(ctx))
					.then(err => {
						if (err) {
							err = Array.isArray(err) ? err : [err];

							err.forEach(e => {
								validations.push({
									name: ruleId,
									severity: rule[0],
									message: e.message
								});
							});
						}
					});
			}));
		})
		.then(() => validations);
};
