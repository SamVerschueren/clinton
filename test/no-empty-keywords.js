import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/no-empty-keywords',
	rules: {
		'no-empty-keywords': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('no empty keywords', async t => {
	await ruleTester(t, '.', []);
});

test('no keywords', async t => {
	await ruleTester(t, '..', []);
});

test('duplicate keywords', async t => {
	const file = path.resolve(opts.cwd, 'empty/package.json');

	await ruleTester(t, 'empty',
		[
			{
				ruleId: 'no-empty-keywords',
				severity: 'error',
				message: 'No empty keywords',
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
			}
		]
	);
});
