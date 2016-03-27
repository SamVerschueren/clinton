'use strict';
module.exports = function (ctx) {
	if (!ctx.files.some(file => file.toLowerCase().indexOf('license') === 0)) {
		return Promise.reject({
			name: 'license',
			severity: 'warn',
			message: 'Make sure to add a `license` to your project'
		});
	}
};
