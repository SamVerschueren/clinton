/* eslint-disable object-property-newline */
import test from 'ava';
import execa from 'execa';
import figures from 'figures';
import {lint as m} from '../';

test('project does not exist', async t => {
	await t.throws(m('foo/bar'), 'Path foo/bar does not exist.');
});

test('no project provided', async t => {
	await t.throws(m(), 'No input provided.');
});

test('no errors', async t => {
	t.is((await m('./', {ignores: ['test/**', 'docs/**']})).length, 0);
});

test('merge rules', async t => {
	const errors = await m('invalid-version', {cwd: 'test/fixtures/valid-version', inherit: false, rules: {readme: 'error'}});
	t.is(errors.length, 2);
	t.is(errors[0].ruleId, 'readme');
	t.is(errors[1].ruleId, 'valid-version');
});

test('`cwd` option', async t => {
	t.is((await m('.', {cwd: './', ignores: ['test/**', 'docs/**']})).length, 0);
});

test('`ignores` option', async t => {
	const result = await m('.', {
		cwd: 'test/fixtures/ignores',
		inherit: false,
		ignores: [
			'unicorn/**'
		]
	});

	t.is(result.length, 0);
});

test('unknown plugin', async t => {
	await t.throws(m('.', {cwd: './', plugins: ['foo'], rules: {foo: 'error'}}), 'Could not find module for plugin \'foo\'.');
});

test('cli', async t => {
	await t.throws(execa('./cli.js', ['test/fixtures/valid-version/invalid-version', '--no-inherit']), new RegExp(`[ ]*?${figures.cross}[ ]*?The specified version in package.json is invalid.[ ]*valid-version`));
});

test('do nothing if `package.json` is missing', async t => {
	const result = await m('.', {
		cwd: 'test/fixtures/no-package'
	});

	t.is(result.length, 0);
});
