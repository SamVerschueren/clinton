'use strict';
module.exports = function (ctx) {
	const license = ctx.files.find(file => file.toLowerCase().indexOf('lice') === 0);

	if (!license) {
		throw new Error('No license found.');
	}

	return ctx.fs.readFile(license).then(content => {
		if (content.toLowerCase().indexOf('the mit license (mit)') === -1) {
			throw new Error('No MIT license found.');
		}
	});
};
