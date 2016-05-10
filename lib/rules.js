'use strict';
const severity = require('./severity');

exports.parse = rules => {
	const ret = {};

	Object.keys(rules).forEach(id => {
		const rule = Array.isArray(rules[id]) ? rules[id] : [rules[id]];
		rule[0] = severity.parse(rule[0]);

		if (rule[0] !== 'off') {
			ret[id] = rule;
		}
	});

	return ret;
};
