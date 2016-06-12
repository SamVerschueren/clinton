import test from 'ava';
import m from '../';

const cwd = 'fixtures/max-depth';

test('max depth fail', async t => {
	t.deepEqual(await m('.', {cwd, rules: {'max-depth': ['error', 1]}}), [
		{
			name: 'max-depth',
			severity: 'error',
			message: 'Directories are nested too deeply (2).'
		}
	]);
});

test('max depth', async t => {
	t.is((await m('.', {cwd})).length, 0);
});
