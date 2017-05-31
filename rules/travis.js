'use strict';
const semver = require('semver');

const SUPPORTED_VERSIONS = ['0.10', '0.12', '4', '6', '8'];
const DEPRECATED_VERSIONS = ['iojs', 'stable', 'unstable'];
const IGNORED_VERSIONS = ['node', 'lts/*', 'lts/argon', 'lts/boron', 'lts/carbon'];

/**
 * Normalize a semantic version to be a valid version. 0.10 -> 0.10.0
 */
const normalize = version => {
	version = String(version);

	const parts = version.split('.');

	while (parts.length < 3) {
		parts.push(0);
	}

	if (!semver.valid(parts.join('.'))) {
		return version;
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

const getTravisVersions = travis => {
	const versions = Array.isArray(travis.node_js) ? travis.node_js : [travis.node_js];

	const matrix = travis.matrix ? travis.matrix.include : [];
	const matrixVersions = matrix.map(x => x.node_js).filter(Boolean);

	return versions.concat(matrixVersions);
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
			yaml.node_js.sort((a, b) => {
				a = normalize(a);
				b = normalize(b);

				if (!semver.valid(a)) {
					return -1;
				}

				if (!semver.valid(b)) {
					return 1;
				}

				return semver.lt(a, b);
			});

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
			} else if (!travis.node_js) {
				ctx.report({
					message: 'No Node.js versions specified.',
					file
				});
			}

			let versions = getTravisVersions(travis);

			versions = versions.filter(version => {
				if (IGNORED_VERSIONS.indexOf(version) !== -1) {
					return false;
				} else if (DEPRECATED_VERSIONS.indexOf(version) !== -1) {
					ctx.report({
						message: `Version \`${version}\` is deprecated.`,
						file
					});

					return false;
				} else if (engine && !semver.satisfies(normalize(version), engine)) {
					ctx.report({
						message: `Unsupported version \`${version}\` is being tested.`,
						fix: fixers.unsupported(version),
						file
					});
				}

				return true;
			});

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
