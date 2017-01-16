'use strict';
const DEFAULT_ORDER = [
	'name',
	'version',
	'description',
	'license',
	'repository',
	'homepage',
	'bugs',
	'author',
	'maintainers',
	'contributors',
	'private',
	'preferGlobal',
	'publishConfig',
	'config',
	'main',
	'bin',
	'man',
	'os',
	'cpu',
	'engines',
	'scripts',
	'files',
	'keywords',
	'dependencies',
	'devDependencies',
	'peerDependencies',
	'bundledDependencies',
	'optionalDependencies'
];

const fix = (ctx, keys) => {
	return pkg => {
		const ret = Object.create(null);
		const pkgProps = Object.keys(pkg);

		// Order the known package properties
		const knownProps = keys.filter(key => pkgProps.indexOf(key) !== -1);
		for (const prop of knownProps) {
			ret[prop] = pkg[prop];
		}

		// Order to unknown package properties
		const unknownProps = pkgProps.filter(prop => keys.indexOf(prop) === -1).sort();
		for (const prop of unknownProps) {
			ret[prop] = pkg[prop];
		}

		return ret;
	};
};

module.exports = ctx => {
	let keys = DEFAULT_ORDER;

	if (ctx.options[0] && ctx.options[0].order) {
		keys = ctx.options[0].order;
	}

	const file = ctx.fs.resolve('package.json');

	return ctx.fs.readFile('package.json')
		.then(pkg => {
			const pkgKeys = Object.keys(pkg);
			const order = keys.filter(x => pkgKeys.indexOf(x) !== -1);

			let index = 0;

			for (const key of order) {
				if (key !== pkgKeys[index]) {
					ctx.report({
						message: `Property '${key}' should occur before property '${pkgKeys[index]}'.`,
						fix: fix(ctx, keys),
						file
					});
					return;
				}

				index++;
			}
		});
};
