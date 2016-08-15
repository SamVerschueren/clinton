/* eslint-disable object-property-newline */
import test from 'ava';
import execa from 'execa';
import figures from 'figures';
import {lint as m} from '../';

test('project does not exist', async t => {
	t.throws(m('foo/bar'), 'Path foo/bar does not exist.');
});

test('no project provided', async t => {
	t.throws(m(), 'No input provided.');
});

test('no errors', async t => {
	t.is((await m('../', {ignores: ['test/**']})).length, 0);
});

test('merge rules', async t => {
	const errors = await m('no-files', {cwd: 'fixtures/package', inherit: false, rules: {readme: 'error'}});
	t.is(errors.length, 2);
	t.is(errors[0].ruleId, 'readme');
	t.is(errors[1].ruleId, 'pkg-files');
});

test('`cwd` option', async t => {
	t.is((await m('.', {cwd: '../', ignores: ['test/**']})).length, 0);
});

test('`ignores` option', async t => {
	const result = await m('.', {
		cwd: 'fixtures/ignores',
		inherit: false,
		ignores: [
			'unicorn/**'
		]
	});

	t.is(result.length, 0);
});

test('unknown plugin', t => {
	t.throws(m('.', {cwd: '../', plugins: ['foo'], rules: {foo: 'error'}}), 'Could not find module for plugin \'foo\'.');
});

test('cli', t => {
	t.throws(execa('../cli.js', ['fixtures/package/no-files', '--no-inherit']), new RegExp(`[ ]*?${figures.cross}[ ]*?Missing files property in package.json.[ ]*pkg-files`));
});
