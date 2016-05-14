'use strict';
const lint = require('./');

lint('.', {
	rules: {
		'license-mit': 'error'
	}
}).then(validations => {
	console.log(validations);
}).catch(err => {
	console.log(err.message);
});
