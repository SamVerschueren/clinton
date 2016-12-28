'use strict';
const detectIndent = require('detect-indent');

const DEFAULT_ORDER = [
	'name',
	'email',
	'url'
];

const FIELDS = [
	'author',
	'maintainers',
	'contributors'
];

const fixUser = (user, order) => {
	const ret = Object.create(null);

	for (const key of order) {
		ret[key] = user[key];
	}

	return ret;
};

const fix = (ctx, field) => {
	return () => {
		const order = ctx.options.length > 0 ? ctx.options : DEFAULT_ORDER;

		return ctx.fs.readFile('package.json', false)
			.then(pkg => {
				// Detect formatting options
				const indentation = detectIndent(pkg).indent;
				const lastchar = pkg.split('\n').pop().trim().length === 0 ? '\n' : '';

				pkg = JSON.parse(pkg);

				if (Array.isArray(pkg[field])) {
					pkg[field] = pkg[field].map(user => fixUser(user, order));
				} else {
					pkg[field] = fixUser(pkg[field], order);
				}

				const contents = JSON.stringify(pkg, undefined, indentation);
				return ctx.fs.writeFile('package.json', `${contents}${lastchar}`, 'utf8');
			});
	};
};

const checkOrder = (ctx, pkg, order) => {
	const file = ctx.fs.resolve('package.json');

	for (const field of FIELDS) {
		const isArray = Array.isArray(pkg[field]);
		const users = isArray || !pkg[field] ? pkg[field] || [] : [pkg[field]];

		users.forEach((user, ci) => {
			const userKeys = Object.keys(user);
			const keyOrder = order.filter(x => userKeys.indexOf(x) !== -1);

			let i = 0;

			while (keyOrder[i] === userKeys[i] && i < keyOrder.length) {
				i++;
			}

			if (i < keyOrder.length) {
				const index = isArray ? `[${ci}]` : '';

				ctx.report({
					message: `Property \`${field}${index}.${keyOrder[i]}\` should occur before property \`${field}${index}.${userKeys[i]}\`.`,
					file,
					fix: fix(ctx, field)
				});
			}
		});
	}
};

module.exports = ctx => {
	const order = ctx.options.length > 0 ? ctx.options : DEFAULT_ORDER;

	return ctx.fs.readFile('package.json')
		.then(pkg => checkOrder(ctx, pkg, order));
};
