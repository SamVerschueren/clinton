import test from 'ava';
import m from '../';

const cwd = 'fixtures/editorconfig';

test('no editorconfig', async t => {
	t.deepEqual(await m('false', {cwd}), [
		{
			name: 'editorconfig',
			severity: 'error',
			message: 'Use `.editorconfig` to define and maintain consistent coding styles between editors'
		}
	]);
});

test('editorconfig', async t => {
	t.is((await m('true', {cwd})).length, 0);
});
