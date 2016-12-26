'use strict';
const semver = require('semver');
const detectIndent = require('detect-indent');
const parseArgs = require('yargs-parser');

const fix = (ctx, method) => {
	return () => {
		const fixers = {
			script: pkg => {
				if (!pkg.scripts) {
					pkg.scripts = {};
				}

				if (pkg.scripts.test && pkg.scripts.test.length !== 0 && !pkg.scripts.test.includes('exit 1')) {
					pkg.scripts.test = `${pkg.scripts.test} && ava`;
				} else {
					pkg.scripts.test = `ava`;
				}
			},
			clioptions: pkg => {
				const regex = /\bava\b([^&]*)/;

				const command = pkg.scripts.test.match(regex)[1];
				const args = parseArgs(command.trim());

				delete args._;

				pkg.ava = Object.assign({}, pkg.ava, args);
				pkg.scripts.test = pkg.scripts.test.replace(regex, 'ava ').trim();
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
		const installedVersion = pkg.devDependencies && pkg.devDependencies.ava;

		if (!installedVersion) {
			return {
				message: 'AVA is not installed as devDependency.',
				file
			};
		}

		const errors = [];

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

		if (!pkg.scripts || !pkg.scripts.test || !/\bava\b/.test(pkg.scripts.test)) {
			errors.push({
				message: 'AVA is not used in the test script.',
				fix: fix(ctx, 'script'),
				file
			});
		}

		if (pkg.scripts && pkg.scripts.test && /\bava\b[^&]*[-]{2}/.test(pkg.scripts.test)) {
			errors.push({
				message: 'Specify AVA config in `package.json` instead of passing it through via the CLI.',
				fix: fix(ctx, 'clioptions'),
				file
			});
		}

		return errors;
	});
};
