import test from 'ava';
import m from '../';

const cwd = 'fixtures/license';

test('mit', async t => {
	t.is((await m('mit', {cwd})).length, 0);
});

test('wrong license', async t => {
	t.deepEqual(await m('isc', {cwd}), [
		{
			name: 'license-mit',
			severity: 'error',
			message: 'License is not MIT.'
		}
	]);
});

test('no license', async t => {
	t.deepEqual(await m('no-license', {cwd}), [
		{
			name: 'license',
			severity: 'error',
			message: 'Missing `license` file'
		}
	]);
});
