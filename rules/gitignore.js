'use strict';
const fix = (ctx, contents) => {
	return () => ctx.fs.writeFile('.gitignore', contents, 'utf8');
};

module.exports = ctx => {
	const file = ctx.fs.resolve('.gitignore');

	if (ctx.files.indexOf('.gitignore') === -1) {
		ctx.report({
			message: 'No `.gitignore` file found. Add it to the root of your project.',
			file,
			fix: fix(ctx, 'node_modules')
		});
		return;
	}

	return ctx.fs.readFile('.gitignore')
		.then(contents => {
			const lines = contents.split(/\r?\n/).filter(Boolean);

			if (lines.indexOf('node_modules') === -1 && lines.indexOf('node_modules/')) {
				lines.push('node_modules');

				ctx.report({
					message: '`node_modules` is not being ignored. Add it to `.gitignore`.',
					file,
					fix: fix(ctx, lines.join('\n'))
				});
			}
		});
};
