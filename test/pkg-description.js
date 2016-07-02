import path from 'path';
import test from 'ava';
import m from '../';

const opts = {
	cwd: 'fixtures/pkg-description',
	inherit: false
};

test('package description starts with lowercase', async t => {
	t.deepEqual(await m('lowercase', opts), [
		{
			name: 'pkg-description',
			severity: 'error',
			message: 'Package `description` should start with a capital letter',
			file: path.resolve(opts.cwd, 'lowercase/package.json')
		}
	]);
});

test('package description ends with a dot', async t => {
	t.deepEqual(await m('dot', opts), [
		{
			name: 'pkg-description',
			severity: 'error',
			message: 'Package `description` should not end with a dot',
			file: path.resolve(opts.cwd, 'dot/package.json')
		}
	]);
});

test('package description', async t => {
	t.deepEqual(await m('.', opts), []);
});
