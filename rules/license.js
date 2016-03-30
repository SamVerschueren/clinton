'use strict';
module.exports = function (ctx) {
	if (!ctx.files.some(file => file.toLowerCase().indexOf('license') === 0)) {
		throw new Error('Make sure to add a `license` to your project');
	}
};
