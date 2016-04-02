'use strict';
const pathExists = require('path-exists');
const LocalEnvironment = require('./environment/local');
const GitHubEnvironment = require('./environment/github');

module.exports.create = function (path, opts) {
	if (pathExists.sync(path)) {
		return new LocalEnvironment(path, opts);
	}

	return new GitHubEnvironment(path, opts);
};
