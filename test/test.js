import test from 'ava';
import m from '../';

test('project does not exist', async t => {
	t.throws(m('foo/bar'), 'Path foo/bar does not exist.');
});

test('no errors', async t => {
	t.is((await m('../')).length, 0);
});
