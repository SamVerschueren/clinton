'use strict';
const detectIndent = require('detect-indent');
const semver = require('semver');

const fix = (ctx, key, value) => {
	return () => ctx.fs.readFile('package.json', false)
		.then(pkg => {
			// Detect formatting options
			const indentation = detectIndent(pkg).indent;
			const lastchar = pkg.split('\n').pop().trim().length === 0 ? '\n' : '';

			pkg = JSON.parse(pkg);
			pkg[key] = value;

			const contents = JSON.stringify(pkg, undefined, indentation);
			return ctx.fs.writeFile('package.json', `${contents}${lastchar}`, 'utf8');
		});
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
			const errors = [];

			if (pkg.version && semver.clean(pkg.version) !== pkg.version) {
				errors.push({
					message: `Set \`version\` property to \`${semver.clean(pkg.version)}\`.`,
					fix: fix(ctx, 'version', semver.clean(pkg.version)),
					file
				});
			}

			if (typeof pkg.bin === 'object') {
				const keys = Object.keys(pkg.bin);

				if (keys.length === 1 && keys[0] === pkg.name) {
					errors.push({
						message: `Set \`bin\` property to \`${pkg.bin[keys[0]]}\` instead of providing an object.`,
						fix: fix(ctx, 'bin', pkg.bin[keys[0]]),
						file
					});
				}
			}

			if (isGitRepository(pkg.bugs) && isGitRepository(pkg.repository)) {
				errors.push({
					message: 'Remove moot property `bugs`.',
					fix: fix(ctx, 'bugs'),
					file
				});
			}

			if (isGitRepository(pkg.homepage) && isGitRepository(pkg.repository)) {
				errors.push({
					message: 'Remove moot property `homepage`.',
					fix: fix(ctx, 'homepage'),
					file
				});
			}

			return errors;
		});
};
