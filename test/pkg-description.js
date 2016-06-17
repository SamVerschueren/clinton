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
			message: 'Package `description` should start with a capital letter'
		}
	]);
});

test('package description ends with a dot', async t => {
	t.deepEqual(await m('dot', opts), [
		{
			name: 'pkg-description',
			severity: 'error',
			message: 'Package `description` should not end with a dot'
		}
	]);
});

test('package description', async t => {
	t.deepEqual(await m('.', opts), []);
});
