import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/pkg-dependency-order',
	rules: {
		'pkg-dependency-order': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('ordered dependencies and devDependencies', async t => {
	await ruleTester(t, '.', []);
});

test('unordered dependencies', async t => {
	await ruleTester(t, 'unordered-dependencies',
		[
			{
				ruleId: 'pkg-dependency-order',
				severity: 'error',
				message: 'Dependency `clinton` should occur before `pify`.',
				file: path.resolve(opts.cwd, 'unordered-dependencies/package.json')
			}
		],
		[
			{
				name: 'package',
				dependencies: {
					clinton: '*',
					pify: '*'
				},
				devDependencies: {
					ava: '*',
					xo: '*'
				}
			}
		]
	);
});

test('unordered devDependencies', async t => {
	await ruleTester(t, 'unordered-devdependencies',
		[
			{
				ruleId: 'pkg-dependency-order',
				severity: 'error',
				message: 'Dev dependency `ava` should occur before `xo`.',
				file: path.resolve(opts.cwd, 'unordered-devdependencies/package.json')
			}
		],
		[
			{
				name: 'package',
				dependencies: {
					clinton: '*',
					pify: '*'
				},
				devDependencies: {
					ava: '*',
					xo: '*'
				}
			}
		]
	);
});

test('unordered dependencies and devDependencies', async t => {
	await ruleTester(t, 'unordered',
		[
			{
				ruleId: 'pkg-dependency-order',
				severity: 'error',
				message: 'Dependency `clinton` should occur before `pify`.',
				file: path.resolve(opts.cwd, 'unordered/package.json')
			},
			{
				ruleId: 'pkg-dependency-order',
				severity: 'error',
				message: 'Dev dependency `ava` should occur before `xo`.',
				file: path.resolve(opts.cwd, 'unordered/package.json')
			}
		],
		[
			{
				name: 'package',
				dependencies: {
					clinton: '*',
					pify: '*'
				},
				devDependencies: {
					xo: '*',
					ava: '*'
				}
			},
			{
				name: 'package',
				dependencies: {
					pify: '*',
					clinton: '*'
				},
				devDependencies: {
					ava: '*',
					xo: '*'
				}
			}
		]
	);
});
