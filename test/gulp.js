import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/gulp',
	rules: {
		gulp: 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('optional', async t => {
	const ruleTester = clintonRuleTester(Object.assign({}, opts, {rules: {gulp: ['error', 'optional']}}));

	await ruleTester(t, '.', []);
});

test('mandatory', async t => {
	const ruleTester = clintonRuleTester(Object.assign({}, opts, {rules: {gulp: ['error', 'mandatory']}}));

	await ruleTester(t, '.',
		[
			{
				ruleId: 'gulp',
				severity: 'error',
				message: 'No Gulpfile found.'
			},
			{
				ruleId: 'gulp',
				severity: 'error',
				message: '`gulp` dependency not found in `devDependencies`.',
				file: path.resolve(opts.cwd, 'package.json')
			}
		]
	);
});

test('typescript gulpfile', async t => {
	await ruleTester(t, 'ts', []);
});

test('typescript gulpfile - no dependency', async t => {
	await ruleTester(t, 'ts-nodep',
		[
			{
				ruleId: 'gulp',
				severity: 'error',
				message: 'Expected one of `ts-node`, `typescript-node`, `typescript-register`, `typescript-require` in `devDependencies`.',
				file: path.resolve(opts.cwd, 'ts-nodep/package.json')
			}
		]
	);
});

test('coffee gulpfile', async t => {
	await ruleTester(t, 'coffee', []);
});

test('coffee gulpfile - no dependency', async t => {
	await ruleTester(t, 'coffee-nodep',
		[
			{
				ruleId: 'gulp',
				severity: 'error',
				message: 'Expected `coffee-script` in `devDependencies`.',
				file: path.resolve(opts.cwd, 'coffee-nodep/package.json')
			}
		]
	);
});
