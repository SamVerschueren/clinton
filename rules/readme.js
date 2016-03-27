'use strict';
module.exports = function (ctx) {
	if (!ctx.files.some(file => file.toLowerCase().indexOf('readme') === 0)) {
		return Promise.reject({
			name: 'no-readme',
			severity: 'error',
			message: 'Missing readme file'
		});
	}
};
