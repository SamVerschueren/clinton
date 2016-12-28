'use strict';
const detectIndent = require('detect-indent');

const fix = (ctx, keyword) => {
	return () => {
		return ctx.fs.readFile('package.json', false)
			.then(pkg => {
				// Detect formatting options
				const indentation = detectIndent(pkg).indent;
				const lastchar = pkg.split('\n').pop().trim().length === 0 ? '\n' : '';

				pkg = JSON.parse(pkg);

				const keywords = [];
				let found = false;

				for (const key of pkg.keywords) {
					if (key !== keyword || !found) {
						keywords.push(key);
					}

					found = found || key === keyword;
				}

				pkg.keywords = keywords;

				const contents = JSON.stringify(pkg, undefined, indentation);
				return ctx.fs.writeFile('package.json', `${contents}${lastchar}`, 'utf8');
			});
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
				fix: fix(ctx, keyword)
			});
		}
	}
};
