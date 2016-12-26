import path from 'path';
import test from 'ava';
import {lint as m} from '../';

const opts = {
	cwd: 'test/fixtures/editorconfig',
	inherit: false
};

test('no editorconfig', async t => {
	t.deepEqual(await m('false', opts), [
		{
			ruleId: 'editorconfig',
			severity: 'error',
			message: 'Use `.editorconfig` to define and maintain consistent coding styles between editors',
			file: path.resolve(opts.cwd, 'false/.editorconfig')
		}
	]);
});

test('editorconfig', async t => {
	t.is((await m('true', opts)).length, 0);
});
