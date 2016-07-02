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

module.exports = ctx => {
	const order = ctx.options.length > 0 ? ctx.options : DEFAULT_ORDER;

	return ctx.fs.readFile('package.json')
		.then(pkg => {
			const keys = Object.keys(pkg);

			order.reduce((value, property, propIndex) => {
				const keyIndex = keys.indexOf(property);

				if (keyIndex !== -1 && keyIndex < value) {
					const err = new Error(`Property '${order[propIndex - 1]}' should occur before property '${property}'.`);
					err.clinton = true;
					throw err;
				}

				return keyIndex;
			}, 0);
		})
		.catch(err => {
			if (err.clinton) {
				return {
					message: err.message,
					file: ctx.fs.resolve('package.json')
				};
			}

			throw err;
		});
};
