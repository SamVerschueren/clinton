'use strict';
module.exports = ctx => {
	if (ctx.files.indexOf('.editorconfig') === -1) {
		return {
			message: 'Use `.editorconfig` to define and maintain consistent coding styles between editors'
		};
	}
};
