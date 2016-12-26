import path from 'path';
import test from 'ava';
import {lint as m} from '../';

const opts = {
	cwd: 'test/fixtures/pkg-name',
	inherit: false
};

test('name starts with period', async t => {
	t.deepEqual(await m('period', opts), [
		{
			ruleId: 'pkg-name',
			severity: 'error',
			message: '`name` cannot start with a period',
			file: path.resolve(opts.cwd, 'period/package.json')
		}
	]);
});

test('name can not resemble `node_modules`', async t => {
	t.deepEqual(await m('node-modules', opts), [
		{
			ruleId: 'pkg-name',
			severity: 'error',
			message: '`node_modules` is a blacklisted `name`',
			file: path.resolve(opts.cwd, 'node-modules/package.json')
		}
	]);
});

test('name can not resemble `favicon.ico`', async t => {
	t.deepEqual(await m('favicon', opts), [
		{
			ruleId: 'pkg-name',
			severity: 'error',
			message: '`favicon.ico` is a blacklisted `name`',
			file: path.resolve(opts.cwd, 'favicon/package.json')
		}
	]);
});

test('name can not contain a space', async t => {
	t.deepEqual(await m('space', opts), [
		{
			ruleId: 'pkg-name',
			severity: 'error',
			message: '`name` can only contain URL-friendly characters',
			file: path.resolve(opts.cwd, 'space/package.json')
		}
	]);
});

test('name can not contain a `%`', async t => {
	t.deepEqual(await m('percent', opts), [
		{
			ruleId: 'pkg-name',
			severity: 'error',
			message: '`name` can only contain URL-friendly characters',
			file: path.resolve(opts.cwd, 'percent/package.json')
		}
	]);
});

test('invalid characters in scoped package', async t => {
	t.deepEqual(await m('wrongly-scoped', opts), [
		{
			ruleId: 'pkg-name',
			severity: 'error',
			message: '`name` can only contain URL-friendly characters',
			file: path.resolve(opts.cwd, 'wrongly-scoped/package.json')
		}
	]);
});

test('support scoped packages', async t => {
	t.is((await m('scoped', opts)).length, 0);
});
