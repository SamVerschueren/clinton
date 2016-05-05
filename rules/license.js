'use strict';
module.exports = ctx => {
	if (!ctx.files.some(file => file.toLowerCase().indexOf('license') === 0)) {
		return {
			message: 'Missing `license` file'
		};
	}
};
