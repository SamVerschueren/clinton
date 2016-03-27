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

	return ctx.readFile('package.json').then(pkg => {
		const result = [];

		props.forEach(el => {
			if (!pkg[el]) {
				result.push({
					name: `package-property-${el}`,
					severity: 'warn',
					message: `Missing recommended package.json property \`${el}\``
				});
			}
		});

		return Promise.reject(result);
	});
};
