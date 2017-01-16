'use strict';
const ZSchema = require('z-schema');
const CacheConf = require('cache-conf');

const cache = new CacheConf();

const SCHEMA_URL = 'http://json.schemastore.org/package';
const ONE_DAY = 86400000;

const getSchema = ctx => {
	const cachedSchema = cache.store['pkg-schema'] && cache.store['pkg-schema'].data;

	if (cachedSchema && !cache.isExpired('pkg-schema')) {
		return Promise.resolve(cachedSchema);
	}

	return ctx.got.get(SCHEMA_URL)
		.then(res => {
			const schema = JSON.parse(res.body);
			cache.set('pkg-schema', schema, {maxAge: ONE_DAY});
			return schema;
		})
		.catch(() => cachedSchema);
};

module.exports = ctx => {
	const validator = new ZSchema();
	const file = ctx.fs.resolve('package.json');

	return Promise.all([
		ctx.fs.readFile('package.json'),
		getSchema(ctx)
	]).then(res => {
		const pkg = res[0];
		const schema = res[1];

		const isValid = validator.validate(pkg, schema);

		if (!isValid) {
			for (const error of validator.getLastErrors()) {
				ctx.report({
					message: `${error.message} at path '${error.path}'`,
					file
				});
			}
		}
	}).catch(() => {});
};
