'use strict';
const path = require('path');
const got = require('../../utils/cache').got;

class GitHubFileSystem {

	constructor(opts) {
		this._opts = opts;
	}

	readFile(file) {
		const opts = {};

		if (path.extname(file) === '.json') {
			opts.json = true;
		}

		return got(`https://raw.githubusercontent.com/${this._opts.repository}/master/${file}`, opts).then(data => data.body);
	}
}

module.exports = GitHubFileSystem;
