'use strict';
module.exports = (repository, options, pkg) => {
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

	if (result.length > 0) {
		return Promise.reject(result);
	}
};

module.exports._dependencies = ['pkg-loader'];
