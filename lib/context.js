'use strict';
const path = require('path');
const fs = require('fs');
const pify = require('pify');
const got = require('./utils/cache').got;
const travisGot = require('./utils/cache').travisGot;

const fsP = pify(fs);

// Base Context
class Context {

	constructor(opts) {
		this.opts = opts;
		this.travis = travisGot;
		this.validations = [];
	}

	addValidation(validation) {
		if (Array.isArray(validation)) {
			this.validations = this.validations.concat(validation);
			return;
		}

		this.validations.push(validation);
	}
}

class LocalContext extends Context {

	readFile(file) {
		return fsP.readFile(path.join(this.opts.cwd, file), 'utf8').then(content => {
			if (path.extname(file) === '.json') {
				return JSON.parse(content);
			}

			return content;
		});
	}
}

class GitHubContext extends Context {

	readFile(file) {
		const opts = {};

		if (path.extname(file) === '.json') {
			opts.json = true;
		}

		return got(`https://raw.githubusercontent.com/${this.repository.full_name}/master/${file}`, opts).then(data => data.body);
	}
}

exports.create = function (opts) {
	if (opts.local) {
		return new LocalContext(opts);
	}

	return new GitHubContext(opts);
};
