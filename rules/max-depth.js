'use strict';
module.exports = ctx => {
	const allowedDepth = ctx.options[0] || 5;

	if (typeof allowedDepth !== 'number') {
		throw new TypeError(`Expected \`max-depth\` to be of type \`number\`, got \`${typeof allowedDepth}\``);
	}

	let maxDepth = 0;

	ctx.files.forEach(file => {
		maxDepth = Math.max(maxDepth, file.split('/').length);
	});

	if (maxDepth > allowedDepth) {
		ctx.report({
			message: `Directories are nested too deeply (${maxDepth}).`
		});
	}
};
