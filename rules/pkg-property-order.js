'use strict';
const DEFAULT_ORDER = [
	'name',
	'version',
	'description',
	'license',
	'repository',
	'author',
	'main',
	'bin',
	'engines',
	'scripts',
	'files',
	'keywords',
	'dependencies',
	'devDependencies'
];

module.exports = ctx => {
	const order = ctx.options.length > 0 ? ctx.options : DEFAULT_ORDER;

	return ctx.fs.readFile('package.json')
		.then(pkg => {
			const keys = Object.keys(pkg);

			order.reduce((value, property, propIndex) => {
				const keyIndex = keys.indexOf(property);

				if (keyIndex !== -1 && keyIndex < value) {
					const err = new Error(`Found property '${property}' but expected '${order[propIndex - 1]}'.`);
					err.clinton = true;
					throw err;
				}

				return keyIndex;
			}, 0);
		})
		.catch(err => {
			if (err.clinton) {
				return {
					message: err.message
				};
			}

			throw err;
		});
};
