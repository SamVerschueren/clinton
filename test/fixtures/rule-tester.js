'use strict';
const lint = require('../../').lint;
const Fixer = require('../../lib/fixer');

const testFix = (t, validation, output) => {
	const fixer = new Fixer();

	return fixer.fix(validation).then(result => {
		t.deepEqual(result, output);
	});
};

const clean = validations => {
	for (const validation of validations) {
		if (typeof validation.fix !== 'function') {
			throw new TypeError(`Expected \`.fix\` to be a \`function\`, got \`${typeof validation.fix}\``);
		}

		delete validation.fix;
	}

	return validations;
};

module.exports = options => {
	options = Object.assign({inherit: false}, options);

	return (t, rule, expectedValidations, expectedFixes) => {
		return lint(rule, options)
			.then(validations => {
				let ret = Promise.resolve();

				if (expectedFixes) {
					const promises = validations.map((x, i) => testFix(t, x, expectedFixes[i]));

					ret = ret.then(() => Promise.all(promises));
				}

				return ret.then(() => validations);
			})
			.then(validations => {
				if (expectedFixes) {
					validations = clean(validations);
				}

				if (expectedValidations) {
					t.deepEqual(validations, expectedValidations);
				}

				return validations;
			});
	};
};
