'use strict';

class Context {
	constructor(environment, args) {
		this.env = environment;
		this.options = args;
		this.validations = [];

		// References
		this.fs = environment.fs;
		this.files = environment.files;
	}
}

module.exports.create = function (environment, args) {
	return new Context(environment, args);
};
