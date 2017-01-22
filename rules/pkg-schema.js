'use strict';
const ZSchema = require('z-schema');
const CacheConf = require('cache-conf');

const cache = new CacheConf();

const SCHEMA_URL = 'http://json.schemastore.org/package';
const SEVEN_DAYS = 86400000 * 7;

const getSchema = (ctx, options) => {
	const cachedSchema = cache.get('pkg-schema', {ignoreMaxAge: true});

	if (cachedSchema && !cache.isExpired('pkg-schema')) {
		return Promise.resolve(cachedSchema);
	}

	return ctx.got.get(SCHEMA_URL)
		.then(res => {
			const schema = JSON.parse(res.body);
			cache.set('pkg-schema', schema, options);
			return schema;
		})
		.catch(() => cachedSchema);
};

module.exports = ctx => {
	const opts = ctx.options[0];

	if (opts !== undefined && typeof opts !== 'object') {
		throw new TypeError(`Expected options to be of type \`object\`, got \`${typeof opts}\``);
	}

	const validator = new ZSchema();
	const file = ctx.fs.resolve('package.json');
	const options = Object.assign({maxAge: SEVEN_DAYS}, opts);

	return Promise.all([
		ctx.fs.readFile('package.json'),
		getSchema(ctx, options)
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
