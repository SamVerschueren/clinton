'use strict';
module.exports = function (ctx) {
	return ctx.fs.readFile('package.json').then(pkg => {
		if (pkg.scripts && (/no test specified/.test(pkg.scripts.test) || pkg.scripts.test === '')) {
			throw new Error('The package is untested.');
		}
	});
};
