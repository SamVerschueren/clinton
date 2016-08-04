'use strict';
exports.assign = opts => {
	return function () {
		return Object.assign.apply(Object, [{}, opts].concat(Array.from(arguments)));
	};
};

exports.fix = validations => {
	for (const validation of validations) {
		if (typeof validation.fix !== 'function') {
			throw new TypeError(`Expected \`.fix\` to be a \`function\`, got \`${typeof validation.fix}\``);
		}

		delete validation.fix;
	}

	return validations;
};
