'use strict';
const memoize = require('mem');

exports.ghGot = memoize(require('gh-got'));
exports.travisGot = memoize(require('travis-got'));
exports.got = memoize(require('got'));
