import test from 'ava';
import fn from './';

test('throw if language is not javascript', async t => {
	t.throws(fn('SamVerschueren/BB10-OAuth'), 'We can only validate JavaScript projects.');
});

test('no errors', async t => {
	const errors = await fn('SamVerschueren/gh-lint');

	t.is(errors.length, 0);
});
