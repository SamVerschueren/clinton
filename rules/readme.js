'use strict';
module.exports = ctx => {
	if (!ctx.files.some(file => file.toLowerCase().indexOf('readme') === 0)) {
		return {
			message: 'Missing readme file'
		};
	}
};
