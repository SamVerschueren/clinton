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

	return ctx.fs.readFile('package.json').then(pkg => {
		const errors = [];

		props.forEach(el => {
			if (!pkg[el]) {
				errors.push({
					message: `Missing recommended package.json property \`${el}\``
				});
			}
		});

		return errors;
	});
};
