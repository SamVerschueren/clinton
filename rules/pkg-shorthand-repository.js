'use strict';
const url = require('url');
const detectIndent = require('detect-indent');

const fix = (ctx, shorthand) => {
	return () => ctx.fs.readFile('package.json', false)
		.then(pkg => {
			// Detect formatting options
			const indentation = detectIndent(pkg).indent;
			const lastchar = pkg.split('\n').pop().trim().length === 0 ? '\n' : '';

			pkg = JSON.parse(pkg);
			pkg.repository = shorthand;

			const contents = JSON.stringify(pkg, undefined, indentation);
			return ctx.fs.writeFile('package.json', `${contents}${lastchar}`, 'utf8');
		});
};

module.exports = ctx => ctx.fs.readFile('package.json').then(pkg => {
	if (!pkg.repository) {
		return;
	}

	const isObject = typeof pkg.repository === 'object';
	const parsed = url.parse(isObject ? pkg.repository.url : pkg.repository);
	const shorthand = parsed.path.match(/^(?:\/)?(.*?)(?:\.git)?$/)[1];

	if (parsed.host === null || parsed.host.includes('github.com')) {
		if (isObject || parsed.path !== shorthand) {
			return {
				message: `Use the shorthand notation \`${shorthand}\` for the \`repository\` field.`,
				file: ctx.fs.resolve('package.json'),
				fix: fix(ctx, shorthand)
			};
		}
	}
});
