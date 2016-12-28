'use strict';
module.exports = ctx => ctx.fs.readFile('package.json').then(pkg => {
	if (!Array.isArray(pkg.files)) {
		ctx.report({
			message: 'Missing `files` property in `package.json`.',
			file: ctx.fs.resolve('package.json')
		});
	}
});
