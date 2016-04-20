
'use strict';

const Joi = require('joi');

let counterStore = { counter: 0 }, internals = {};

internals.getCounter = function(req, res) {
  return res(counterStore.counter);
};

internals.setCounter = function(req, res) {
  counterStore.counter = req.payload.counter;
  return res(counterStore.counter);
};

module.exports = [{
  method: 'GET',
  path: '/counter',
  config: {
    handler: internals.getCounter
  },
}, {
  method: 'POST',
  path: '/counter',
  config: {
    handler: internals.setCounter,
    validate: {
        query: {
          counter: Joi.number().integer().min(0).max(1000)
        }
    }
  }
// }, {
//   method: 'PUT',
//   path: '/counter',
//   config: {
//     // handler:
//   }
// }, {
//   method: 'PUT',
//   path: '/counter',
//   config: {
//     // handler:
//   }
}];
