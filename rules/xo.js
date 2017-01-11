'use strict';
const semver = require('semver');
const parseArgs = require('yargs-parser');

module.exports = ctx => {
	const requiredVersion = ctx.options[0];
	const file = ctx.fs.resolve('package.json');

	return ctx.fs.readFile('package.json').then(pkg => {
		const installedVersion = pkg.devDependencies && pkg.devDependencies.xo;

		if (!installedVersion) {
			ctx.report({
				message: 'XO is not installed as devDependency.',
				file
			});
			return;
		}

		if (pkg.engines && pkg.engines.node && !semver.satisfies('0.10.0', pkg.engines.node) && !semver.satisfies('0.12.0', pkg.engines.node)) {
			if (!pkg.xo || pkg.xo.esnext !== true) {
				ctx.report({
					message: 'Enforce ES2015+ rules in XO with the `esnext` option.',
					file,
					fix: pkg => {
						pkg.xo = Object.assign({}, pkg.xo, {esnext: true});
						return pkg;
					}
				});
			}
		}

		if (requiredVersion) {
			if (requiredVersion === '*' && installedVersion !== '*') {
				ctx.report({
					message: `Expected unicorn version '*' but found '${installedVersion}'.`,
					file
				});
			} else if (requiredVersion !== '*' && !semver.gte(installedVersion, requiredVersion)) {
				ctx.report({
					message: `Expected version '${requiredVersion}' but found '${installedVersion}'.`,
					file
				});
			}
		}

		if (!pkg.scripts || !pkg.scripts.test || !/\bxo\b/.test(pkg.scripts.test)) {
			ctx.report({
				message: 'XO is not used in the test script.',
				file,
				fix: pkg => {
					if (!pkg.scripts) {
						pkg.scripts = {};
					}

					if (pkg.scripts.test && pkg.scripts.test.length !== 0 && !pkg.scripts.test.includes('exit 1')) {
						pkg.scripts.test = `xo && ${pkg.scripts.test}`;
					} else {
						pkg.scripts.test = `xo`;
					}

					return pkg;
				}
			});
		}

		if (pkg.scripts && pkg.scripts.test && /\bxo\b[^&]*[-]{2}/.test(pkg.scripts.test)) {
			ctx.report({
				message: 'Specify XO config in `package.json` instead of passing it through via the CLI.',
				file,
				fix: pkg => {
					const regex = /\bxo\b([^&]*)/;

					const command = pkg.scripts.test.match(regex)[1];
					const args = parseArgs(command.trim());

					delete args._;

					for (const arg of Object.keys(args)) {
						if (arg.indexOf('-') !== -1) {
							delete args[arg];
						}
					}

					pkg.xo = Object.assign({}, pkg.xo, args);
					pkg.scripts.test = pkg.scripts.test.replace(regex, 'xo ').trim();

					return pkg;
				}
			});
		}
	});
};
