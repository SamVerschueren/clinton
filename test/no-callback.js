import test from 'ava';
import {lint as m} from '../';

const opts = {
	cwd: 'fixtures/no-callback',
	inherit: false
};

test('callback', async t => {
	t.deepEqual(await m('cb', opts), [
		{
			ruleId: 'no-callback',
			severity: 'error',
			message: 'Use promises instead of callbacks'
		}
	]);
});

test('promises', async t => {
	t.is((await m('promises', opts)).length, 0);
});
