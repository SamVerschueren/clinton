'use strict';
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
		function toGlob(file) {
			return isDir(file).then(dir => {
				return file + (dir ? '/**' : '');
			});
		}

		return this.fs.readFile('.gitignore')
			.then(gitignore => {
				gitignore = gitignore || '';

				const ignore = gitignore.split('\n').filter(Boolean);
				ignore.push('.git');

				return Promise.all(ignore.map(toGlob));
			})
			.then(ignore => {
				// Ignore all the files from `.gitignore`
				return globby('**/*', {cwd: this._opts.cwd, dot: true, ignore});
			})
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
