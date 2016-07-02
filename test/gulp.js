import path from 'path';
import test from 'ava';
import m from '../';

const opts = {
	cwd: 'fixtures/gulp',
	inherit: false
};

test('optional', async t => {
	t.is((await m('.', Object.assign({rules: {gulp: ['error', 'optional']}}, opts))).length, 0);
});

test('mandatory', async t => {
	const result = await m('.', Object.assign(
		{
			rules: {
				gulp: ['error', 'mandatory']
			}
		}, opts)
	);

	t.deepEqual(result, [
		{
			name: 'gulp',
			severity: 'error',
			message: 'No Gulpfile found.'
		},
		{
			name: 'gulp',
			severity: 'error',
			message: '`gulp` dependency not found in `devDependencies`.',
			file: path.resolve(opts.cwd, 'package.json')
		}
	]);
});

test('typescript gulpfile', async t => {
	t.is((await m('ts', opts)).length, 0);
});

test('typescript gulpfile - no dependency', async t => {
	t.deepEqual(await m('ts-nodep', opts), [
		{
			name: 'gulp',
			severity: 'error',
			message: 'Expected one of `ts-node`, `typescript-node`, `typescript-register`, `typescript-require` in `devDependencies`.',
			file: path.resolve(opts.cwd, 'ts-nodep/package.json')
		}
	]);
});

test('coffee gulpfile', async t => {
	t.is((await m('coffee', opts)).length, 0);
});

test('coffee gulpfile - no dependency', async t => {
	t.deepEqual(await m('coffee-nodep', opts), [
		{
			name: 'gulp',
			severity: 'error',
			message: 'Expected `coffee-script` in `devDependencies`.',
			file: path.resolve(opts.cwd, 'coffee-nodep/package.json')
		}
	]);
});
