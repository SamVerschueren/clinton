'use strict';
const fix = pkg => {
	let description = pkg.description;
	description = description.slice(0, 1).toUpperCase() + description.slice(1);

	while (description[description.length - 1] === '.') {
		description = description.slice(description, description.length - 1);
	}

	pkg.description = description;

	return pkg;
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
			fix
		});
	}

	if (/\.$/.test(pkg.description)) {
		ctx.report({
			message: 'Package `description` should not end with a dot',
			file,
			fix
		});
	}
};
