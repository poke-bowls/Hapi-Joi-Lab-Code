
'use strict';

const Hapi = require('hapi');
const Boom = require('boom');

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

let routes = require('../routes');
server.route(routes);

// The root directory should return a 403 error for any request to it.
server.route({
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    path: '/',
    handler: (req, res) => {
      return res(Boom.forbidden('Forbidden'));
    }
});

server.ext('onPreResponse', (request, reply) => {
  let req = request.response;
  if(req.isBoom && req.statusCode === 500 || req.statusCode === undefined) {
    return reply(Boom.badRequest(req.message));
  }
  return reply.continue();
});

if(!module.parent) {
  server.start((err) => {
  if(err)
    throw err;

  console.log("Server started on " + server.info.uri);
  });
}

module.exports = server;
