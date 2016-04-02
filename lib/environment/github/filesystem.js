'use strict';
const path = require('path');
const got = require('../../utils/cache').got;

class GitHubFileSystem {

	constructor(env) {
		this._env = env;
	}

	readFile(file) {
		const opts = {};

		if (path.extname(file) === '.json') {
			opts.json = true;
		}

		return got(`https://raw.githubusercontent.com/${this._env._repository}/master/${file}`, opts).then(data => data.body);
	}
}

module.exports = GitHubFileSystem;
