'use strict';
module.exports = repository => {
	if (repository._tree.indexOf('LICENSE') >= 0 || repository._tree.indexOf('license') >= 0) {
		return Promise.resolve();
	}

	return Promise.reject({
		name: 'license',
		severity: 'warn',
		message: 'Make sure to add a `license` to your project'
	});
};
