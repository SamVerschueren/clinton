'use strict';
const LocalContext = require('./context/local-context');
const GitHubContext = require('./context/github-context');

module.exports.create = function (opts) {
	if (opts.local) {
		return new LocalContext(opts);
	}

	return new GitHubContext(opts);
};
