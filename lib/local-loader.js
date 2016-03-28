'use strict';
const fs = require('fs');
const path = require('path');
const pify = require('pify');

const fsP = pify(fs);

exports.load = function (repository, ctx) {
	return fsP.readdir(path.join(ctx.opts.cwd, repository))
		.then(files => {
			ctx.files = files;
		})
		.then(() => ctx);
};
