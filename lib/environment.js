'use strict';
const path = require('path');
const pathExists = require('path-exists');
const globby = require('globby');
const isDir = require('is-d');
const junk = require('junk');
const FileSystem = require('./fs/filesystem');

const IGNORES = [
	'.git/**',
	'**/.github/**',
	'**/node_modules/**',
	'**/*.app/*/**'
];

class Environment {

	constructor(path) {
		this.path = path;
		this.fs = new FileSystem(this);
	}

	isValid() {
		return pathExists.sync(path.join(this.path, 'package.json'));
	}

	load(config) {
		const toGlob = file => {
			file = file.replace(/(\/+|\\+)$/, '');

			const filePath = path.join(this.path, file);

			return pathExists(filePath)
				.then(exists => exists ? isDir(filePath).then(dir => file + (dir ? '/**' : '')) : '');
		};

		return this.fs.readFile('.gitignore')
			.then(gitignore => {
				gitignore = gitignore || '';
				gitignore = gitignore.split(/\r?\n/).filter(Boolean);

				return Promise.all(gitignore.map(toGlob));
			})
			// Ignore all the files from `.gitignore`
			.then(gitignore => {
				// Concat ignores from `.gitignore`, the config and the hardcoded values
				const ignore = [].concat(gitignore, config.ignores, IGNORES);

				return globby('**/*', {
					cwd: this.path,
					dot: true,
					silent: true,
					ignore
				});
			})
			.then(items => {
				if (items.indexOf('package.json') === -1) {
					return Promise.reject(new Error('No package.json file found'));
				}

				// Filter out junk, the files starting with a `_` and directories
				this.files = items
					.filter(item => {
						const base = path.basename(item);
						return junk.not(base) && base.indexOf('_') !== 0;
					})
					.filter(file => !isDir.sync(path.join(this.path, file)));

				return this.fs.readFile('package.json');
			})
			.then(pkg => {
				this.pkg = pkg;
			});
	}
}

module.exports = Environment;
