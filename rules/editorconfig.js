'use strict';
const LintSpaces = require('lintspaces');

const IGNORE_FILES = [
	'package-lock.json',
	'yarn.lock'
];

module.exports = ctx => {
	if (ctx.files.indexOf('.editorconfig') === -1) {
		ctx.report({
			message: 'Use `.editorconfig` to define and maintain consistent coding styles between editors',
			file: ctx.fs.resolve('.editorconfig')
		});
		return;
	}

	const lintSpaces = new LintSpaces({
		editorconfig: ctx.fs.resolve('.editorconfig'),
		ignores: [
			'js-comments',
			/`[\s\S]*?`/g
		]
	});

	for (const file of ctx.files) {
		if (IGNORE_FILES.indexOf(file) === -1) {
			lintSpaces.validate(ctx.fs.resolve(file));
		}
	}

	const results = lintSpaces.getInvalidFiles();

	for (const file of Object.keys(results)) {
		const errors = results[file];

		for (const line of Object.keys(errors)) {
			const lineErrors = errors[line];

			for (const error of lineErrors) {
				ctx.report({
					message: `${error.message.replace(/\.$/, '')} at line ${error.line}`,
					file
				});
			}
		}
	}
};
