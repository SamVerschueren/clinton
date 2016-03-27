'use strict';
module.exports = function (ctx) {
	if (ctx.files.indexOf('.travis.yml') === -1) {
		return Promise.reject({
			name: 'use-travis',
			severity: 'warn',
			message: 'Use travis to automatically run your tests.'
		});
	}
};
