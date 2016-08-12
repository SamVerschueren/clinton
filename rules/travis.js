'use strict';
const semver = require('semver');
const detectIndent = require('detect-indent');
const yaml = require('js-yaml');

const SUPPORTED_VERSIONS = ['0.10', '0.12', '4', '6'];
const DEPRECATED_VERSIONS = ['iojs', 'stable'];

/**
 * Normalize a semantic version to be a valid version. 0.10 -> 0.10.0
 */
const normalize = version => {
	version = String(version);

	const parts = version.split('.');

	while (parts.length < 3) {
		parts.push(0);
	}

	return parts.join('.');
};

const isSupported = (version, engines) => {
	for (const engine of engines) {
		if (semver.satisfies(normalize(engine), version)) {
			return true;
		}
	}

	return false;
};

const fix = (ctx, method, arg) => {
	return () => {
		const fixers = {
			unsupported: (yaml, version) => {
				const index = yaml.node_js.indexOf(version);

				if (index !== -1) {
					yaml.node_js.splice(index, 1);
				}
			},
			supported: (yaml, version) => {
				yaml.node_js.push(version);
				yaml.node_js.sort((a, b) => semver.lt(normalize(a), normalize(b)));
			}
		};

		return ctx.fs.readFile('.travis.yml', false)
			.then(travis => {
				// Detect formatting options
				const indent = detectIndent(travis).indent.length;

				travis = yaml.safeLoad(travis);

				fixers[method](travis, arg);

				const contents = yaml.safeDump(travis, {
					indent
				});

				return ctx.fs.writeFile('.travis.yml', contents, 'utf8');
			});
	};
};

module.exports = ctx => {
	const engine = (ctx.env.pkg.engines || {}).node;

	if (ctx.files.indexOf('.travis.yml') === -1) {
		return;
	}

	const file = ctx.fs.resolve('.travis.yml');

	return ctx.fs.readFile('.travis.yml')
		.then(travis => {
			const errors = [];

			if (travis.language !== 'node_js') {
				errors.push({
					message: 'Language is not set to `node_js`.',
					file
				});
			}

			if (!travis.node_js) {
				errors.push({
					message: 'No Node.js versions specified.',
					file
				});
			}

			const versions = Array.isArray(travis.node_js) ? travis.node_js : [travis.node_js];

			for (const version of versions) {
				if (DEPRECATED_VERSIONS.indexOf(version) !== -1) {
					errors.push({
						message: `Version \`${version}\` is deprecated.`,
						file
					});
				} else if (version !== 'node' && engine && !semver.satisfies(normalize(version), engine)) {
					errors.push({
						message: `Unsupported version \`${version}\` is being tested.`,
						fix: fix(ctx, 'unsupported', version),
						file
					});
				}
			}

			if (engine) {
				for (const version of SUPPORTED_VERSIONS) {
					if (semver.satisfies(normalize(version), engine) && !isSupported(version, versions)) {
						errors.push({
							message: `Supported version \`${version}\` not being tested.`,
							fix: fix(ctx, 'supported', version),
							file
						});
					}
				}
			}

			return errors;
		});
};
