import path from 'path';
import test from 'ava';
import {lint as m} from '../';

const opts = {
	cwd: 'test/fixtures/no-git-merge-conflict',
	inherit: false
};

const createError = file => ({
	message: 'Resolve all Git merge conflicts.',
	file: path.resolve(opts.cwd, file),
	ruleId: 'no-git-merge-conflict',
	severity: 'error'
});

test(async t => {
	t.deepEqual(await m('.', opts), [
		createError('bar.txt'),
		createError('rainbow.txt'),
		createError('test.txt'),
		createError('unicorn.txt')
	]);
});
