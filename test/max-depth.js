import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/max-depth',
	rules: {
		'max-depth': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('max depth', async t => {
	await ruleTester(t, '.', []);
});

test('max depth fail', async t => {
	const ruleTester = clintonRuleTester(Object.assign({}, opts, {rules: {'max-depth': ['error', 1]}}));

	await ruleTester(t, '.',
		[
			{
				ruleId: 'max-depth',
				severity: 'error',
				message: 'Directories are nested too deeply (2).'
			}
		]
	);
});

test('max depth is not a number', t => {
	const ruleTester = clintonRuleTester(Object.assign({}, opts, {rules: {'max-depth': ['error', '5']}}));

	t.throws(ruleTester(t, '.'), 'Expected `max-depth` to be of type `number`, got `string`');
});
