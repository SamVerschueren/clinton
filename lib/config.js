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
	const checks = FILES.map(file => env.fs.pathExists(file).then(x => x ? file : undefined));

	return Promise.all(checks)
		.then(result => result.filter(Boolean)[0])
		.then(configFile => {
			if (!configFile) {
				// If no config file was found, load the configuration from `package.json`
				return env.fs.readFile('package.json').then(pkg => pkg[pkgName] || {});
			}

			const ext = path.extname(configFile);

			if (ext === '.js' || ext === '.json') {
				// Use `require` if the extension is `.js` or `.json`
				return env.fs.require(configFile);
			}

			// Use `readFile` if the extension is something else
			return env.fs.readFile(configFile);
		});
};
