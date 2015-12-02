'use strict';
module.exports = repository => {
	if (repository._tree.indexOf('.editorconfig') === -1) {
		return Promise.reject({
			name: 'editorconfig',
			severity: 'warn',
			message: 'Use `.editorconfig` to define and maintain consistent coding styles between editors'
		});
	}
};
