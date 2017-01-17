import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/pkg-description',
	rules: {
		'pkg-description': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('package description starts with lowercase', async t => {
	await ruleTester(t, 'lowercase',
		[
			{
				ruleId: 'pkg-description',
				severity: 'error',
				message: 'Package `description` should start with a capital letter',
				file: path.resolve(opts.cwd, 'lowercase/package.json')
			}
		],
		[
			{
				name: 'package',
				description: 'Foo'
			}
		]
	);
});

test('package description ends with a dot', async t => {
	await ruleTester(t, 'dot',
		[
			{
				ruleId: 'pkg-description',
				severity: 'error',
				message: 'Package `description` should not end with a dot',
				file: path.resolve(opts.cwd, 'dot/package.json')
			}
		],
		[
			{
				name: 'package',
				description: 'Foo'
			}
		]
	);
});

test('valid package description', async t => {
	await ruleTester(t, '.', []);
});

test('no package description', async t => {
	await ruleTester(t, '..', []);
});
