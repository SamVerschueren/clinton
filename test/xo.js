import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/xo',
	rules: {
		xo: 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('no XO dependency', async t => {
	await ruleTester(t, 'no-dependency',
		[
			{
				ruleId: 'xo',
				severity: 'error',
				message: 'XO is not installed as devDependency.',
				file: path.resolve(opts.cwd, 'no-dependency/package.json')
			}
		]
	);
});

test('wrong version', async t => {
	const ruleTester1 = clintonRuleTester(Object.assign({}, opts, {rules: {xo: ['error', '0.15.2']}}));
	const ruleTester2 = clintonRuleTester(Object.assign({}, opts, {rules: {xo: ['error', '0.16.0']}}));

	await ruleTester1(t, '.',
		[
			{
				ruleId: 'xo',
				severity: 'error',
				message: 'Expected version \'0.15.2\' but found \'0.15.1\'.',
				file: path.resolve(opts.cwd, 'package.json')
			}
		]
	);

	await ruleTester2(t, '.',
		[
			{
				ruleId: 'xo',
				severity: 'error',
				message: 'Expected version \'0.16.0\' but found \'0.15.1\'.',
				file: path.resolve(opts.cwd, 'package.json')
			}
		]
	);
});

test('unicorn version', async t => {
	const ruleTester = clintonRuleTester(Object.assign({}, opts, {rules: {xo: ['error', '*']}}));

	await ruleTester(t, 'unicorn', []);

	await ruleTester(t, '.',
		[
			{
				ruleId: 'xo',
				severity: 'error',
				message: 'Expected unicorn version \'*\' but found \'0.15.1\'.',
				file: path.resolve(opts.cwd, 'package.json')
			}
		]
	);
});

test('test script', async t => {
	await ruleTester(t, 'no-script',
		[
			{
				ruleId: 'xo',
				severity: 'error',
				message: 'XO is not used in the test script.',
				file: path.resolve(opts.cwd, 'no-script/package.json')
			}
		],
		[
			{
				name: 'xo',
				scripts: {
					test: 'xo'
				},
				devDependencies: {
					xo: '*'
				}
			}
		]
	);
});

test('xo is not part of the test script', async t => {
	await ruleTester(t, 'ava',
		[
			{
				ruleId: 'xo',
				severity: 'error',
				message: 'XO is not used in the test script.',
				file: path.resolve(opts.cwd, 'ava/package.json')
			}
		],
		[
			{
				name: 'xo',
				scripts: {
					test: 'xo && ava'
				},
				devDependencies: {
					ava: '*',
					xo: '*'
				}
			}
		]
	);
});

test('cli config', async t => {
	await ruleTester(t, 'cli-config',
		[
			{
				ruleId: 'xo',
				severity: 'error',
				message: 'Specify XO config in `package.json` instead of passing it through via the CLI.',
				file: path.resolve(opts.cwd, 'cli-config/package.json')
			}
		],
		[
			{
				name: 'xo',
				scripts: {
					test: 'xo'
				},
				devDependencies: {
					xo: '0.15.1'
				},
				xo: {
					space: true,
					semicolon: false,
					fooBar: true
				}
			}
		]
	);
});
