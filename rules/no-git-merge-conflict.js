'use strict';
const REGEXPS = [
	/^<<<<<<< [\w/]+$/m,
	/^=======$/m,
	/^>>>>>>> [\w/]+$/m
];

const checkMergeConflict = (ctx, file) => {
	return ctx.fs.readFile(file, false)
		.then(contents => {
			for (const regexp of REGEXPS) {
				if (regexp.test(contents)) {
					ctx.report({
						message: 'Resolve all Git merge conflicts.',
						file: ctx.fs.resolve(file)
					});
					return;
				}
			}
		})
		.catch(err => {
			if (err.code === 'EISDIR') {
				return;
			}

			throw err;
		});
};

module.exports = ctx => {
	const promises = [];

	for (const file of ctx.files) {
		promises.push(checkMergeConflict(ctx, file));
	}

	return Promise.all(promises);
};
