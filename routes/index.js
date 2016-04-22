
'use strict';

let counter = require('./counter-routes.js');
let kvstore = require('./kvstore-routes.js');

module.exports = [].concat(counter, kvstore);