import path from 'path';
import test from 'ava';
import m from '../';

const opts = {
	cwd: 'fixtures/filename-case',
	inherit: false
};

test('wrong casing', async t => {
	t.deepEqual(await m('.', opts), [
		{
			name: 'filename-case',
			severity: 'error',
			message: 'Filename is not in kebab case. Rename it to `readme.md`.',
			file: path.resolve(opts.cwd, 'README.md')
		}
	]);
});
