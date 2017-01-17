import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/pkg-main',
	rules: {
		'pkg-main': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('valid main', async t => {
	await ruleTester(t, '.', []);
});

test('no main', async t => {
	await ruleTester(t, '..', []);
});

test('invalid main', async t => {
	await ruleTester(t, 'invalid-main',
		[
			{
				ruleId: 'pkg-main',
				severity: 'error',
				message: 'Main file \'index.js\' does not exist.',
				file: path.resolve(opts.cwd, 'invalid-main/package.json')
			}
		]
	);
});
