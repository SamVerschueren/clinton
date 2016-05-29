'use strict';
const escapeStringRegexp = require('escape-string-regexp');
const spdxLicenseList = require('spdx-license-list/spdx-full');

const normalize = str => str.replace(/\n/g, ' ').replace(/[ ]{2,}/g, ' ');

module.exports = ctx => {
	const fileName = ctx.files.find(file => file.toLowerCase().indexOf('license') === 0);

	if (!fileName) {
		return {
			message: 'No license found.'
		};
	}

	if (ctx.options.length === 0) {
		// No license type provided, no need to check the license contents
		return;
	}

	const type = ctx.options[0];
	const licenseInfo = spdxLicenseList[type];

	if (!licenseInfo) {
		return {
			message: `License ${type} is unknown.`
		};
	}

	let license = escapeStringRegexp(licenseInfo.license);
	license = license.replace(/>.*?</g, '');
	license = license.replace(/<.*?>/g, '.*?');

	const regexp = new RegExp(normalize(license), 'm');

	return ctx.fs.readFile(fileName).then(content => {
		const isValid = regexp.test(normalize(content));

		if (!isValid) {
			return {
				message: `License is not of type ${type} (${licenseInfo.url.split('\n')[0]}).`
			};
		}
	});
};
