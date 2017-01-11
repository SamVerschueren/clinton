import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/license'
};

const ruleTester = clintonRuleTester(opts);

test('license', async t => {
	await ruleTester(t, 'mit', []);
	await ruleTester(t, 'isc', []);
});

test('license property does not match', async t => {
	const ruleTester = clintonRuleTester(Object.assign({}, opts, {rules: {license: ['error', 'ISC']}}));

	await ruleTester(t, 'wrong',
		[
			{
				ruleId: 'license',
				severity: 'error',
				message: 'Expected `license` property to be `ISC`, got `MIT`.',
				file: path.resolve(opts.cwd, 'wrong/license')
			}
		]
	);
});

test('wrong license', async t => {
	await ruleTester(t, 'wrong',
		[
			{
				ruleId: 'license',
				severity: 'error',
				message: 'License is not of type MIT (http://www.opensource.org/licenses/MIT).',
				file: path.resolve(opts.cwd, 'wrong/license')
			}
		]
	);
});

test('unknown license', async t => {
	await ruleTester(t, 'unknown',
		[
			{
				ruleId: 'license',
				severity: 'error',
				message: 'License FOO is unknown.',
				file: path.resolve(opts.cwd, 'unknown/license')
			}
		]
	);
});

test('no license', async t => {
	await ruleTester(t, 'no-license',
		[
			{
				ruleId: 'license',
				severity: 'error',
				message: 'No license found.',
				file: path.resolve(opts.cwd, 'no-license/license')
			}
		]
	);
});

test('no license with private package', async t => {
	await ruleTester(t, 'private', []);
});

test('license with private package', async t => {
	await ruleTester(t, 'private-license',
		[
			{
				ruleId: 'license',
				severity: 'error',
				message: 'License is not of type MIT (http://www.opensource.org/licenses/MIT).',
				file: path.resolve(opts.cwd, 'private-license/license')
			}
		]
	);
});
