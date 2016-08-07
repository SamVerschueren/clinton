'use strict';
const semver = require('semver');
const detectIndent = require('detect-indent');
const parseArgs = require('yargs-parser');

const fix = (ctx, method) => {
	return () => {
		const fixers = {
			esnext: pkg => {
				if (!pkg.xo) {
					pkg.xo = {};
				}

				pkg.xo.esnext = true;
			},
			script: pkg => {
				if (!pkg.scripts) {
					pkg.scripts = {};
				}

				if (pkg.scripts.test && pkg.scripts.test.length !== 0 && !pkg.scripts.test.includes('exit 1')) {
					pkg.scripts.test = `xo && ${pkg.scripts.test}`;
				} else {
					pkg.scripts.test = `xo`;
				}
			},
			clioptions: pkg => {
				const regex = /\bxo\b([^&]*)/;

				const command = pkg.scripts.test.match(regex)[1];
				const args = parseArgs(command.trim());

				delete args._;

				pkg.xo = Object.assign({}, pkg.xo, args);
				pkg.scripts.test = pkg.scripts.test.replace(regex, 'xo ').trim();
			}
		};

		return ctx.fs.readFile('package.json', false)
			.then(pkg => {
				// Detect formatting options
				const indentation = detectIndent(pkg).indent;
				const lastchar = pkg.split('\n').pop().trim().length === 0 ? '\n' : '';

				pkg = JSON.parse(pkg);

				fixers[method](pkg);

				const contents = JSON.stringify(pkg, undefined, indentation);
				return ctx.fs.writeFile('package.json', `${contents}${lastchar}`, 'utf8');
			});
	};
};

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

		const errors = [];

		if (pkg.engines && pkg.engines.node && !semver.satisfies('0.10.0', pkg.engines.node) && !semver.satisfies('0.12.0', pkg.engines.node)) {
			if (!pkg.xo || pkg.xo.esnext !== true) {
				errors.push({
					message: 'Enforce ES2015+ rules in XO with the `esnext` option.',
					fix: fix(ctx, 'esnext'),
					file
				});
			}
		}

		if (requiredVersion) {
			if (requiredVersion === '*' && installedVersion !== '*') {
				errors.push({
					message: `Expected unicorn version '*' but found '${installedVersion}'.`,
					file
				});
			} else if (requiredVersion !== '*' && !semver.gte(installedVersion, requiredVersion)) {
				errors.push({
					message: `Expected version '${requiredVersion}' but found '${installedVersion}'.`,
					file
				});
			}
		}

		if (!pkg.scripts || !pkg.scripts.test || !/\bxo\b/.test(pkg.scripts.test)) {
			errors.push({
				message: 'XO is not used in the test script.',
				fix: fix(ctx, 'script'),
				file
			});
		}

		if (pkg.scripts && pkg.scripts.test && /\bxo\b[^&]*[\-]{2}/.test(pkg.scripts.test)) {
			errors.push({
				message: 'Specify XO config in `package.json` instead of passing it through via the CLI.',
				fix: fix(ctx, 'clioptions'),
				file
			});
		}

		return errors;
	});
};
