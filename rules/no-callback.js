'use strict';
const occurrences = require('string-occurrence');

module.exports = ctx => {
	const readme = ctx.files.find(file => file.toLowerCase().indexOf('readme') === 0);

	if (!readme) {
		return;
	}

	return ctx.fs.readFile(readme).then(content => {
		const cbSamples = occurrences(content, ['callback', 'callbacks', 'function (err', 'function(err']);
		const promiseSamples = occurrences(content, ['promise', 'promises', '.then', '.catch']);

		if (cbSamples > promiseSamples) {
			return {
				message: 'Use promises instead of callbacks'
			};
		}
	});
};
