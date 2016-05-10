'use strict';
exports.parse = severity => {
	if (typeof severity === 'number') {
		switch (severity) {
			case 2:
				return 'error';
			case 1:
				return 'warn';
			default:
				return 'off';
		}
	}

	return severity;
};
