'use strict';
const path = require('path');
const got = require('../utils/cache').got;
const Context = require('./context');

class GitHubFileSystem {

	constructor(ctx) {
		this.ctx = ctx;
	}

	readFile(file) {
		const opts = {};

		if (path.extname(file) === '.json') {
			opts.json = true;
		}

		return got(`https://raw.githubusercontent.com/${this.ctx.repository.full_name}/master/${file}`, opts).then(data => data.body);
	}
}

class GitHubContext extends Context {

	constructor(opts) {
		super(opts);

		this.fs = new GitHubFileSystem(this);
	}
}

module.exports = GitHubContext;
