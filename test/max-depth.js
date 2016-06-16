import test from 'ava';
import m from '../';
import utils from './fixtures/utils';

const opts = {
	cwd: 'fixtures/max-depth',
	inherit: false
};

const inherit = utils.assign(opts);

test('max depth fail', async t => {
	t.deepEqual(await m('.', inherit({rules: {'max-depth': ['error', 1]}})), [
		{
			name: 'max-depth',
			severity: 'error',
			message: 'Directories are nested too deeply (2).'
		}
	]);
});

test('max depth', async t => {
	t.is((await m('.', opts)).length, 0);
});
