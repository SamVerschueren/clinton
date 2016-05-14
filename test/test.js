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

test('overwrite rules', async t => {
	const errors = await m('no-files', {cwd: 'fixtures/package', rules: {readme: 'error'}});
	t.is(errors.length, 1);
	t.is(errors[0].name, 'readme');
});

test('cwd option', async t => {
	t.is((await m('.', {cwd: '../'})).length, 0);
});
