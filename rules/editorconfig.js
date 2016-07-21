'use strict';
module.exports = ctx => {
	if (ctx.files.indexOf('.editorconfig') === -1) {
		return {
			message: 'Use `.editorconfig` to define and maintain consistent coding styles between editors',
			file: ctx.fs.resolve('.editorconfig')
		};
	}

	// https://github.com/SamVerschueren/clinton/issues/26
	// return new Promise(resolve => {
	// 	const errors = [];

	// 	const stream = vfs.src(['**/*', '!node_modules', '!node_modules/**'], {cwd: ctx.env.path})
	// 		.pipe(eclint.check({
	// 			reporter: (file, message) => {
	// 				errors.push({
	// 					message,
	// 					file: file.path
	// 				});
	// 			}
	// 		}));

	// 	stream.on('data', () => {});

	// 	stream.on('finish', () => {
	// 		resolve(errors);
	// 	});
	// });
};
