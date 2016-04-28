
'use strict';

const Joi = require('joi');
const Boom = require('boom');

let counterSchema = Joi.object().keys({
    counter: Joi.number().integer().min(0).max(1000)
});

let counterStore = { counter: 0 }, internals = {};

internals.getCounter = (req, res) => {
  return res(counterStore);
};

internals.setCounter = (req, res) => {
  counterStore.counter = req.payload.counter;
  return res(counterStore);
};

internals.increment = (req, res) => {
  // return counterStore.counter < 1000 ? ( counterStore.counter ++, res(counterStore) ) : res(Boom.badRequest('Error: Counter must not exceed 1000'));
  counterStore.counter ++;
  return res(counterStore);
};

internals.decrement = (req, res) => {
  // return counterStore.counter > 0 ? ( counterStore.counter --, res(counterStore) ) : res(Boom.badRequest('Error: Counter may not be less than 0'));
  counterStore.counter --;
  return res(counterStore);
};

module.exports = [{
  method: 'GET',
  path: '/counter',
  config: {
    handler: internals.getCounter,
    validate: {
      params: false,
      payload: false,
      query: false
    }
  }
}, {
  method: 'POST',
  path: '/counter',
  config: {
    handler: internals.setCounter,
    validate: {
        payload: counterSchema
    }
  }
}, {
  method: 'PUT',
  path: '/counter/increment',
  config: {
    handler: internals.increment,
    response: {
      schema: counterSchema,
      // failAction: 'log'
    }
  }
}, {
  method: 'PUT',
  path: '/counter/decrement',
  config: {
    handler: internals.decrement,
    response: {
      schema: counterSchema,
      // failAction: 'log'
    }
  }
}];
