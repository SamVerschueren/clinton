'use strict';
module.exports = ctx => {
	const allowedDepth = ctx.options[0] || 5;

	if (typeof allowedDepth !== 'number') {
		throw new TypeError('Expected a maximum allowed depth for rule `max-depth`');
	}

	let maxDepth = 0;

	ctx.files.forEach(file => {
		maxDepth = Math.max(maxDepth, file.split('/').length);
	});

	if (maxDepth > allowedDepth) {
		return {
			message: `Directories are nested too deeply (${maxDepth}).`
		};
	}
};
