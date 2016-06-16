'use strict';
exports.assign = opts => {
	return function () {
		return Object.assign.apply(Object, [{}, opts].concat(Array.from(arguments)));
	};
};
