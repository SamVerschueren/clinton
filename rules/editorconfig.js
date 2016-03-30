'use strict';
module.exports = function (ctx) {
	if (ctx.files.indexOf('.editorconfig') === -1) {
		throw new Error('Use `.editorconfig` to define and maintain consistent coding styles between editors');
	}
};
