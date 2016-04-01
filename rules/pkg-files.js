'use strict';
module.exports = function (ctx) {
	return ctx.fs.readFile('package.json').then(pkg => {
		if (!Array.isArray(pkg.files)) {
			return Promise.reject(new Error('Missing `files` property in `package.json`.'));
		}
	});
};
