'use strict';
const semver = require('semver');

module.exports = ctx => {
	const requiredVersion = ctx.options[0];
	const file = ctx.fs.resolve('package.json');

	return ctx.fs.readFile('package.json').then(pkg => {
		const installedVersion = pkg.devDependencies && pkg.devDependencies.xo;

		if (!installedVersion) {
			return {
				message: 'XO is not installed as devDependency.',
				file
			};
		}

		if (requiredVersion) {
			if (requiredVersion === '*' && installedVersion !== '*') {
				return {
					message: `Expected unicorn version '*' but found '${installedVersion}'.`,
					file
				};
			} else if (requiredVersion !== '*' && !semver.gte(installedVersion, requiredVersion)) {
				return {
					message: `Expected version '${requiredVersion}' but found '${installedVersion}'.`,
					file
				};
			}
		}

		if (!pkg.scripts || !pkg.scripts.test || !/\bxo\b/.test(pkg.scripts.test)) {
			return {
				message: 'XO is not used in the test script.',
				file
			};
		}

		if (/\bxo\b[^&]*[\-]{2}/.test(pkg.scripts.test)) {
			return {
				message: 'Specify XO config in `package.json` instead of passing it through via the CLI.',
				file
			};
		}
	});
};
