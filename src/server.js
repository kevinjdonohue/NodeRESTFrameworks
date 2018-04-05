/* eslint-disable no-console */

const restify = require('restify');

const server = restify.createServer();

server.listen(8080, () => {
  console.log(`${server.name} listening at ${server.url}`);
});

// pre-handlers -- handler chain is executed before routing

const preHandler = (request, response, next) => {
  console.log('Fired pre-handler via server.pre');
  return next();
};

server.pre(preHandler);

// universal handler - server.use - handler chain is executed after a route has been chosen

server.use((request, response, next) => {
  console.log('Fired universal handler via server.use');
  // console.log('response.status: ', response.statusCode);
  return next();
});

// can execute an array of functions via server.use
// server.use([function foo () {}, function bar () {}])

module.exports = server;
