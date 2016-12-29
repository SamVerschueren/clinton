'use strict';
const detectIndent = require('detect-indent');

const fixDescription = x => {
	x = x.slice(0, 1).toUpperCase() + x.slice(1);

	while (x[x.length - 1] === '.') {
		x = x.slice(x, x.length - 1);
	}

	return x;
};

const fix = ctx => {
	return () => ctx.fs.readFile('package.json', false)
		.then(pkg => {
			// Detect formatting options
			const indentation = detectIndent(pkg).indent;
			const lastchar = pkg.split('\n').pop().trim().length === 0 ? '\n' : '';

			pkg = JSON.parse(pkg);
			pkg.description = fixDescription(pkg.description);

			const contents = JSON.stringify(pkg, undefined, indentation);
			return ctx.fs.writeFile('package.json', `${contents}${lastchar}`, 'utf8');
		});
};

module.exports = ctx => {
	const pkg = ctx.env.pkg;
	const file = ctx.fs.resolve('package.json');

	if (!pkg.description) {
		return;
	}

	if (pkg.description[0] !== pkg.description[0].toUpperCase()) {
		ctx.report({
			message: 'Package `description` should start with a capital letter',
			file,
			fix: fix(ctx)
		});
	}

	if (/\.$/.test(pkg.description)) {
		ctx.report({
			message: 'Package `description` should not end with a dot',
			file,
			fix: fix(ctx)
		});
	}
};
