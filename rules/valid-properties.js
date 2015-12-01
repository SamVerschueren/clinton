'use strict';
const got = require('got');
module.exports = repository => {
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

	return got(`https://raw.githubusercontent.com/${repository._fullName}/master/package.json`, {json: true}).then(res => {
		const result = [];

		props.forEach(el => {
			if (!res.body[el]) {
				result.push({
					name: `package-property-${el}`,
					severity: 'warn',
					message: `Missing recommended package.json property \`${el}\``
				});
			}
		});

		if (result.length > 0) {
			return Promise.reject(result);
		}
	});
};
