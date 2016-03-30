'use strict';
module.exports = function (ctx) {
	if (!ctx.files.some(file => file.toLowerCase().indexOf('readme') === 0)) {
		throw new Error('Missing readme file');
	}
};
