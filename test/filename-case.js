import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/filename-case',
	rules: {
		'filename-case': ['error', {case: 'kebabCase'}]
	}
};

const ruleTester = clintonRuleTester(opts);

test('wrong casing', async t => {
	await ruleTester(t, '.',
		[
			{
				ruleId: 'filename-case',
				severity: 'error',
				message: 'Filename is not in kebab case. Rename it to `readme.md`.',
				file: path.resolve(opts.cwd, 'README.md')
			}
		]
	);
});
