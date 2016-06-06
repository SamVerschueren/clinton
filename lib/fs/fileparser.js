'use strict';
const path = require('path');
const yaml = require('yaml');

exports.parse = (file, content) => {
	const ext = path.extname(file);

	if (ext === '.json') {
		return JSON.parse(content);
	} else if (ext === '.yaml' || ext === '.yml') {
		return yaml.eval(content);
	}

	return content;
};
