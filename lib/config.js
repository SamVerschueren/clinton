'use strict';
const path = require('path');
const pkg = require('../package.json');
const pkgName = pkg.name;

const FILES = [
	`.${pkgName}rc.js`,
	`.${pkgName}rc.yaml`,
	`.${pkgName}rc.yml`,
	`.${pkgName}rc.json`
];

exports.load = env => {
	let configFile;
	let i = 0;

	while (!configFile && i < FILES.length) {
		if (env.files.indexOf(FILES[i]) !== -1) {
			configFile = FILES[i];
		}

		++i;
	}

	if (!configFile) {
		// If no config file was found, load the configuration from `package.json`
		return env.pkg[pkgName];
	}

	const ext = path.extname(configFile);

	if (ext === '.js' || ext === '.json') {
		// Use `require` if the extension is `.js` or `.json`
		return env.fs.require(configFile);
	}

	// Use `readFile` if the extension is something else
	return env.fs.readFile(configFile);
};
