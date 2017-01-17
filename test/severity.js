import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const cwd = 'test/fixtures';

const createOptions = severity => ({
	cwd,
	rules: {
		'pkg-schema': severity
	}
});

test('turned off', async t => {
	await clintonRuleTester(createOptions(0))(t, '.', []);
	await clintonRuleTester(createOptions('off'))(t, '.', []);
});

test('warning', async t => {
	const reports = [
		{
			message: 'Missing required property: version at path \'#/\'',
			file: path.resolve(cwd, 'package.json'),
			ruleId: 'pkg-schema',
			severity: 'warn'
		}
	];

	await clintonRuleTester(createOptions(1))(t, '.', reports);
	await clintonRuleTester(createOptions('warn'))(t, '.', reports);
});

test('error', async t => {
	const reports = [
		{
			message: 'Missing required property: version at path \'#/\'',
			file: path.resolve(cwd, 'package.json'),
			ruleId: 'pkg-schema',
			severity: 'error'
		}
	];

	await clintonRuleTester(createOptions(2))(t, '.', reports);
	await clintonRuleTester(createOptions('error'))(t, '.', reports);
});
