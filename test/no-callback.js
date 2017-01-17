import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/no-callback',
	rules: {
		'no-callback': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('no readme', async t => {
	await ruleTester(t, '..', []);
});

test('callback', async t => {
	await ruleTester(t, 'cb',
		[
			{
				ruleId: 'no-callback',
				severity: 'error',
				message: 'Use promises instead of callbacks'
			}
		]
	);
});

test('promises', async t => {
	await ruleTester(t, 'promises', []);
});
