'use strict';
const LocalEnvironment = require('./environment/local');
const GitHubEnvironment = require('./environment/github');

module.exports.create = function (opts) {
	if (opts.local) {
		return new LocalEnvironment(opts);
	}

	return new GitHubEnvironment(opts);
};
