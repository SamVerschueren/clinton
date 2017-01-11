'use strict';
const semver = require('semver');

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

const fixers = {
	unsupported: version => {
		return yaml => {
			const index = yaml.node_js.indexOf(version);

			if (index !== -1) {
				yaml.node_js.splice(index, 1);
			}

			return yaml;
		};
	},
	supported: version => {
		return yaml => {
			yaml.node_js.push(version);
			yaml.node_js.sort((a, b) => semver.lt(normalize(a), normalize(b)));

			return yaml;
		};
	}
};

module.exports = ctx => {
	const engine = (ctx.env.pkg.engines || {}).node;

	if (ctx.files.indexOf('.travis.yml') === -1) {
		return;
	}

	const file = ctx.fs.resolve('.travis.yml');

	return ctx.fs.readFile('.travis.yml')
		.then(travis => {
			if (travis.language !== 'node_js') {
				ctx.report({
					message: 'Language is not set to `node_js`.',
					file
				});
			}

			if (!travis.node_js) {
				ctx.report({
					message: 'No Node.js versions specified.',
					file
				});
			}

			const versions = Array.isArray(travis.node_js) ? travis.node_js : [travis.node_js];

			for (const version of versions) {
				if (DEPRECATED_VERSIONS.indexOf(version) !== -1) {
					ctx.report({
						message: `Version \`${version}\` is deprecated.`,
						file
					});
				} else if (version !== 'node' && engine && !semver.satisfies(normalize(version), engine)) {
					ctx.report({
						message: `Unsupported version \`${version}\` is being tested.`,
						fix: fixers.unsupported(version),
						file
					});
				}
			}

			if (engine) {
				for (const version of SUPPORTED_VERSIONS) {
					if (semver.satisfies(normalize(version), engine) && !isSupported(version, versions)) {
						ctx.report({
							message: `Supported version \`${version}\` not being tested.`,
							fix: fixers.supported(version),
							file
						});
					}
				}
			}
		});
};
