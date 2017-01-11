import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/pkg-schema',
	rules: {
		'pkg-schema': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test(async t => {
	await ruleTester(t, '.',
		[
			{
				message: 'Missing required property: version at path \'#/\'',
				file: path.resolve(opts.cwd, 'package.json'),
				ruleId: 'pkg-schema',
				severity: 'error'
			}
		]
	);
});
