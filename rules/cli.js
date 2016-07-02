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
			return {
				message: `Executable file \`${file}\` does not exist.`,
				file: ctx.fs.resolve('package.json')
			};
		}

		return executable(ctx.fs.resolve(file)).then(isExecutable => {
			if (!isExecutable) {
				return {
					message: `File \`${file}\` is not executable.`,
					file: ctx.fs.resolve(file)
				};
			}
		});
	}));
};
