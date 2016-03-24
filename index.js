'use strict';

var loader = require('./lib/loader');

exports.for = function(schema) {
  return loader(schema);;
}