'use strict';
const path = require('path');
const pathExists = require('path-exists');
const Environment = require('./lib/environment');
const context = require('./lib/context');
const config = require('./lib/config');
const rules = require('./lib/rules');
const defaultConfig = require('./config');
const pkg = require('./package.json');

const fix = (mod, ctx, err) => {
	if (!mod.fix) {
		return;
	}

	return mod.fix(ctx, err);
};

const merge = (options, config) => {
	const opts = Object.assign({}, options);

	opts.inherit = opts.inherit === undefined ? config.inherit || true : opts.inherit;

	const inherit = opts.inherit ? defaultConfig : {};

	opts.rules = Object.assign({}, inherit.rules, config.rules, opts.rules);
	opts.plugins = [].concat(inherit.plugins || [], config.plugins || [], opts.plugins || []);

	delete config.rules;
	delete config.plugins;
	delete config.inherit;

	return Object.assign(opts, config);
};

module.exports = (input, opts) => {
	if (typeof input !== 'string') {
		return Promise.reject(new TypeError('No input provided.'));
	}

	opts = Object.assign({
		cwd: process.cwd(),
		plugins: [],
		inherit: undefined,
		ignores: []
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

	return config.load(env)
		.then(config => {
			opts = merge(opts, config);

			return env.load(opts);
		})
		.then(() => {
			const ruleList = rules.parse(opts.rules);
			const plugins = opts.plugins || [];

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
						err = Array.isArray(err) ? err : [err];
						err = err.filter(Boolean);

						if (err.length > 0) {
							if (opts.fix) {
								return fix(mod, ctx, err);
							}

							err.forEach(e => {
								if (!e) {
									return;
								}

								validations.push(Object.assign(e, {
									ruleId,
									severity: rule[0]
								}));
							});
						}
					});
			}));
		})
		.then(() => validations);
};
