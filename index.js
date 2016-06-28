'use strict';
const path = require('path');
const pathExists = require('path-exists');
const Environment = require('./lib/environment');
const context = require('./lib/context');
const config = require('./lib/config');
const rules = require('./lib/rules');
const defaultConfig = require('./config');
const pkg = require('./package.json');

module.exports = (input, opts) => {
	if (typeof input !== 'string') {
		return Promise.reject(new TypeError('No input provided.'));
	}

	opts = Object.assign({
		cwd: process.cwd(),
		plugins: [],
		inherit: true
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
		.then(() => config.load(env))
		.then(conf => {
			conf = conf || {};

			const inherit = opts.inherit ? defaultConfig : {};

			return {
				rules: Object.assign({}, inherit.rules, conf.rules, opts.rules),
				plugins: [].concat(inherit.plugins || [], conf.plugins || [], opts.plugins || [])
			};
		})
		.then(conf => {
			const ruleList = rules.parse(conf.rules);
			const plugins = conf.plugins || [];

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
								if (!e) {
									return;
								}

								validations.push(Object.assign(e, {
									name: ruleId,
									severity: rule[0]
								}));
							});
						}
					});
			}));
		})
		.then(() => validations);
};
