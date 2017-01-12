import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/cli',
	rules: {
		cli: 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('no error', async t => {
	await ruleTester(t, '.', []);
});

test('file is not executable', async t => {
	const expectedResult = process.platform === 'win32' ? [] : [
		{
			ruleId: 'cli',
			severity: 'error',
			message: 'File `bin.js` is not executable.',
			file: path.resolve(opts.cwd, 'not-executable/bin.js')
		}
	];

	await ruleTester(t, 'not-executable', expectedResult);
});

test('file not exists', async t => {
	await ruleTester(t, 'not-exists',
		[
			{
				ruleId: 'cli',
				severity: 'error',
				message: 'Executable file `bin.js` does not exist.',
				file: path.resolve(opts.cwd, 'not-exists/package.json')
			}
		]
	);
});

test('handle `bin` object', async t => {
	await ruleTester(t, 'bin-object',
		[
			{
				ruleId: 'cli',
				severity: 'error',
				message: 'Executable file `bin.js` does not exist.',
				file: path.resolve(opts.cwd, 'bin-object/package.json')
			}
		]
	);
});

test('no `bin` property', async t => {
	await ruleTester(t, '..', []);
});
