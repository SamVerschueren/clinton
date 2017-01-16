import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/pkg-property-order',
	rules: {
		'pkg-property-order': 'error'
	}
};

const customOrder = [
	'name',
	'main',
	'version',
	'xo',
	'devDependencies'
];

test('default order', async t => {
	const ruleTester = clintonRuleTester(opts);

	await ruleTester(t, '.',
		[
			{
				ruleId: 'pkg-property-order',
				severity: 'error',
				message: 'Property \'name\' should occur before property \'version\'.',
				file: path.resolve(opts.cwd, 'package.json')
			}
		],
		[
			{
				name: 'package',
				version: '0.0.0',
				main: 'index.js',
				devDependencies: {
					xo: '*'
				},
				xo: {
					esnext: true
				}
			}
		]
	);
});

test('custom order', async t => {
	const ruleTester = clintonRuleTester(Object.assign({}, opts, {rules: {'pkg-property-order': ['error', {order: customOrder}]}}));

	await ruleTester(t, '.',
		[
			{
				ruleId: 'pkg-property-order',
				severity: 'error',
				message: 'Property \'name\' should occur before property \'version\'.',
				file: path.resolve(opts.cwd, 'package.json')
			}
		],
		[
			{
				name: 'package',
				main: 'index.js',
				version: '0.0.0',
				xo: {
					esnext: true
				},
				devDependencies: {
					xo: '*'
				}
			}
		]
	);
});
