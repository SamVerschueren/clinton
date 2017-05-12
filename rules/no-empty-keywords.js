'use strict';
const fix = pkg => {
	const keywords = [];

	for (const key of pkg.keywords) {
		if (key !== '') {
			keywords.push(key);
		}
	}

	pkg.keywords = keywords;

	return pkg;
};

module.exports = ctx => {
	const pkg = ctx.env.pkg;
	const file = ctx.fs.resolve('package.json');

	if (!pkg.keywords) {
		return;
	}

	let emptyKeywords = 0;

	for (const keyword of pkg.keywords) {
		if (keyword === '') {
			emptyKeywords++;
		}
	}

	if (emptyKeywords > 0) {
		ctx.report({
			message: `No empty keywords`,
			file,
			fix
		});
	}
};
