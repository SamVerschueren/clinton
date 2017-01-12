import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/test-script',
	rules: {
		'test-script': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

const error = {
	ruleId: 'test-script',
	message: 'The package is untested.',
	severity: 'error'
};

test('no error', async t => {
	await ruleTester(t, '.', []);
});

test('no script', async t => {
	await ruleTester(t, '..', []);
});

test('no test script specified', async t => {
	await ruleTester(t, 'no-test-script',
		[
			error
		]
	);
});

test('empty test script specified', async t => {
	await ruleTester(t, 'empty-test-script',
		[
			error
		]
	);
});

test('`no test specified` error', async t => {
	await ruleTester(t, 'no-test-string',
		[
			error
		]
	);
});
