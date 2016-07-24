'use strict';
/**
 * Special thanks to `eslint-plugin-xo` with their `filename-case` rule.
 * https://github.com/sindresorhus/eslint-plugin-xo/blob/master/docs/rules/filename-case.md
 */
const path = require('path');
const camelCase = require('lodash.camelcase');
const kebabCase = require('lodash.kebabcase');
const snakeCase = require('lodash.snakecase');
const upperfirst = require('lodash.upperfirst');

const pascalCase = str => upperfirst(camelCase(str));
const numberRegex = /(\d+)/;
const PLACEHOLDER = '\uFFFF\uFFFF\uFFFF';
const PLACEHOLDER_REGEX = new RegExp(PLACEHOLDER, 'i');

function ignoreNumbers(fn) {
	return str => {
		const stack = [];
		let execResult = numberRegex.exec(str);

		while (execResult) {
			stack.push(execResult[0]);
			str = str.replace(execResult[0], PLACEHOLDER);
			execResult = numberRegex.exec(str);
		}

		let withCase = fn(str);

		while (stack.length > 0) {
			withCase = withCase.replace(PLACEHOLDER_REGEX, stack.shift());
		}

		return withCase;
	};
}

const cases = {
	camelCase: {
		fn: camelCase,
		name: 'camel case'
	},
	kebabCase: {
		fn: kebabCase,
		name: 'kebab case'
	},
	snakeCase: {
		fn: snakeCase,
		name: 'snake case'
	},
	pascalCase: {
		fn: pascalCase,
		name: 'pascal case'
	}
};

const fixFilename = (chosenCase, filename) => filename
	.split('.')
	.map(ignoreNumbers(chosenCase.fn))
	.join('.');

const leadingUnserscoresRegex = /^(_+)(.*)$/;
const splitFilename = filename => {
	const res = leadingUnserscoresRegex.exec(filename);
	return {
		leading: (res && res[1]) || '',
		trailing: (res && res[2]) || filename
	};
};

module.exports = ctx => {
	const chosenCase = cases[ctx.options[0].case || 'camelCase'];

	const errors = [];

	for (const file of ctx.files) {
		const extension = path.extname(file);
		const filename = path.basename(file, extension);
		const splitName = splitFilename(filename);
		const fixedFilename = fixFilename(chosenCase, splitName.trailing);
		const renameFilename = splitName.leading + fixedFilename + extension;

		if (fixedFilename !== splitName.trailing) {
			errors.push({
				message: `Filename is not in ${chosenCase.name}. Rename it to \`${renameFilename}\`.`,
				file: ctx.fs.resolve(file)
			});
		}
	}

	return errors;
};
