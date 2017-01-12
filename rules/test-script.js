'use strict';
module.exports = ctx => ctx.fs.readFile('package.json').then(pkg => {
	if (pkg.scripts && (!pkg.scripts.test || /no test specified/.test(pkg.scripts.test))) {
		ctx.report({
			message: 'The package is untested.'
		});
	}
});
