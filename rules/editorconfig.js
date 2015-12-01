'use strict';
module.exports = repository => {
	if (repository._tree.indexOf('.editorconfig') >= 0) {
		return Promise.resolve();
	}

	return Promise.reject({
		name: 'editorconfig',
		severity: 'warn',
		message: 'Use `.editorconfig` to define and maintain consistent coding styles between editors'
	});
};
