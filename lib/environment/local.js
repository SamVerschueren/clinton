'use strict';
const path = require('path');
const globby = require('globby');
const isDir = require('is-d');
const LocalFileSystem = require('./local/filesystem');

class LocalEnvironment {

	constructor(opts) {
		this._opts = opts;
		this.fs = new LocalFileSystem(this._opts);
	}

	load(dir) {
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
				return globby(path.join(dir, '**/*'), {cwd: this._opts.cwd, dot: true, ignore});
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

module.exports = LocalEnvironment;
