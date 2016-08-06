'use strict';
const detectIndent = require('detect-indent');

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

const fix = ctx => {
	return () => {
		const keys = ctx.options.length > 0 ? ctx.options : DEFAULT_ORDER;

		return ctx.fs.readFile('package.json', false)
			.then(pkg => {
				// Detect formatting options
				const indentation = detectIndent(pkg).indent;
				const lastchar = pkg.split('\n').pop().trim().length === 0 ? '\n' : '';

				pkg = JSON.parse(pkg);

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

				const contents = JSON.stringify(ret, undefined, indentation);
				return ctx.fs.writeFile('package.json', `${contents}${lastchar}`, 'utf8');
			});
	};
};

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
						fix: fix(ctx),
						file
					};
				}

				index++;
			}
		});
};
