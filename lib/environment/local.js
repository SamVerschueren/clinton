'use strict';
const path = require('path');
const globby = require('globby');
const LocalFileSystem = require('./local/filesystem');

class LocalEnvironment {

	constructor(opts) {
		this._opts = opts;
		this.fs = new LocalFileSystem(this._opts);
	}

	load(dir) {
		// TODO ignore all the files/directories from `.gitignore`
		const ignore = ['node_modules/**'];

		return globby(path.join(dir, '**/*'), {cwd: this._opts.cwd, dot: true, ignore})
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
