'use strict';
const ghGot = require('../utils/cache').ghGot;
const GitHubFileSystem = require('./github/filesystem');

class GitHubEnvironment {

	constructor(repository, opts) {
		this._opts = opts;
		this._repository = repository;
		this.fs = new GitHubFileSystem(this);
	}

	load() {
		// Load the repository data
		return ghGot(`repos/${this._repository}`, {token: this._opts.token})
			.then(res => {
				const data = res.body;

				if (data.language.toLowerCase() !== 'javascript') {
					throw new TypeError('We can only validate JavaScript projects.');
				}

				this.repository = data;

				const branch = this._opts.branch || data.default_branch;

				// Load the branch data
				return ghGot(`repos/${this._repository}/branches/${branch}`, {token: this._opts.token});
			})
			.then(res => {
				/* eslint-disable camelcase */
				this.repository.default_branch = res.body;

				// Retrieve the files from the master branch
				return ghGot(`repos/${this._repository}/git/trees/${res.body.commit.sha}?recursive=1`, {token: this._opts.token});
			})
			.then(res => {
				this.files = res.body.tree.map(file => file.path);

				return this.fs.readFile('package.json');
			})
			.then(pkg => {
				this.pkg = pkg;
			});
	}
}

module.exports = GitHubEnvironment;
