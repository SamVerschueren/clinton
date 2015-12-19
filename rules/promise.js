'use strict';
const occurrences = require('string-occurrence');
const loadFile = require('../utils/load-file');
module.exports = repository => {
	const readme = repository._tree.find(file => file.toLowerCase().indexOf('readme') === 0);

	return loadFile(repository, readme).then(document => {
		const cbSamples = occurrences(document, ['callback', 'function (err', 'function(err']);
		const promiseSamples = occurrences(document, ['promise', '.then', '.catch']);

		if (cbSamples > promiseSamples) {
			return Promise.reject({
				name: 'use-promise',
				severity: 'warn',
				message: 'Use promises instead of callbacks'
			});
		}
	});
};
