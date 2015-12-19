'use strict';
const path = require('path');
const got = require('./cache').got;
module.exports = (repository, file) => {
	const opts = {};

	if (path.extname(file) === '.json') {
		opts.json = true;
	}

	return got(`https://raw.githubusercontent.com/${repository._fullName}/master/${file}`, opts).then(data => data.body);
};
