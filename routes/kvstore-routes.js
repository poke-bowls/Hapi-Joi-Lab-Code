
'use strict';

const Joi = require('joi');
const Boom = require('boom');

let kvstore = {}, enclosed = {};

enclosed.getKVS = (req, res) => {
  return res(kvstore);
};

enclosed.getSpecific = (req, res) => {
  let name = req.params.key;
  let specific = kvstore[name];
  let found = {};
  return kvstore[name] ? ( found[name] = specific, res(found) ) : res(Boom.notFound('Error: Key does not exist'));
};

enclosed.addKVS = (req, res) => {
  let obj = req.payload, key = obj.key, value = obj.value, pair = {};
  return kvstore.hasOwnProperty(key) ? res(Boom.conflict('Error: Key already exists')) : ( pair[key] = value, kvstore[key] = value, res(pair));
};

module.exports = [{
  method: 'GET',
  path: '/kvstore',
  config: {
    handler: enclosed.getKVS
  }
}, {
  method: 'GET',
  path: '/kvstore/{key}',
  config: {
    handler: enclosed.getSpecific
  }
}, {
  method: 'POST',
  path: '/kvstore/string',
  config: {
    handler: enclosed.addKVS,
    validate: {
      payload: {
        key: Joi.string().alphanum(),
        value: Joi.string().max(10)
      }
    }
  }
}, {
  method: 'POST',
  path: '/kvstore/number',
  config: {
    handler: enclosed.addKVS,
    validate: {
      payload: {
        key: Joi.string().alphanum(),
        value: Joi.number().integer().min(0).max(1000)
      }
    }
  }
}, {
  method: 'POST',
  path: '/kvstore/array/string',
  config: {
    handler: enclosed.addKVS,
    validate: {
      payload: {
        key: Joi.string().alphanum(),
        value: Joi.array().items(Joi.string().max(10))
      }
    }
  }
}, {
  method: 'POST',
  path: '/kvstore/array/number',
  config: {
    handler: enclosed.addKVS,
    validate: {
      payload: {
        key: Joi.string().alphanum(),
        value: Joi.array().items(Joi.number().integer().min(0).max(1000))
      }
    }
  }
}, {
  method: 'POST',
  path: '/kvstore/array',
  config: {
    handler: enclosed.addKVS,
    validate: {
      payload: {
        key: Joi.string().alphanum(),
        value: Joi.array().items(Joi.string().max(10), Joi.number().integer().min(0).max(1000))
      }
    }
  }
}];
