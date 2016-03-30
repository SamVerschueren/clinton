'use strict';
const travisGot = require('../utils/cache').travisGot;

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

module.exports = Context;
