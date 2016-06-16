'use strict';
exports.assign = opts => {
	return (...args) => {
		return Object.assign({}, opts, ...args);
	};
};
