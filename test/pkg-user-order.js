import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/pkg-user-order',
	rules: {
		'pkg-user-order': 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test(async t => {
	const file = path.resolve(opts.cwd, 'package.json');

	await ruleTester(t, '.',
		[
			{
				message: 'Property `author.name` should occur before property `author.email`.',
				file,
				ruleId: 'pkg-user-order',
				severity: 'error'
			},
			{
				message: 'Property `maintainers[0].email` should occur before property `maintainers[0].url`.',
				file,
				ruleId: 'pkg-user-order',
				severity: 'error'
			},
			{
				message: 'Property `contributors[0].name` should occur before property `contributors[0].url`.',
				file,
				ruleId: 'pkg-user-order',
				severity: 'error'
			}
		],
		[
			{
				name: 'package',
				author: {
					name: 'Sam Verschueren',
					email: 'sam.verschueren@gmail.com',
					url: 'github.com/SamVerschueren'
				},
				maintainers: [
					{
						name: 'Sam Verschueren',
						url: 'github.com/SamVerschueren',
						email: 'sam.verschueren@gmail.com'
					}
				],
				contributors: [
					{
						url: 'github.com/SamVerschueren',
						name: 'Sam Verschueren',
						email: 'sam.verschueren@gmail.com'
					}
				]
			},
			{
				name: 'package',
				author: {
					email: 'sam.verschueren@gmail.com',
					name: 'Sam Verschueren',
					url: 'github.com/SamVerschueren'
				},
				maintainers: [
					{
						name: 'Sam Verschueren',
						email: 'sam.verschueren@gmail.com',
						url: 'github.com/SamVerschueren'
					}
				],
				contributors: [
					{
						url: 'github.com/SamVerschueren',
						name: 'Sam Verschueren',
						email: 'sam.verschueren@gmail.com'
					}
				]
			},
			{
				name: 'package',
				author: {
					email: 'sam.verschueren@gmail.com',
					name: 'Sam Verschueren',
					url: 'github.com/SamVerschueren'
				},
				maintainers: [
					{
						name: 'Sam Verschueren',
						url: 'github.com/SamVerschueren',
						email: 'sam.verschueren@gmail.com'
					}
				],
				contributors: [
					{
						name: 'Sam Verschueren',
						email: 'sam.verschueren@gmail.com',
						url: 'github.com/SamVerschueren'
					}
				]
			}
		]
	);
});
