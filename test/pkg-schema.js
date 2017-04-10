import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/pkg-schema',
	rules: {
		'pkg-schema': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('missing required version property', async t => {
	await ruleTester(t, '.',
		[
			{
				message: 'Missing required property: version at path \'#/\'',
				file: path.resolve(opts.cwd, 'package.json'),
				ruleId: 'pkg-schema',
				severity: 'error'
			}
		]
	);
});

test('fails on incorrect options object', async t => {
	const ruleTester = clintonRuleTester(Object.assign({}, opts, {rules: {'pkg-schema': ['error', 'foo']}}));

	await t.throws(ruleTester(t, '.'), 'Expected options to be of type `object`, got `string`');
});
