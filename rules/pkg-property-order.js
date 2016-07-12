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
	const keys = ctx.options.length > 0 ? ctx.options : DEFAULT_ORDER;
	const file = ctx.fs.resolve('package.json');

	return ctx.fs.readFile('package.json')
		.then(pkg => {
			const pkgKeys = Object.keys(pkg);
			const order = keys.filter(x => pkgKeys.indexOf(x) !== -1);

			let index = 0;

			for (const key of order) {
				if (key !== pkgKeys[index]) {
					return {
						message: `Property '${key}' should occur before property '${pkgKeys[index]}'.`,
						file
					};
				}

				index++;
			}
		});
};
