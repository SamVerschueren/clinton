'use strict';
const semver = require('semver');

const fix = (key, value) => {
	return pkg => {
		if (value === undefined) {
			delete pkg[key];
		} else {
			pkg[key] = value;
		}

		return pkg;
	};
};

const isGitRepository = repository => {
	if (!repository) {
		return false;
	}

	if (typeof repository !== 'string' && (typeof repository !== 'object' || repository.url === undefined)) {
		return false;
	}

	if (typeof repository === 'object') {
		repository = repository.url;
	}

	return repository.includes('github.com') || /^\w+\/\w+$/.test(repository);
};

module.exports = ctx => {
	const file = ctx.fs.resolve('package.json');

	return ctx.fs.readFile('package.json')
		.then(pkg => {
			if (pkg.version && semver.clean(pkg.version) !== pkg.version) {
				ctx.report({
					message: `Set \`version\` property to \`${semver.clean(pkg.version)}\`.`,
					fix: fix('version', semver.clean(pkg.version)),
					file
				});
			}

			if (typeof pkg.bin === 'object') {
				const keys = Object.keys(pkg.bin);

				if (keys.length === 1 && keys[0] === pkg.name) {
					ctx.report({
						message: `Set \`bin\` property to \`${pkg.bin[keys[0]]}\` instead of providing an object.`,
						fix: fix('bin', pkg.bin[keys[0]]),
						file
					});
				}
			}

			if (isGitRepository(pkg.bugs) && isGitRepository(pkg.repository)) {
				ctx.report({
					message: 'Remove moot property `bugs`.',
					fix: fix('bugs'),
					file
				});
			}

			if (isGitRepository(pkg.homepage) && isGitRepository(pkg.repository)) {
				ctx.report({
					message: 'Remove moot property `homepage`.',
					fix: fix('homepage'),
					file
				});
			}
		});
};
