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
