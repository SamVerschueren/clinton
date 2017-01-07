import path from 'path';
import test from 'ava';
import {lint as m} from '../';
import {fix} from './fixtures/utils';

const opts = {
	cwd: 'test/fixtures/gitignore',
	inherit: false
};

test('valid .gitignore', async t => {
	t.deepEqual(await m('.', opts), []);
});

test('no .gitignore found', async t => {
	const file = path.resolve(opts.cwd, 'no-gitignore/.gitignore');

	t.deepEqual(fix(await m('no-gitignore', opts)), [
		{
			ruleId: 'gitignore',
			severity: 'error',
			message: 'No `.gitignore` file found. Add it to the root of your project.',
			file
		}
	]);
});

test('`node_modules` not ignored', async t => {
	const file = path.resolve(opts.cwd, 'no-modules/.gitignore');

	t.deepEqual(fix(await m('no-modules', opts)), [
		{
			ruleId: 'gitignore',
			severity: 'error',
			message: '`node_modules` is not being ignored. Add it to `.gitignore`.',
			file
		}
	]);
});
