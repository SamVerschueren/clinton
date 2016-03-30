'use strict';
const fs = require('fs');
const path = require('path');
const pify = require('pify');
const Context = require('./context');

const fsP = pify(fs);

class LocalFileSystem {

	constructor(ctx) {
		this.ctx = ctx;
	}

	readFile(file) {
		return fsP.readFile(path.join(this.ctx.opts.cwd, file), 'utf8').then(content => {
			if (path.extname(file) === '.json') {
				return JSON.parse(content);
			}

			return content;
		});
	}
}

class LocalContext extends Context {

	constructor(opts) {
		super(opts);

		this.fs = new LocalFileSystem(this);
	}
}

module.exports = LocalContext;
