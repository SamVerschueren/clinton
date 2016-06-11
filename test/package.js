import test from 'ava';
import m from '../';

const cwd = 'fixtures/package';

test('no `files` property', async t => {
	t.deepEqual(await m('no-files', {cwd}), [
		{
			name: 'pkg-files',
			severity: 'error',
			message: 'Missing `files` property in `package.json`.'
		}
	]);
});

test('wrong schema', async t => {
	t.deepEqual(await m('wrong-schema', {cwd}), [
		{
			name: 'pkg-schema',
			severity: 'error',
			message: 'Missing required property: version at path \'#/\''
		}
	]);
});

test('invalid version', async t => {
	t.deepEqual(await m('invalid-version', {cwd}), [
		{
			name: 'valid-version',
			severity: 'error',
			message: 'The specified `version` in package.json is invalid.'
		}
	]);
});

test('invalid order', async t => {
	t.deepEqual(await m('property-order', {cwd}), [
		{
			name: 'pkg-property-order',
			severity: 'error',
			message: 'Property \'name\' should occur before property \'version\'.'
		}
	]);
});

test('invalid main', async t => {
	t.deepEqual(await m('invalid-main', {cwd}), [
		{
			name: 'pkg-main',
			severity: 'error',
			message: 'Main file \'index.js\' does not exist.'
		}
	]);
});
