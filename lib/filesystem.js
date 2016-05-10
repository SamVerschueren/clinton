'use strict';
const fs = require('fs');
const path = require('path');
const pify = require('pify');
const fsP = pify(fs);

class FileSystem {

	constructor(env) {
		this._env = env;
	}

	readFile(file) {
		return fsP.readFile(path.join(this._env._path, file), 'utf8')
			.then(content => path.extname(file) === '.json' ? JSON.parse(content) : content)
			.catch(err => {
				if (err.code === 'ENOENT') {
					return undefined;
				}

				throw err;
			});
	}
}

module.exports = FileSystem;
