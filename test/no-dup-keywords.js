import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/no-dup-keywords',
	rules: {
		'no-dup-keywords': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('no duplicates', async t => {
	await ruleTester(t, '.', []);
});

test('no keywords', async t => {
	await ruleTester(t, '..', []);
});

test('duplicate keywords', async t => {
	const file = path.resolve(opts.cwd, 'duplicates/package.json');

	await ruleTester(t, 'duplicates',
		[
			{
				ruleId: 'no-dup-keywords',
				severity: 'error',
				message: 'No duplicate keywords. Found `foo` 3 times.',
				file
			},
			{
				ruleId: 'no-dup-keywords',
				severity: 'error',
				message: 'No duplicate keywords. Found `bar` 2 times.',
				file
			}
		],
		[
			{
				name: 'package',
				keywords: [
					'foo',
					'bar',
					'unicorn',
					'rainbow',
					'bar'
				]
			},
			{
				name: 'package',
				keywords: [
					'foo',
					'bar',
					'foo',
					'unicorn',
					'rainbow',
					'foo'
				]
			}
		]
	);
});
