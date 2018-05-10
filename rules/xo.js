'use strict';
const semver = require('semver');
const parseArgs = require('yargs-parser');

const fixers = {
	version: version => {
		return pkg => {
			pkg.devDependencies.xo = version;
			return pkg;
		};
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

		return pkg;
	},
	clioptions: pkg => {
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
};

module.exports = ctx => {
	let requiredVersion = ctx.options[0];
	const file = ctx.fs.resolve('package.json');

	return ctx.fs.readFile('package.json').then(pkg => {
		let installedVersion = pkg.devDependencies && pkg.devDependencies.xo;

		if (!installedVersion) {
			ctx.report({
				message: 'XO is not installed as devDependency.',
				file
			});
			return;
		}

		installedVersion = installedVersion.replace(/^(~|\^)/, '');

		const engine = pkg.engines && pkg.engines.node ? pkg.engines.node : undefined;
		const supportsNode0 = engine && (semver.satisfies('0.10.0', engine) || semver.satisfies('0.12.0', engine));
		const supportsNode4 = engine && (semver.satisfies('4.0.0', engine));
		const requiresUnicorn = requiredVersion === '*';

		if (supportsNode0 && (!requiredVersion || requiredVersion === '*' || semver.gte(requiredVersion, '0.16.0'))) {
			requiredVersion = '0.16.0';
		} else if (supportsNode4 && (!requiredVersion || requiredVersion === '*' || semver.gte(requiredVersion, '0.20.3'))) {
			requiredVersion = '0.20.3';
		}

		if (requiredVersion) {
			if (requiresUnicorn && requiredVersion === '*' && installedVersion !== '*') {
				ctx.report({
					message: `Expected unicorn version '*' but found '${installedVersion}'.`,
					fix: fixers.version('*'),
					file
				});
			} else if (installedVersion !== requiredVersion) {
				ctx.report({
					message: `Expected version '${requiredVersion}' but found '${installedVersion}'.`,
					fix: fixers.version(`^${requiredVersion}`),
					file
				});
			}
		}

		if (!pkg.scripts || !pkg.scripts.test || !/\bxo\b/.test(pkg.scripts.test)) {
			ctx.report({
				message: 'XO is not used in the test script.',
				file,
				fix: fixers.script
			});
		}

		if (pkg.scripts && pkg.scripts.test && /\bxo\b[^&]*[-]{2}/.test(pkg.scripts.test)) {
			ctx.report({
				message: 'Specify XO config in `package.json` instead of passing it through via the CLI.',
				file,
				fix: fixers.clioptions
			});
		}
	});
};
