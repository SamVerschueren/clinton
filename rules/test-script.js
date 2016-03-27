'use strict';
module.exports = function (ctx) {
	return ctx.readFile('package.json').then(pkg => {
		if (pkg.scripts && (/no test specified/.test(pkg.scripts.test) || pkg.scripts.test === '')) {
			return Promise.reject({
				name: 'no-test-script',
				severity: 'error',
				message: 'The package is untested.'
			});
		}
	});
};
