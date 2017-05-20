'use strict';
module.exports = {
	rules: {
		ava: ['error', '*'],
		xo: ['error', '*'],
		editorconfig: 'error',
		license: ['error', 'MIT'],
		'no-callback': 'error',
		'pkg-main': 'error',
		'pkg-property-order': 'error',
		'pkg-user-order': 'error',
		'pkg-schema': 'error',
		'pkg-normalize': 'warn',
		'pkg-description': 'error',
		'pkg-name': 'error',
		'pkg-engine': 'error',
		'pkg-shorthand-repository': 'error',
		'pkg-dependency-order': 'error',
		readme: 'error',
		'test-script': 'error',
		'use-travis': 'warn',
		travis: 'error',
		'valid-version': 'error',
		cli: 'error',
		'max-depth': 'warn',
		gulp: ['error', 'optional'],
		'filename-case': ['error', {case: 'kebabCase'}],
		'no-dup-keywords': 'error',
		keywords: 'error',
		'no-empty-keywords': 'error',
		'no-git-merge-conflict': 'error',
		gitignore: 'error'
	}
};
