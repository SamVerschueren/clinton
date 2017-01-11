import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/no-git-merge-conflict',
	rules: {
		'no-git-merge-conflict': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

const createError = file => ({
	message: 'Resolve all Git merge conflicts.',
	file: path.resolve(opts.cwd, file),
	ruleId: 'no-git-merge-conflict',
	severity: 'error'
});

test(async t => {
	const result = await ruleTester(t, '.');
	result.sort((a, b) => a.file.localeCompare(b.file));

	t.deepEqual(result, [
		createError('bar.txt'),
		createError('rainbow.txt'),
		createError('test.txt'),
		createError('unicorn.txt')
	]);
});
