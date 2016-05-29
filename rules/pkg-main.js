'use strict';
const pathExists = require('path-exists');

module.exports = ctx => ctx.fs.readFile('package.json').then(pkg => {
	if (!pkg.main) {
		return;
	}

	return pathExists(pkg.main).then(exists => {
		if (!exists) {
			return {
				message: `Main file '${pkg.main}' does not exist.`
			};
		}
	});
});
