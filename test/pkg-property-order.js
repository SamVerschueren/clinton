import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/pkg-property-order',
	rules: {
		'pkg-property-order': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test(async t => {
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
				main: 'index.js'
			}
		]
	);
});
