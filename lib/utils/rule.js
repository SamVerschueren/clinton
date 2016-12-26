/* eslint-disable import/no-dynamic-require */
'use strict';
const path = require('path');
const pkg = require('../../package.json');

exports.resolve = (ruleId, opts) => {
	const plugins = opts.plugins || [];

	if (plugins.indexOf(ruleId) >= 0) {
		try {
			return require(`${pkg.name}-plugin-${ruleId}`);
		} catch (err) {
			try {
				return require(ruleId);
			} catch (err) {
				throw new Error(`Could not find module for plugin '${ruleId}'.`);
			}
		}
	} else {
		return require(path.join(__dirname, '../../rules', ruleId));
	}
};
