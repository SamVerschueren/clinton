'use strict';
const path = require('path');
const globby = require('globby');
const isDir = require('is-d');
const FileSystem = require('./filesystem');

class Environment {

	constructor(path, opts) {
		this._opts = opts;
		this._path = path;
		this.fs = new FileSystem(this);
	}

	load() {
		const toGlob = file => isDir(path.join(this._path, file)).then(dir => file + (dir ? '/**' : ''));

		return this.fs.readFile('.gitignore')
			.then(gitignore => {
				gitignore = gitignore || '';

				const ignore = gitignore.split('\n').filter(Boolean);
				ignore.push('.git');

				return Promise.all(ignore.map(toGlob));
			})
			// Ignore all the files from `.gitignore`
			.then(ignore => globby('**/*', {cwd: this._path, dot: true, ignore}))
			.then(items => {
				this.files = items;

				return this.fs.readFile('package.json');
			})
			.then(pkg => {
				this.pkg = pkg;
			});
	}
}

module.exports = Environment;
