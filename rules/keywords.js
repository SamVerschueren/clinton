module.exports = ctx => {
	const pkg = ctx.env.pkg;
	const file = ctx.fs.resolve('package.json');

	if (!pkg.keywords || pkg.keywords.length === 0) {
		ctx.report({
			message: 'Provide useful keywords',
			file
		});
	}
};
