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
		],
		[
			{
				name: 'xo',
				scripts: {
					test: 'xo'
				},
				devDependencies: {
					xo: '^0.15.2'
				}
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
		],
		[
			{
				name: 'xo',
				scripts: {
					test: 'xo'
				},
				devDependencies: {
					xo: '^0.16.0'
				}
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

test('support for older Node.js with fixed version', async t => {
	await ruleTester(t, 'support',
		[
			{
				ruleId: 'xo',
				severity: 'error',
				message: 'Expected version \'0.16.0\' but found \'0.17.1\'.',
				file: path.resolve(opts.cwd, 'support/package.json')
			}
		],
		[
			{
				name: 'xo',
				engines: {
					node: '>=0.10'
				},
				scripts: {
					test: 'xo'
				},
				devDependencies: {
					xo: '^0.16.0'
				}
			}
		]
	);
});

test('support for older Node.js with unicorn version', async t => {
	await ruleTester(t, 'support/unicorn',
		[
			{
				ruleId: 'xo',
				severity: 'error',
				message: 'Expected version \'0.16.0\' but found \'*\'.',
				file: path.resolve(opts.cwd, 'support/unicorn/package.json')
			}
		],
		[
			{
				name: 'xo',
				engines: {
					node: '>=0.12'
				},
				scripts: {
					test: 'xo'
				},
				devDependencies: {
					xo: '^0.16.0'
				}
			}
		]
	);
});

test('support for Node.js 4 with unicorn version', async t => {
	await ruleTester(t, 'support/node4',
		[
			{
				ruleId: 'xo',
				severity: 'error',
				message: 'Expected version \'0.20.3\' but found \'*\'.',
				file: path.resolve(opts.cwd, 'support/node4/package.json')
			}
		],
		[
			{
				name: 'xo',
				engines: {
					node: '>=4'
				},
				scripts: {
					test: 'xo'
				},
				devDependencies: {
					xo: '^0.20.3'
				}
			}
		]
	);
});

test('support for older Node.js with required unicorn version', async t => {
	const ruleTester = clintonRuleTester(Object.assign({}, opts, {rules: {xo: ['error', '*']}}));

	await ruleTester(t, 'support',
		[
			{
				ruleId: 'xo',
				severity: 'error',
				message: 'Expected version \'0.16.0\' but found \'0.17.1\'.',
				file: path.resolve(opts.cwd, 'support/package.json')
			}
		],
		[
			{
				name: 'xo',
				engines: {
					node: '>=0.10'
				},
				scripts: {
					test: 'xo'
				},
				devDependencies: {
					xo: '^0.16.0'
				}
			}
		]
	);
});
