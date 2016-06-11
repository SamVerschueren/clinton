import test from 'ava';
import m from '../';

const cwd = 'fixtures/cli';

test('no error', async t => {
	t.deepEqual(await m('.', {cwd}), []);
});

test('file is not executable', async t => {
	t.deepEqual(await m('not-executable', {cwd}), [
		{
			name: 'cli',
			severity: 'error',
			message: 'File `bin.js` is not executable.'
		}
	]);
});

test('file not exists', async t => {
	t.deepEqual(await m('not-exists', {cwd}), [
		{
			name: 'cli',
			severity: 'error',
			message: 'Executable file `bin.js` does not exist.'
		}
	]);
});

test('handle `bin` object', async t => {
	t.deepEqual(await m('bin-object', {cwd}), [
		{
			name: 'cli',
			severity: 'error',
			message: 'Executable file `bin.js` does not exist.'
		}
	]);
});
