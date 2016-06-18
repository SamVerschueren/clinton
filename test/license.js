import test from 'ava';
import m from '../';

const opts = {
	cwd: 'fixtures/license',
	inherit: false
};

test('license', async t => {
	t.is((await m('mit', opts)).length, 0);
	t.is((await m('isc', opts)).length, 0);
});

test('license property does not match', async t => {
	t.deepEqual(await m('wrong', Object.assign({rules: {license: ['error', 'ISC']}}, opts)), [
		{
			name: 'license',
			severity: 'error',
			message: 'Expected `license` property to be `ISC`, got `MIT`.'
		}
	]);
});

test('wrong license', async t => {
	t.deepEqual(await m('wrong', opts), [
		{
			name: 'license',
			severity: 'error',
			message: 'License is not of type MIT (http://www.opensource.org/licenses/MIT).'
		}
	]);
});

test('unknown license', async t => {
	t.deepEqual(await m('unknown', opts), [
		{
			name: 'license',
			severity: 'error',
			message: 'License FOO is unknown.'
		}
	]);
});

test('no license', async t => {
	t.deepEqual(await m('no-license', opts), [
		{
			name: 'license',
			severity: 'error',
			message: 'No license found.'
		}
	]);
});

test('no license with private package', async t => {
	t.deepEqual(await m('private', opts), []);
});

test('license with private package', async t => {
	t.deepEqual(await m('private-license', opts), [
		{
			name: 'license',
			severity: 'error',
			message: 'License is not of type MIT (http://www.opensource.org/licenses/MIT).'
		}
	]);
});
