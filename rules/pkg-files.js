'use strict';
module.exports = ctx => ctx.fs.readFile('package.json').then(pkg => {
	if (!Array.isArray(pkg.files)) {
		return {
			message: 'Missing `files` property in `package.json`.'
		};
	}
});
