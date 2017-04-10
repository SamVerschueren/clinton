'use strict';
const semver = require('semver');
const parseArgs = require('yargs-parser');

const fixers = {
	version: version => {
		return pkg => {
			pkg.devDependencies.ava = version;
			return pkg;
		};
	},
	script: pkg => {
		if (!pkg.scripts) {
			pkg.scripts = {};
		}

		if (pkg.scripts.test && pkg.scripts.test.length !== 0 && !pkg.scripts.test.includes('exit 1')) {
			pkg.scripts.test = `${pkg.scripts.test} && ava`;
		} else {
			pkg.scripts.test = `ava`;
		}

		return pkg;
	},
	clioptions: pkg => {
		const regex = /\bava\b([^&]*)/;

		const command = pkg.scripts.test.match(regex)[1];
		const args = parseArgs(command.trim());

		delete args._;

		for (const arg of Object.keys(args)) {
			if (arg.indexOf('-') !== -1) {
				delete args[arg];
			}
		}

		pkg.ava = Object.assign({}, pkg.ava, args);
		pkg.scripts.test = pkg.scripts.test.replace(regex, 'ava ').trim();

		return pkg;
	}
};

module.exports = ctx => {
	let requiredVersion = ctx.options[0];
	const file = ctx.fs.resolve('package.json');

	return ctx.fs.readFile('package.json').then(pkg => {
		let installedVersion = pkg.devDependencies && pkg.devDependencies.ava;

		if (!installedVersion) {
			ctx.report({
				message: 'AVA is not installed as devDependency.',
				file
			});
			return;
		}

		installedVersion = installedVersion.replace(/^(~|\^)/, '');

		const engine = pkg.engines && pkg.engines.node ? pkg.engines.node : undefined;
		const supportsOlderVersions = engine && (semver.satisfies('0.10.0', engine) || semver.satisfies('0.12.0', engine));
		const requiresUnicorn = requiredVersion === '*';

		if (supportsOlderVersions && (!requiredVersion || requiredVersion === '*' || semver.gte(requiredVersion, '0.17.0'))) {
			requiredVersion = '0.17.0';
		}

		if (requiredVersion) {
			if (requiresUnicorn && requiredVersion === '*' && installedVersion !== '*') {
				ctx.report({
					message: `Expected unicorn version '*' but found '${installedVersion}'.`,
					file,
					fix: fixers.version('*')
				});
			} else if (installedVersion !== requiredVersion) {
				ctx.report({
					message: `Expected version '${requiredVersion}' but found '${installedVersion}'.`,
					file,
					fix: fixers.version(`^${requiredVersion}`)
				});
			}
		}

		if (!pkg.scripts || !pkg.scripts.test || !/\bava\b/.test(pkg.scripts.test)) {
			ctx.report({
				message: 'AVA is not used in the test script.',
				fix: fixers.script,
				file
			});
		}

		if (pkg.scripts && pkg.scripts.test && /\bava\b[^&]*[-]{2}/.test(pkg.scripts.test)) {
			ctx.report({
				message: 'Specify AVA config in `package.json` instead of passing it through via the CLI.',
				fix: fixers.clioptions,
				file
			});
		}
	});
};
