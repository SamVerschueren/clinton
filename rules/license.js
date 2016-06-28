'use strict';
const spdxLicenseList = require('spdx-license-list/spdx-full');
const FuzzyMatching = require('fuzzy-matching');

const normalize = str => str.replace(/\n/g, ' ').replace(/[ ]{2,}/g, ' ');

module.exports = ctx => {
	const pkg = ctx.env.pkg;
	const isPrivate = pkg.private;
	const fileName = ctx.files.find(file => file.toLowerCase().indexOf('license') === 0);
	const file = ctx.fs.resolve(fileName || 'license');

	if (isPrivate && !fileName) {
		// Exit if the project is `private` and no `filename` is provided
		return;
	}

	if (!fileName) {
		return {
			message: 'No license found.',
			file
		};
	}

	if (!pkg.license) {
		return {
			message: 'No `license` property defined in `package.json.',
			file
		};
	}

	if (ctx.options.length === 0) {
		// No license type provided, no need to check the license contents
		return;
	}

	const type = ctx.options[0];
	const licenseInfo = spdxLicenseList[type];

	if (pkg.license !== type) {
		return {
			message: `Expected \`license\` property to be \`${type}\`, got \`${pkg.license}\`.`,
			file
		};
	}

	if (!licenseInfo) {
		return {
			message: `License ${type} is unknown.`,
			file
		};
	}

	const matcher = new FuzzyMatching([normalize(licenseInfo.license)]);

	return ctx.fs.readFile(fileName).then(content => {
		const match = matcher.get(normalize(content));

		if (match.distance < 0.9) {
			return {
				message: `License is not of type ${type} (${licenseInfo.url.split('\n')[0]}).`,
				file
			};
		}
	});
};
