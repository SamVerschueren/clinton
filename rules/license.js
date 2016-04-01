'use strict';
module.exports = function (ctx) {
	if (!ctx.files.some(file => file.toLowerCase().indexOf('license') === 0)) {
		throw new Error('Missing `license` file');
	}
};
