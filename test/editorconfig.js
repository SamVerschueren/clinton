import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/editorconfig',
	rules: {
		editorconfig: 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('no editorconfig', async t => {
	await ruleTester(t, 'false',
		[
			{
				ruleId: 'editorconfig',
				severity: 'error',
				message: 'Use `.editorconfig` to define and maintain consistent coding styles between editors',
				file: path.resolve(opts.cwd, 'false/.editorconfig')
			}
		]
	);
});

test('editorconfig', async t => {
	await ruleTester(t, 'true', []);
});

test('do not validate binary files', async t => {
	await ruleTester(t, 'binary', []);
});

test('invalid editorconfig', async t => {
	await ruleTester(t, 'invalid',
		[
			{
				ruleId: 'editorconfig',
				severity: 'error',
				message: 'Unexpected spaces found at line 2',
				file: path.resolve(opts.cwd, 'invalid/package.json')
			}
		]
	);
});
