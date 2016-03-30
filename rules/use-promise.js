'use strict';
const occurrences = require('string-occurrence');

module.exports = function (ctx) {
	const readme = ctx.files.find(file => file.toLowerCase().indexOf('readme') === 0);

	if (!readme) {
		return;
	}

	return ctx.fs.readFile(readme).then(content => {
		const cbSamples = occurrences(content, ['callback', 'function (err', 'function(err']);
		const promiseSamples = occurrences(content, ['promise', '.then', '.catch']);

		if (cbSamples > promiseSamples) {
			throw new Error('Use promises instead of callbacks');
		}
	});
};
