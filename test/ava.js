import test from 'ava';
import m from '../';

const cwd = 'fixtures/ava';

test('no AVA dependency', async t => {
	t.deepEqual(await m('no-dependency', {cwd}), [
		{
			name: 'ava',
			severity: 'error',
			message: 'AVA is not installed as devDependency.'
		}
	]);
});

test('wrong version', async t => {
	t.deepEqual(await m(cwd, {rules: {ava: ['error', '0.15.2']}}), [
		{
			name: 'ava',
			severity: 'error',
			message: 'Expected version \'0.15.2\' but found \'0.15.1\'.'
		}
	]);

	t.deepEqual(await m(cwd, {rules: {ava: ['error', '0.16.0']}}), [
		{
			name: 'ava',
			severity: 'error',
			message: 'Expected version \'0.16.0\' but found \'0.15.1\'.'
		}
	]);
});

test('unicorn version', async t => {
	t.is((await m('unicorn', {cwd, rules: {ava: ['error', '*']}})).length, 0);

	t.deepEqual(await m(cwd, {rules: {ava: ['error', '*']}}), [
		{
			name: 'ava',
			severity: 'error',
			message: 'Expected unicorn version \'*\' but found \'0.15.1\'.'
		}
	]);
});

test('test script', async t => {
	t.deepEqual(await m('no-script', {cwd}), [
		{
			name: 'ava',
			severity: 'error',
			message: 'AVA is not used in the test script.'
		}
	]);
});

test('cli config', async t => {
	t.deepEqual(await m('cli-config', {cwd}), [
		{
			name: 'ava',
			severity: 'error',
			message: 'Specify AVA config in `package.json` instead of passing it through via the CLI.'
		}
	]);
});