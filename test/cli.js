import test from 'ava';
import execa from 'execa';

test(async t => {
	const result = await execa.stdout('../cli.js', ['fixtures/package/no-files']);
	t.regex(result, /[ ]*?error[ ]*?Missing `files` property in `package.json`. \(pkg-files\)/);
});
