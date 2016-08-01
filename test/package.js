import path from 'path';
import test from 'ava';
import {lint as m} from '../';

const opts = {
	cwd: 'fixtures/package',
	inherit: false
};

const mFix = async (t, input, opts) => {
	const validations = await m(input, opts);

	for (const validation of validations) {
		t.true(typeof validation.fix === 'function');
		delete validation.fix;
	}

	return validations;
};

test('no `files` property', async t => {
	t.deepEqual(await m('no-files', opts), [
		{
			ruleId: 'pkg-files',
			severity: 'error',
			message: 'Missing `files` property in `package.json`.',
			file: path.resolve(opts.cwd, 'no-files/package.json')
		}
	]);
});

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
	t.deepEqual(await mFix(t, 'property-order', opts), [
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
