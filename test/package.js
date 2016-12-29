import path from 'path';
import test from 'ava';
import {lint as m} from '../';
import {fix} from './fixtures/utils';

const opts = {
	cwd: 'test/fixtures/package',
	inherit: false
};

test('wrong schema', async t => {
	t.deepEqual(await m('wrong-schema', opts), [
		{
			ruleId: 'pkg-schema',
			severity: 'error',
			message: 'Missing required property: version at path \'#/\'',
			file: path.resolve(opts.cwd, 'wrong-schema/package.json')
		}
	]);
});

test('invalid version', async t => {
	t.deepEqual(await m('invalid-version', opts), [
		{
			ruleId: 'valid-version',
			severity: 'error',
			message: 'The specified `version` in package.json is invalid.',
			file: path.resolve(opts.cwd, 'invalid-version/package.json')
		}
	]);
});

test('invalid order', async t => {
	t.deepEqual(fix(await m('property-order', opts)), [
		{
			ruleId: 'pkg-property-order',
			severity: 'error',
			message: 'Property \'name\' should occur before property \'version\'.',
			file: path.resolve(opts.cwd, 'property-order/package.json')
		}
	]);
});

test('invalid main', async t => {
	t.deepEqual(await m('invalid-main', opts), [
		{
			ruleId: 'pkg-main',
			severity: 'error',
			message: 'Main file \'index.js\' does not exist.',
			file: path.resolve(opts.cwd, 'invalid-main/package.json')
		}
	]);
});

test('object repository field', async t => {
	t.deepEqual(fix(await m('shorthand-repo/object', opts)), [
		{
			ruleId: 'pkg-shorthand-repository',
			severity: 'error',
			message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
			file: path.resolve(opts.cwd, 'shorthand-repo/object/package.json')
		}
	]);

	t.deepEqual(fix(await m('shorthand-repo/git-object', opts)), [
		{
			ruleId: 'pkg-shorthand-repository',
			severity: 'error',
			message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
			file: path.resolve(opts.cwd, 'shorthand-repo/git-object/package.json')
		}
	]);

	t.deepEqual(fix(await m('shorthand-repo/shorthand-object', opts)), [
		{
			ruleId: 'pkg-shorthand-repository',
			severity: 'error',
			message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
			file: path.resolve(opts.cwd, 'shorthand-repo/shorthand-object/package.json')
		}
	]);
});

test('string repository field', async t => {
	t.deepEqual(fix(await m('shorthand-repo/string', opts)), [
		{
			ruleId: 'pkg-shorthand-repository',
			severity: 'error',
			message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
			file: path.resolve(opts.cwd, 'shorthand-repo/string/package.json')
		}
	]);

	t.deepEqual(fix(await m('shorthand-repo/git-string', opts)), [
		{
			ruleId: 'pkg-shorthand-repository',
			severity: 'error',
			message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
			file: path.resolve(opts.cwd, 'shorthand-repo/git-string/package.json')
		}
	]);

	t.deepEqual(fix(await m('shorthand-repo', opts)), []);
});

test('shorthand bitbucket repository', async t => {
	t.deepEqual(fix(await m('shorthand-repo/bitbucket-string', opts)), []);
	t.deepEqual(fix(await m('shorthand-repo/bitbucket-object', opts)), []);
});

test('user property order', async t => {
	const file = path.resolve(opts.cwd, 'user-order/package.json');

	t.deepEqual(fix(await m('user-order', opts)), [
		{
			message: 'Property `author.name` should occur before property `author.email`.',
			file,
			ruleId: 'pkg-user-order',
			severity: 'error'
		},
		{
			message: 'Property `maintainers[0].email` should occur before property `maintainers[0].url`.',
			file,
			ruleId: 'pkg-user-order',
			severity: 'error'
		},
		{
			message: 'Property `contributors[0].name` should occur before property `contributors[0].url`.',
			file,
			ruleId: 'pkg-user-order',
			severity: 'error'
		}
	]);
});

test('normalize `version` field', async t => {
	t.deepEqual(fix(await m('normalize/version', opts)), [
		{
			message: 'Set `version` property to `1.0.0`.',
			file: path.resolve(opts.cwd, 'normalize/version/package.json'),
			ruleId: 'pkg-normalize',
			severity: 'error'
		}
	]);
});

test('normalize `bin` field', async t => {
	t.deepEqual(fix(await m('normalize/bin', opts)), [
		{
			message: 'Set `bin` property to `cli.js` instead of providing an object.',
			file: path.resolve(opts.cwd, 'normalize/bin/package.json'),
			ruleId: 'pkg-normalize',
			severity: 'error'
		}
	]);
});

test('normalize `bugs` field', async t => {
	t.deepEqual(await m('normalize/bugs/no-repository', opts), []);
	t.deepEqual(await m('normalize/bugs/jira', opts), []);

	t.deepEqual(fix(await m('normalize/bugs', opts)), [
		{
			message: 'Remove moot property `bugs`.',
			file: path.resolve(opts.cwd, 'normalize/bugs/package.json'),
			ruleId: 'pkg-normalize',
			severity: 'error'
		}
	]);
});

test('normalize `homepage` field', async t => {
	t.deepEqual(await m('normalize/homepage/no-repository', opts), []);
	t.deepEqual(await m('normalize/homepage/custom', opts), []);

	t.deepEqual(fix(await m('normalize/homepage', opts)), [
		{
			message: 'Remove moot property `homepage`.',
			file: path.resolve(opts.cwd, 'normalize/homepage/package.json'),
			ruleId: 'pkg-normalize',
			severity: 'error'
		}
	]);
});

test('normalize `repository` field', async t => {
	t.deepEqual(fix(await m('normalize/repository', opts)), []);
});
