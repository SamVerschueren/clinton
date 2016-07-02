import path from 'path';
import test from 'ava';
import m from '../';

const opts = {
	cwd: 'fixtures/cli',
	inherit: false
};

test('no error', async t => {
	t.deepEqual(await m('.', opts), []);
});

test('file is not executable', async t => {
	t.deepEqual(await m('not-executable', opts), [
		{
			name: 'cli',
			severity: 'error',
			message: 'File `bin.js` is not executable.',
			file: path.resolve(opts.cwd, 'not-executable/bin.js')
		}
	]);
});

test('file not exists', async t => {
	t.deepEqual(await m('not-exists', opts), [
		{
			name: 'cli',
			severity: 'error',
			message: 'Executable file `bin.js` does not exist.',
			file: path.resolve(opts.cwd, 'not-exists/package.json')
		}
	]);
});

test('handle `bin` object', async t => {
	t.deepEqual(await m('bin-object', opts), [
		{
			name: 'cli',
			severity: 'error',
			message: 'Executable file `bin.js` does not exist.',
			file: path.resolve(opts.cwd, 'bin-object/package.json')
		}
	]);
});
