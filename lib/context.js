'use strict';
const cache = require('./utils/cache');

class Context {
	constructor(environment, args) {
		this.env = environment;
		this.options = args;
		this.validations = [];

		// References
		this.fs = environment.fs;
		this.files = environment.files;

		// Remotes
		this.got = cache.got;
		this.github = cache.ghGot;
		this.travis = cache.travisGot;
	}
}

module.exports.create = (environment, args) => {
	return new Context(environment, args);
};
