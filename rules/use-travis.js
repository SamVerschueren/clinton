'use strict';
module.exports = ctx => {
	if (ctx.files.indexOf('.travis.yml') === -1) {
		return {
			message: 'Use travis to automatically run your tests.'
		};
	}
};
