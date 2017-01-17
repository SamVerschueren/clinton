import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/gitignore',
	rules: {
		gitignore: 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('valid .gitignore', async t => {
	await ruleTester(t, '.', []);
});

test('no .gitignore found', async t => {
	await ruleTester(t, 'no-gitignore',
		[
			{
				ruleId: 'gitignore',
				severity: 'error',
				message: 'No `.gitignore` file found. Add it to the root of your project.',
				file: path.resolve(opts.cwd, 'no-gitignore/.gitignore')
			}
		],
		[
			'node_modules\n'
		]
	);
});

test('`node_modules` not ignored', async t => {
	await ruleTester(t, 'no-modules',
		[
			{
				ruleId: 'gitignore',
				severity: 'error',
				message: '`node_modules` is not being ignored. Add it to `.gitignore`.',
				file: path.resolve(opts.cwd, 'no-modules/.gitignore')
			}
		],
		[
			'foo.txt\nnode_modules\n'
		]
	);
});

test('`node_modules` not ignored and no final newline', async t => {
	await ruleTester(t, 'no-modules-no-final-newline',
		[
			{
				ruleId: 'gitignore',
				severity: 'error',
				message: '`node_modules` is not being ignored. Add it to `.gitignore`.',
				file: path.resolve(opts.cwd, 'no-modules-no-final-newline/.gitignore')
			}
		],
		[
			'foo.txt\nnode_modules'
		]
	);
});
