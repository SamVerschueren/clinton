'use strict';
module.exports = function (ctx) {
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
				errors.push(new Error(`Missing recommended package.json property \`${el}\``));
			}
		});

		return Promise.reject(errors);
	});
};
