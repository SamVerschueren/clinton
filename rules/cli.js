'use strict';
const executable = require('executable');

const parse = input => {
	if (typeof input === 'object') {
		return Object.keys(input).map(key => input[key]);
	}

	return [input];
};

module.exports = ctx => {
	if (!ctx.env.pkg.bin) {
		return;
	}

	const files = parse(ctx.env.pkg.bin);

	return Promise.all(files.map(file => {
		if (ctx.files.indexOf(file) === -1) {
			ctx.report({
				message: `Executable file \`${file}\` does not exist.`,
				file: ctx.fs.resolve('package.json')
			});
			return Promise.resolve();
		}

		return executable(ctx.fs.resolve(file)).then(isExecutable => {
			if (!isExecutable) {
				ctx.report({
					message: `File \`${file}\` is not executable.`,
					file: ctx.fs.resolve(file)
				});
			}
		});
	}));
};
