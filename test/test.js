import test from 'ava';
import m from '../';

test('project does not exist', async t => {
	t.throws(m('foo/bar'), 'Path foo/bar does not exist.');
});

test('no project provided', async t => {
	t.throws(m(), 'No input provided.');
});

test('no errors', async t => {
	t.is((await m('../')).length, 0);
});

test('no rules', async t => {
	t.throws(m('no-rules', {cwd: 'fixtures/package'}), 'No rules found');
});

test('merge rules', async t => {
	const errors = await m('no-files', {cwd: 'fixtures/package', rules: {readme: 'error'}});
	t.is(errors.length, 2);
	t.is(errors[0].name, 'readme');
	t.is(errors[1].name, 'pkg-files');
});

test('cwd option', async t => {
	t.is((await m('.', {cwd: '../'})).length, 0);
});

test('unknown plugin', t => {
	t.throws(m('.', {cwd: '../', plugins: ['foo'], rules: {foo: 'error'}}), 'Could not find module for plugin \'foo\'.');
});
