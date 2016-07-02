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
		const errors = [];

		props.forEach(el => {
			if (!pkg[el]) {
				errors.push({
					message: `Missing recommended package.json property \`${el}\``,
					file
				});
			}
		});

		return errors;
	});
};
