import path from 'path';
import test from 'ava';
import {lint as m} from '../';
import {fix} from './fixtures/utils';

const opts = {
	cwd: 'test/fixtures/travis',
	inherit: false
};

test('use travis', async t => {
	t.deepEqual(await m('use-travis', opts), [
		{
			ruleId: 'use-travis',
			message: 'Use travis to automatically run your tests.',
			severity: 'error'
		}
	]);
});

test('no engine specified', async t => {
	t.is((await m('no-engine', opts)).length, 0);
});

test('unsupported version', async t => {
	const file = path.resolve(opts.cwd, 'unsupported-version/.travis.yml');

	t.deepEqual(fix(await m('unsupported-version', opts)), [
		{
			message: 'Unsupported version `0.12` is being tested.',
			ruleId: 'travis',
			severity: 'error',
			file
		},
		{
			message: 'Unsupported version `0.10` is being tested.',
			ruleId: 'travis',
			severity: 'error',
			file
		}
	]);
});

test('untested versions', async t => {
	const file = path.resolve(opts.cwd, 'untested/.travis.yml');

	t.deepEqual(fix(await m('untested', opts)), [
		{
			message: 'Supported version `0.10` not being tested.',
			ruleId: 'travis',
			severity: 'error',
			file
		},
		{
			message: 'Supported version `0.12` not being tested.',
			ruleId: 'travis',
			severity: 'error',
			file
		}
	]);
});

test('deprecated versions', async t => {
	const file = path.resolve(opts.cwd, 'deprecated/.travis.yml');

	t.deepEqual(await m('deprecated', opts), [
		{
			message: 'Version `stable` is deprecated.',
			file,
			ruleId: 'travis',
			severity: 'error'
		},
		{
			message: 'Version `iojs` is deprecated.',
			file,
			ruleId: 'travis',
			severity: 'error'
		}
	]);
});
