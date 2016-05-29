import test from 'ava';
import m from '../';

const cwd = 'fixtures/license';

test('license', async t => {
	t.is((await m('mit', {cwd})).length, 0);
	t.is((await m('isc', {cwd})).length, 0);
});

test('wrong license', async t => {
	t.deepEqual(await m('wrong', {cwd}), [
		{
			name: 'license',
			severity: 'error',
			message: 'License is not of type MIT (http://www.opensource.org/licenses/MIT).'
		}
	]);
});

test('unknown license', async t => {
	t.deepEqual(await m('unknown', {cwd}), [
		{
			name: 'license',
			severity: 'error',
			message: 'License FOO is unknown.'
		}
	]);
});

test('no license', async t => {
	t.deepEqual(await m('no-license', {cwd}), [
		{
			name: 'license',
			severity: 'error',
			message: 'No license found.'
		}
	]);
});
