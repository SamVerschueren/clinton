'use strict';
module.exports = ctx => ctx.fs.readFile('package.json').then(pkg => {
	if (!pkg.main) {
		return;
	}

	const fileName = ctx.files.find(file => file.toLowerCase().indexOf(pkg.main) === 0);

	if (!fileName) {
		return {
			message: `Main file '${pkg.main}' does not exist.`,
			file: ctx.fs.resolve('package.json')
		};
	}
});
