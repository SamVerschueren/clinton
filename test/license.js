import path from 'path';
import test from 'ava';
import {lint as m} from '../';

const opts = {
	cwd: 'test/fixtures/license',
	inherit: false
};

test('license', async t => {
	t.is((await m('mit', opts)).length, 0);
	t.is((await m('isc', opts)).length, 0);
});

test('license property does not match', async t => {
	t.deepEqual(await m('wrong', Object.assign({rules: {license: ['error', 'ISC']}}, opts)), [
		{
			ruleId: 'license',
			severity: 'error',
			message: 'Expected `license` property to be `ISC`, got `MIT`.',
			file: path.resolve(opts.cwd, 'wrong/license')
		}
	]);
});

test('wrong license', async t => {
	t.deepEqual(await m('wrong', opts), [
		{
			ruleId: 'license',
			severity: 'error',
			message: 'License is not of type MIT (http://www.opensource.org/licenses/MIT).',
			file: path.resolve(opts.cwd, 'wrong/license')
		}
	]);
});

test('unknown license', async t => {
	t.deepEqual(await m('unknown', opts), [
		{
			ruleId: 'license',
			severity: 'error',
			message: 'License FOO is unknown.',
			file: path.resolve(opts.cwd, 'unknown/license')
		}
	]);
});

test('no license', async t => {
	t.deepEqual(await m('no-license', opts), [
		{
			ruleId: 'license',
			severity: 'error',
			message: 'No license found.',
			file: path.resolve(opts.cwd, 'no-license/license')
		}
	]);
});

test('no license with private package', async t => {
	t.deepEqual(await m('private', opts), []);
});

test('license with private package', async t => {
	t.deepEqual(await m('private-license', opts), [
		{
			ruleId: 'license',
			severity: 'error',
			message: 'License is not of type MIT (http://www.opensource.org/licenses/MIT).',
			file: path.resolve(opts.cwd, 'private-license/license')
		}
	]);
});
