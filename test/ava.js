import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/ava',
	rules: {
		ava: 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('no AVA dependency', async t => {
	await ruleTester(t, 'no-dependency',
		[
			{
				ruleId: 'ava',
				severity: 'error',
				message: 'AVA is not installed as devDependency.',
				file: path.resolve(opts.cwd, 'no-dependency/package.json')
			}
		]
	);
});

test('wrong version', async t => {
	const ruleTester1 = clintonRuleTester(Object.assign({}, opts, {rules: {ava: ['error', '0.15.2']}}));
	const ruleTester2 = clintonRuleTester(Object.assign({}, opts, {rules: {ava: ['error', '0.16.0']}}));

	await ruleTester1(t, '.',
		[
			{
				ruleId: 'ava',
				severity: 'error',
				message: 'Expected version \'0.15.2\' but found \'0.15.1\'.',
				file: path.resolve(opts.cwd, 'package.json')
			}
		]
	);

	await ruleTester2(t, '.',
		[
			{
				ruleId: 'ava',
				severity: 'error',
				message: 'Expected version \'0.16.0\' but found \'0.15.1\'.',
				file: path.resolve(opts.cwd, 'package.json')
			}
		]
	);
});

test('unicorn version', async t => {
	const ruleTester = clintonRuleTester(Object.assign({}, opts, {rules: {ava: ['error', '*']}}));

	await ruleTester(t, 'unicorn', []);

	await ruleTester(t, '.',
		[
			{
				ruleId: 'ava',
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
				ruleId: 'ava',
				severity: 'error',
				message: 'AVA is not used in the test script.',
				file: path.resolve(opts.cwd, 'no-script/package.json')
			}
		],
		[
			{
				name: 'ava',
				devDependencies: {
					ava: '*'
				},
				scripts: {
					test: 'ava'
				}
			}
		]
	);
});

test('ava is not part of the test script', async t => {
	await ruleTester(t, 'xo',
		[
			{
				ruleId: 'ava',
				severity: 'error',
				message: 'AVA is not used in the test script.',
				file: path.resolve(opts.cwd, 'xo/package.json')
			}
		],
		[
			{
				name: 'ava',
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
				ruleId: 'ava',
				severity: 'error',
				message: 'Specify AVA config in `package.json` instead of passing it through via the CLI.',
				file: path.resolve(opts.cwd, 'cli-config/package.json')
			}
		],
		[
			{
				name: 'ava',
				scripts: {
					test: 'ava'
				},
				devDependencies: {
					ava: '0.15.1'
				},
				ava: {
					failFast: true
				}
			}
		]
	);
});
