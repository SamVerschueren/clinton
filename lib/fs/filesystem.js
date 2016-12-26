'use strict';
const fs = require('fs');
const path = require('path');
const pify = require('pify');
const pathExists = require('path-exists');
const fileparser = require('./fileparser');

const fsP = pify(fs);

class FileSystem {

	constructor(env) {
		this._env = env;
	}

	resolve(file) {
		return path.join(this._env.path, file);
	}

	require(file) {
		return Promise.resolve(require(this.resolve(file)));	// eslint-disable-line import/no-dynamic-require
	}

	pathExists(file) {
		return pathExists(this.resolve(file));
	}

	readFile(file, parse) {
		return fsP.readFile(path.join(this._env.path, file), 'utf8')
			.then(content => parse === false ? content : fileparser.parse(file, content))
			.catch(err => {
				if (err.code === 'ENOENT') {
					return undefined;
				}

				throw err;
			});
	}

	writeFile(file, data, encoding) {
		return fsP.writeFile(path.join(this._env.path, file), data, encoding);
	}
}

module.exports = FileSystem;
