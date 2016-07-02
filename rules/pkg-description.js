'use strict';
module.exports = ctx => {
	const pkg = ctx.env.pkg;
	const file = ctx.fs.resolve('package.json');

	if (!pkg.description) {
		return;
	}

	if (pkg.description[0] !== pkg.description[0].toUpperCase()) {
		return {
			message: 'Package `description` should start with a capital letter',
			file
		};
	}

	if (/\.$/.test(pkg.description)) {
		return {
			message: 'Package `description` should not end with a dot',
			file
		};
	}
};