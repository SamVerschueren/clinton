'use strict';
module.exports = repository => {
	if (!repository._tree.some(file => file.toLowerCase().indexOf('readme') === 0)) {
		return Promise.reject({
			name: 'no-readme',
			severity: 'error',
			message: 'Missing readme file'
		});
	}
};
