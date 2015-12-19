'use strict';
const memoize = require('memoizesync');

exports.ghGot = memoize(require('gh-got'));
exports.travisGot = memoize(require('travis-got'));
exports.got = memoize(require('got'));
