'use strict';
const occurrences = require('string-occurrence');

module.exports = function (ctx) {
	const readme = ctx.files.find(file => file.toLowerCase().indexOf('readme') === 0);

	return ctx.readFile(readme).then(content => {
		const cbSamples = occurrences(content, ['callback', 'function (err', 'function(err']);
		const promiseSamples = occurrences(content, ['promise', '.then', '.catch']);

		if (cbSamples > promiseSamples) {
			return Promise.reject({
				name: 'use-promise',
				severity: 'warn',
				message: 'Use promises instead of callbacks'
			});
		}
	});
};
