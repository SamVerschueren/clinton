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
		ctx.report({
			message: 'No license found.',
			file
		});
		return;
	}

	if (!pkg.license) {
		ctx.report({
			message: 'No `license` property defined in `package.json.',
			file
		});
		return;
	}

	if (ctx.options.length === 0) {
		// No license type provided, no need to check the license contents
		return;
	}

	const type = ctx.options[0];
	const licenseInfo = spdxLicenseList[type];

	if (pkg.license !== type) {
		ctx.report({
			message: `Expected \`license\` property to be \`${type}\`, got \`${pkg.license}\`.`,
			file
		});
		return;
	}

	if (!licenseInfo) {
		ctx.report({
			message: `License ${type} is unknown.`,
			file
		});
		return;
	}

	const matcher = new FuzzyMatching([normalize(licenseInfo.license)]);

	return ctx.fs.readFile(fileName).then(content => {
		const match = matcher.get(normalize(content));

		if (match.distance < 0.9) {
			ctx.report({
				message: `License is not of type ${type} (${licenseInfo.url.split('\n')[0]}).`,
				file
			});
		}
	});
};
