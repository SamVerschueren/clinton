'use strict';
const path = require('path');
const pathExists = require('path-exists');
const Environment = require('./lib/environment');
const context = require('./lib/context');
const pkg = require('./package.json');

function createSeverity(severity) {
	if (typeof severity === 'string') {
		if (severity === 'error') {
			severity = 2;
		} else if (severity === 'warn') {
			severity = 1;
		} else if (severity === 'off') {
			severity = 0;
		}
	}

	return severity;
}

function parseRules(rules) {
	const ret = {};

	Object.keys(rules).forEach(id => {
		const rule = Array.isArray(rules[id]) ? rules[id] : [rules[id]];
		rule[0] = createSeverity(rule[0]);

		if (rule[0] > 0) {
			ret[id] = rule;
		}
	});

	return ret;
}

module.exports = (input, opts) => {
	if (!pathExists(input)) {
		return Promise.reject(new Error(`Path ${path} does not exist.`));
	}

	// Location of the default rules
	const rulesPath = path.join(__dirname, 'rules');

	opts = Object.assign({
		cwd: process.cwd(),
		rules: {},
		plugins: []
	}, opts);

	// Create a new environment
	const env = new Environment(input, opts);

	const validations = [];

	return env.load()
		.then(() => {
			// Parse the rules
			let rules = opts.rules;
			if (env.pkg[pkg.name] && env.pkg[pkg.name].rules) {
				rules = env.pkg[pkg.name].rules;
			}

			rules = parseRules(rules);
			const ruleIds = Object.keys(rules);

			return Promise.all(ruleIds.map(ruleId => {
				let mod;

				if (opts.plugins.indexOf(ruleId) >= 0) {
					mod = require(`${pkg.name}-plugin-${ruleId}`);
				} else {
					mod = require(path.join(rulesPath, ruleId));
				}

				const rule = rules[ruleId];

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
