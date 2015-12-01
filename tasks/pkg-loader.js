'use strict';
module.exports = repository => require('got')(`https://raw.githubusercontent.com/${repository._fullName}/master/package.json`, {json: true}).then(data => data.body);
