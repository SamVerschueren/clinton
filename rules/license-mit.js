'use strict';
module.exports = ctx => {
	const license = ctx.files.find(file => file.toLowerCase().indexOf('license') === 0);

	if (!license) {
		return {
			message: 'No MIT license found.'
		};
	}

	return ctx.fs.readFile(license).then(content => {
		if (content.toLowerCase().indexOf('the mit license (mit)') === -1) {
			return {
				message: 'License is not MIT.'
			};
		}
	});
};
