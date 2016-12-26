import path from 'path';
import test from 'ava';
import {lint as m} from '../';
import {fix} from './fixtures/utils';

const opts = {
	cwd: 'test/fixtures/no-dup-keywords',
	inherit: false
};

test('no duplicates', async t => {
	t.deepEqual(await m('.', opts), []);
});

test('duplicate keywords', async t => {
	const file = path.resolve(opts.cwd, 'duplicates/package.json');

	t.deepEqual(fix(await m('duplicates', opts)), [
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
	]);
});
