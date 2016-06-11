'use strict';
const fs = require('fs');
const path = require('path');
const pify = require('pify');
const fileparser = require('./fileparser');
const fsP = pify(fs);

class FileSystem {

	constructor(env) {
		this._env = env;
	}

	resolve(file) {
		return path.join(this._env.path, file);
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

	require(file) {
		return Promise.resolve(require(path.join(this._env.path, file)));
	}
}

module.exports = FileSystem;
