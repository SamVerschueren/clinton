'use strict';
module.exports = function (ctx) {
	if (ctx.files.indexOf('.travis.yml') === -1) {
		throw new Error('Use travis to automatically run your tests.');
	}
};
