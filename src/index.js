
'use strict';

const Hapi = require('hapi');
const Boom = require('boom');

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

server.route(require('../routes/counter-routes')); // require('../routes/kvstore-routes')]);

// The root directory should return a 403 error for any request to it.
server.route({
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    path: '/',
    handler: function (request, reply) {
      return reply(Boom.forbidden('Forbidden'));
    }
});

server.start((err) => {
  if(err)
    throw err;

  console.log("Server started on " + server.info.uri);
});
