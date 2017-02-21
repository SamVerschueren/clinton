'use strict';
const fix = prop => {
	return pkg => {
		const ret = {};
		ret[prop] = Object.create(null);

		const deps = pkg[prop] || {};
		const orderedDeps = Object.keys(deps).sort();

		for (const dep of orderedDeps) {
			ret[prop][dep] = deps[dep];
		}

		return Object.assign(pkg, ret);
	};
};

const checkOrder = input => {
	const keys = Object.keys(input);
	const orderedKeys = Object.keys(input).sort();

	for (let i = 0; i < keys.length; i++) {
		if (keys[i] !== orderedKeys[i]) {
			return [orderedKeys[i], keys[i]];
		}
	}
};

module.exports = ctx => {
	const file = ctx.fs.resolve('package.json');

	return ctx.fs.readFile('package.json')
		.then(pkg => {
			const deps = checkOrder(pkg.dependencies || {});
			const devDeps = checkOrder(pkg.devDependencies || {});

			if (deps) {
				ctx.report({
					message: `Dependency \`${deps[0]}\` should occur before \`${deps[1]}\`.`,
					fix: fix('dependencies'),
					file
				});
			}

			if (devDeps) {
				ctx.report({
					message: `Dev dependency \`${devDeps[0]}\` should occur before \`${devDeps[1]}\`.`,
					fix: fix('devDependencies'),
					file
				});
			}
		});
};
