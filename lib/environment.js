'use strict';
const path = require('path');
const pathExists = require('path-exists');
const globby = require('globby');
const isDir = require('is-d');
const FileSystem = require('./fs/filesystem');

class Environment {

	constructor(path, opts) {
		this._opts = opts;
		this.path = path;
		this.fs = new FileSystem(this);
	}

	load() {
		const toGlob = file => {
			const filePath = path.join(this.path, file);

			return pathExists(filePath)
				.then(exists => exists ? isDir(filePath).then(dir => file + (dir ? '/**' : '')) : '');
		};

		return this.fs.readFile('.gitignore')
			.then(gitignore => {
				gitignore = gitignore || '';

				const ignore = gitignore.split('\n').filter(Boolean);
				ignore.push('.git');

				return Promise.all(ignore.map(toGlob));
			})
			// Ignore all the files from `.gitignore`
			.then(ignore => globby('**/*', {cwd: this.path, dot: true, silent: true, ignore}))
			.then(items => {
				if (items.indexOf('package.json') === -1) {
					return Promise.reject(new Error('No package.json file found'));
				}

				this.files = items;

				return this.fs.readFile('package.json');
			})
			.then(pkg => {
				this.pkg = pkg;
			});
	}
}

module.exports = Environment;
