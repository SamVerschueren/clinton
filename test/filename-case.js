import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/filename-case'
};

const ruleTester = clintonRuleTester(opts);

test('falls back to camelcase', async t => {
	await ruleTester(t, 'default',
		[
			{
				ruleId: 'filename-case',
				severity: 'error',
				message: 'Filename is not in camel case. Rename it to `fooBar.js`.',
				file: path.resolve(opts.cwd, 'default/foo_bar.js')
			}
		]
	);
});

test('kebab casing', async t => {
	await ruleTester(t, 'kebab',
		[
			{
				ruleId: 'filename-case',
				severity: 'error',
				message: 'Filename is not in kebab case. Rename it to `readme.md`.',
				file: path.resolve(opts.cwd, 'kebab/README.md')
			}
		]
	);
});

test('snake casing', async t => {
	await ruleTester(t, 'snake',
		[
			{
				ruleId: 'filename-case',
				severity: 'error',
				message: 'Filename is not in snake case. Rename it to `foo_bar.js`.',
				file: path.resolve(opts.cwd, 'snake/fooBar.js')
			}
		]
	);
});

test('pascal casing', async t => {
	await ruleTester(t, 'pascal',
		[
			{
				ruleId: 'filename-case',
				severity: 'error',
				message: 'Filename is not in pascal case. Rename it to `FooBar.js`.',
				file: path.resolve(opts.cwd, 'pascal/fooBar.js')
			},
			{
				ruleId: 'filename-case',
				severity: 'error',
				message: 'Filename is not in pascal case. Rename it to `Package.json`.',
				file: path.resolve(opts.cwd, 'pascal/package.json')
			}
		]
	);
});
