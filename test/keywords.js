import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/keywords',
	rules: {
		keywords: 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('has keywords', async t => {
	await ruleTester(t, '.', []);
});

test('no keywords', async t => {
	const file = path.resolve(opts.cwd, '../package.json');

	await ruleTester(t, '..', [
		{
			ruleId: 'keywords',
			severity: 'error',
			message: 'Provide useful keywords',
			file
		}
	]);
});

test('empty list', async t => {
	const file = path.resolve(opts.cwd, 'empty-list/package.json');

	await ruleTester(t, 'empty-list', [
		{
			ruleId: 'keywords',
			severity: 'error',
			message: 'Provide useful keywords',
			file
		}
	]);
});
