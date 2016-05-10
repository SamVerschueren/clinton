import test from 'ava';
import m from '../';

const cwd = 'fixtures/no-callback';

test('callback', async t => {
	t.deepEqual(await m('cb', {cwd}), [
		{
			name: 'no-callback',
			severity: 'error',
			message: 'Use promises instead of callbacks'
		}
	]);
});

test('promises', async t => {
	t.is((await m('promises', {cwd})).length, 0);
});
