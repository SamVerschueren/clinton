import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/pkg-engine',
	rules: {
		'pkg-engine': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('valid package.json', async t => {
	await ruleTester(t, '.', []);
});

test('missing engines field', async t => {
	await ruleTester(t, 'no-engine',
		[
			{
				ruleId: 'pkg-engine',
				severity: 'error',
				message: 'Use `engines.node` in `package.json`',
				file: path.resolve(opts.cwd, 'no-engine/package.json')
			}
		]
	);
});

test('missing node field in engines field', async t => {
	await ruleTester(t, 'no-node',
		[
			{
				ruleId: 'pkg-engine',
				severity: 'error',
				message: 'Use `engines.node` in `package.json`',
				file: path.resolve(opts.cwd, 'no-node/package.json')
			}
		]
	);
});

test('invalid range', async t => {
	await ruleTester(t, 'invalid-range',
		[
			{
				ruleId: 'pkg-engine',
				severity: 'error',
				message: 'Invalid `engines.node` range found in `package.json`',
				file: path.resolve(opts.cwd, 'invalid-range/package.json')
			}
		]
	);
});
