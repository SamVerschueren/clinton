'use strict';
module.exports = ctx => {
	if (ctx.files.indexOf('.travis.yml') === -1) {
		ctx.report({
			message: 'Use travis to automatically run your tests.'
		});
	}
};
