import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/pkg-shorthand-repo'
};

const ruleTester = clintonRuleTester(opts);

const result = {
	name: 'package',
	repository: 'SamVerschueren/clinton',
	clinton: {
		rules: {
			'pkg-shorthand-repository': 'error'
		}
	}
};

test('shorthand repository', async t => {
	await ruleTester(t, '.', []);
});

test('repository field is an object', async t => {
	await ruleTester(t, 'object',
		[
			{
				ruleId: 'pkg-shorthand-repository',
				severity: 'error',
				message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
				file: path.resolve(opts.cwd, 'object/package.json')
			}
		],
		[
			result
		]
	);
});

test('repository field is an object and url ends with `.git`', async t => {
	await ruleTester(t, 'git-object',
		[
			{
				ruleId: 'pkg-shorthand-repository',
				severity: 'error',
				message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
				file: path.resolve(opts.cwd, 'git-object/package.json')
			}
		],
		[
			result
		]
	);
});

test('repository field is an object and url is a shorthand', async t => {
	await ruleTester(t, 'shorthand-object',
		[
			{
				ruleId: 'pkg-shorthand-repository',
				severity: 'error',
				message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
				file: path.resolve(opts.cwd, 'shorthand-object/package.json')
			}
		],
		[
			result
		]
	);
});

test('repository field is a url', async t => {
	await ruleTester(t, 'string',
		[
			{
				ruleId: 'pkg-shorthand-repository',
				severity: 'error',
				message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
				file: path.resolve(opts.cwd, 'string/package.json')
			}
		],
		[
			result
		]
	);
});

test('repository field is a url ending in `.git`', async t => {
	await ruleTester(t, 'git-string',
		[
			{
				ruleId: 'pkg-shorthand-repository',
				severity: 'error',
				message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
				file: path.resolve(opts.cwd, 'git-string/package.json')
			}
		],
		[
			result
		]
	);
});

test('bitbucket url object', async t => {
	await ruleTester(t, 'bitbucket-object', []);
});

test('bitbucket url string', async t => {
	await ruleTester(t, 'bitbucket-string', []);
});
