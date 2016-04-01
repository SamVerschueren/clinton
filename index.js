'use strict';
const path = require('path');
const objectAssign = require('object-assign');
const environment = require('./lib/environment');
const context = require('./lib/context');

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

module.exports = (repository, opts) => {
	// Location of the default rules
	const rulesPath = path.join(__dirname, 'rules');

	opts = objectAssign({
		cwd: process.cwd(),
		rules: {}
	}, opts);

	// Parse the rules
	const rules = parseRules(opts.rules);

	// Create a new environment
	const env = environment.create(opts);

	const validations = [];

	return env.load(repository)
		.then(() => {
			const ruleIds = Object.keys(rules);

			return Promise.all(ruleIds.map(ruleId => {
				const mod = require(path.join(rulesPath, ruleId));

				const rule = rules[ruleId];

				// Create a rule context
				const ctx = context.create(env, rule.slice(1));

				// Execute the rule
				return Promise.resolve()
					.then(() => mod(ctx))
					.catch(err => {
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
