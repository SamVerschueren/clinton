'use strict';
const memoize = require('mem');
const got = require('got');
const ghGot = require('gh-got');
const travisGot = require('travis-got');

exports.got = memoize(got);
exports.got.get = memoize(got.get);

exports.ghGot = memoize(ghGot);
exports.ghGot.get = memoize(ghGot.get);

exports.travisGot = memoize(travisGot);
exports.travisGot.get = memoize(travisGot.get);
