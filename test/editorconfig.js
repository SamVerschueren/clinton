import test from 'ava';
import m from '../';

const opts = {
	cwd: 'fixtures/editorconfig',
	inherit: false
};

test('no editorconfig', async t => {
	t.deepEqual(await m('false', opts), [
		{
			name: 'editorconfig',
			severity: 'error',
			message: 'Use `.editorconfig` to define and maintain consistent coding styles between editors'
		}
	]);
});

test('editorconfig', async t => {
	t.is((await m('true', opts)).length, 0);
});
