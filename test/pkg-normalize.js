import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/pkg-normalize',
	rules: {
		'pkg-normalize': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('normalize `version` field', async t => {
	await ruleTester(t, 'version',
		[
			{
				message: 'Set `version` property to `1.0.0`.',
				file: path.resolve(opts.cwd, 'version/package.json'),
				ruleId: 'pkg-normalize',
				severity: 'error'
			}
		],
		[
			{
				name: 'package',
				version: '1.0.0'
			}
		]
	);
});

test('normalize `bin` field', async t => {
	await ruleTester(t, 'bin',
		[
			{
				message: 'Set `bin` property to `cli.js` instead of providing an object.',
				file: path.resolve(opts.cwd, 'bin/package.json'),
				ruleId: 'pkg-normalize',
				severity: 'error'
			}
		],
		[
			{
				name: 'package',
				bin: 'cli.js'
			}
		]
	);
});

test('normalize `bugs` field', async t => {
	await ruleTester(t, 'bugs/no-repository', []);
	await ruleTester(t, 'bugs/jira', []);
	await ruleTester(t, 'bugs',
		[
			{
				message: 'Remove moot property `bugs`.',
				file: path.resolve(opts.cwd, 'bugs/package.json'),
				ruleId: 'pkg-normalize',
				severity: 'error'
			}
		],
		[
			{
				name: 'package',
				repository: 'SamVerschueren/clinton'
			}
		]
	);
});

test('normalize `homepage` field', async t => {
	await ruleTester(t, 'homepage/no-repository', []);
	await ruleTester(t, 'homepage/custom', []);
	await ruleTester(t, 'homepage/repository-object',
		[
			{
				message: 'Remove moot property `homepage`.',
				file: path.resolve(opts.cwd, 'homepage/repository-object/package.json'),
				ruleId: 'pkg-normalize',
				severity: 'error'
			}
		],
		[
			{
				name: 'package',
				repository: {
					url: 'SamVerschueren/clinton'
				}
			}
		]
	);
	await ruleTester(t, 'homepage',
		[
			{
				message: 'Remove moot property `homepage`.',
				file: path.resolve(opts.cwd, 'homepage/package.json'),
				ruleId: 'pkg-normalize',
				severity: 'error'
			}
		],
		[
			{
				name: 'package',
				repository: 'SamVerschueren/clinton'
			}
		]
	);
});

test('normalize `repository` field', async t => {
	await ruleTester(t, 'repository', []);
});
