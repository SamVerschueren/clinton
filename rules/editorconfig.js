'use strict';
module.exports = function (ctx) {
	if (ctx.files.indexOf('.editorconfig') === -1) {
		return Promise.reject({
			name: 'editorconfig',
			severity: 'warn',
			message: 'Use `.editorconfig` to define and maintain consistent coding styles between editors'
		});
	}
};
