/* eslint-disable no-console */

const restify = require('restify');

const htmlFormatter = (request, response, body) => {
  if (body instanceof Error) {
    return `<html><body>${body.message}</body></html>`;
  }

  return '<html><body>Foo!</body></html>';
};

const server = restify.createServer({
  name: 'sample-restify-api',
  version: '1.0.0',
  acceptable: ['application/json', 'text/plain', 'text/html'],
  formatters: {
    'text/html': htmlFormatter,
  },
  strictNext: true,
  ignoreTrailingSlash: true,
});

server.listen(8080, 'localhost', () => {
  console.log(`${server.name} listening at ${server.url}`);
});

// pre-handlers -- handler chain is executed before routing

// const preHandler = (request, response, next) => {
//   console.log('Fired pre-handler via server.pre');
//   return next();
// };

// server.pre(preHandler);

// universal handler - server.use - handler chain is executed after a route has been chosen

// server.use((request, response, next) => {
//   console.log('Fired universal handler via server.use');
//   // console.log('response.status: ', response.statusCode);
//   return next();
// });

// can execute an array of functions via server.use
// server.use([function foo () {}, function bar () {}])

server.on('NotFound', (request, response, error, callback) => {
  console.log('in the NotFound handler!');
  return callback();
});

const errorToString = () => 'an internal server error occurred!';

const errorToJSON = () => ({
  message: 'an internal server error occurred!',
  code: 'boom!',
});

/* eslint-disable no-param-reassign */
server.on('InternalServer', (request, response, error, callback) => {
  console.log('in InternalServer');
  error.toString = errorToString;
  error.toJSON = errorToJSON;

  return callback();
});

server.on('uncaughtException', (request, response, route, error) => {
  console.log('in uncaughtException');
  response.send(error);
});

server.on('restifyError', (request, response, error, callback) => {
  console.log('in restifyError');
  return callback();
});

module.exports = server;
