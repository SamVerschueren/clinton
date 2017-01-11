import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/pkg-name',
	rules: {
		'pkg-name': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('name starts with period', async t => {
	await ruleTester(t, 'period',
		[
			{
				ruleId: 'pkg-name',
				severity: 'error',
				message: '`name` cannot start with a period',
				file: path.resolve(opts.cwd, 'period/package.json')
			}
		]
	);
});

test('name can not resemble `node_modules`', async t => {
	await ruleTester(t, 'node-modules',
		[
			{
				ruleId: 'pkg-name',
				severity: 'error',
				message: '`node_modules` is a blacklisted `name`',
				file: path.resolve(opts.cwd, 'node-modules/package.json')
			}
		]
	);
});

test('name can not resemble `favicon.ico`', async t => {
	await ruleTester(t, 'favicon',
		[
			{
				ruleId: 'pkg-name',
				severity: 'error',
				message: '`favicon.ico` is a blacklisted `name`',
				file: path.resolve(opts.cwd, 'favicon/package.json')
			}
		]
	);
});

test('name can not contain a space', async t => {
	await ruleTester(t, 'space',
		[
			{
				ruleId: 'pkg-name',
				severity: 'error',
				message: '`name` can only contain URL-friendly characters',
				file: path.resolve(opts.cwd, 'space/package.json')
			}
		]
	);
});

test('name can not contain a `%`', async t => {
	await ruleTester(t, 'percent',
		[
			{
				ruleId: 'pkg-name',
				severity: 'error',
				message: '`name` can only contain URL-friendly characters',
				file: path.resolve(opts.cwd, 'percent/package.json')
			}
		]
	);
});

test('invalid characters in scoped package', async t => {
	await ruleTester(t, 'wrongly-scoped',
		[
			{
				ruleId: 'pkg-name',
				severity: 'error',
				message: '`name` can only contain URL-friendly characters',
				file: path.resolve(opts.cwd, 'wrongly-scoped/package.json')
			}
		]
	);
});

test('support scoped packages', async t => {
	await ruleTester(t, 'scoped', []);
});
