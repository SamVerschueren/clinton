'use strict';
const url = require('url');

module.exports = ctx => ctx.fs.readFile('package.json').then(pkg => {
	if (!pkg.repository) {
		return;
	}

	const isObject = typeof pkg.repository === 'object';
	const parsed = url.parse(isObject ? pkg.repository.url : pkg.repository);
	const shorthand = parsed.path.match(/^(?:\/)?(.*?)(?:\.git)?$/)[1];

	if (parsed.host === null || parsed.host.includes('github.com')) {
		if (isObject || parsed.path !== shorthand) {
			ctx.report({
				message: `Use the shorthand notation \`${shorthand}\` for the \`repository\` field.`,
				file: ctx.fs.resolve('package.json'),
				fix: pkg => {
					pkg.repository = shorthand;
					return pkg;
				}
			});
		}
	}
});
