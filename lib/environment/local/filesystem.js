'use strict';
const fs = require('fs');
const path = require('path');
const pify = require('pify');
const fsP = pify(fs);

class LocalFileSystem {

	constructor(opts) {
		this._opts = opts;
	}

	readFile(file) {
		return fsP.readFile(path.join(this._opts.cwd, file), 'utf8').then(content => {
			if (path.extname(file) === '.json') {
				return JSON.parse(content);
			}

			return content;
		});
	}
}

module.exports = LocalFileSystem;
