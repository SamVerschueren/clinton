'use strict';
const fix = contents => {
	const lines = contents.split(/\r?\n/);
	const nrOfLines = lines.length;
	const emptyLine = lines[nrOfLines - 1].trim() === '';

	if (emptyLine) {
		lines.splice(nrOfLines - 1, 0, ['node_modules']);
	} else {
		lines.push(['node_modules']);
	}

	return lines.join('\n');
};

module.exports = ctx => {
	const file = ctx.fs.resolve('.gitignore');

	if (ctx.files.indexOf('.gitignore') === -1) {
		ctx.report({
			message: 'No `.gitignore` file found. Add it to the root of your project.',
			file,
			fix
		});
		return;
	}

	return ctx.fs.readFile('.gitignore')
		.then(contents => {
			const lines = contents.split(/\r?\n/).filter(Boolean);

			if (lines.indexOf('node_modules') === -1 && lines.indexOf('node_modules/')) {
				ctx.report({
					message: '`node_modules` is not being ignored. Add it to `.gitignore`.',
					file,
					fix
				});
			}
		});
};
