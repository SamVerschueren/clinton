import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const cwd = 'test/fixtures';

const createOptions = severity => ({
	cwd,
	rules: {
		readme: severity
	}
});

test('turned off', async t => {
	await clintonRuleTester(createOptions(0))(t, '.', []);
	await clintonRuleTester(createOptions('off'))(t, '.', []);
});

test('warning', async t => {
	const reports = [
		{
			message: 'Missing readme file',
			ruleId: 'readme',
			severity: 'warn'
		}
	];

	await clintonRuleTester(createOptions(1))(t, '.', reports);
	await clintonRuleTester(createOptions('warn'))(t, '.', reports);
});

test('error', async t => {
	const reports = [
		{
			message: 'Missing readme file',
			ruleId: 'readme',
			severity: 'error'
		}
	];

	await clintonRuleTester(createOptions(2))(t, '.', reports);
	await clintonRuleTester(createOptions('error'))(t, '.', reports);
});
