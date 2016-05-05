'use strict';
module.exports = ctx => ctx.fs.readFile('package.json').then(pkg => {
	if (pkg.scripts && (/no test specified/.test(pkg.scripts.test) || pkg.scripts.test === '')) {
		return {
			message: 'The package is untested'
		};
	}
});
