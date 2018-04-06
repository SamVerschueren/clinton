'use strict';
const path = require('path');
const yaml = require('js-yaml');

exports.parse = (file, content) => {
	const ext = path.extname(file);

	if (ext === '.json') {
		return JSON.parse(content);
	}

	if (ext === '.yaml' || ext === '.yml') {
		return yaml.safeLoad(content);
	}

	return content;
};
