import test from 'ava';
import fn from './';

test('throw if language is not javascript', async t => {
	await t.throws(fn('SamVerschueren/BB10-OAuth'), 'We can only validate JavaScript projects.');
});

test('caching', async () => {
	await fn('SamVerschueren/gh-lint');
});
