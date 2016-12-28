'use strict';
module.exports = ctx => {
	const props = [
		'name',
		'version',
		'description',
		'keywords',
		'author',
		'main',
		'files',
		'repository',
		'engines'
	];

	const file = ctx.fs.resolve('package.json');

	return ctx.fs.readFile('package.json').then(pkg => {
		for (const prop of props) {
			if (!pkg[prop]) {
				ctx.report({
					message: `Missing recommended package.json property \`${prop}\``,
					file
				});
			}
		}
	});
};
