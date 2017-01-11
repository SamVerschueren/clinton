'use strict';
const fix = keyword => {
	return pkg => {
		const keywords = [];
		let found = false;

		for (const key of pkg.keywords) {
			if (key !== keyword || !found) {
				keywords.push(key);
			}

			found = found || key === keyword;
		}

		pkg.keywords = keywords;

		return pkg;
	};
};

module.exports = ctx => {
	const pkg = ctx.env.pkg;
	const file = ctx.fs.resolve('package.json');

	if (!pkg.keywords) {
		return;
	}

	const keywordMap = {};

	for (const keyword of pkg.keywords) {
		if (!keywordMap[keyword]) {
			keywordMap[keyword] = 0;
		}

		keywordMap[keyword]++;
	}

	for (const keyword of Object.keys(keywordMap)) {
		if (keywordMap[keyword] > 1) {
			ctx.report({
				message: `No duplicate keywords. Found \`${keyword}\` ${keywordMap[keyword]} times.`,
				file,
				fix: fix(keyword)
			});
		}
	}
};
