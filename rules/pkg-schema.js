'use strict';
const ZSchema = require('z-schema');

module.exports = ctx => {
	const validator = new ZSchema();

	return Promise.all([
		ctx.fs.readFile('package.json'),
		ctx.got.get('http://json.schemastore.org/package')
	]).then(res => {
		const pkg = res[0];
		const schema = JSON.parse(res[1].body);

		const isValid = validator.validate(pkg, schema);

		if (!isValid) {
			return validator.getLastErrors().map(err => ({message: `${err.message} at path '${err.path}'`}));
		}
	});
};
