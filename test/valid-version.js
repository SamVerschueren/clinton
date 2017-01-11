import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/valid-version',
	rules: {
		'valid-version': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('valid version', async t => {
	await ruleTester(t, '.', []);
});

test('invalid version', async t => {
	await ruleTester(t, 'invalid-version',
		[
			{
				ruleId: 'valid-version',
				severity: 'error',
				message: 'The specified `version` in package.json is invalid.',
				file: path.resolve(opts.cwd, 'invalid-version/package.json')
			}
		]
	);
});

