/* eslint-disable no-console */

const server = require('./server');
const errors = require('restify-errors');

/* GETs */

// const handleErrorRequest = (request, response, next) => {
//   console.log('in handleErrorRequest');
//   return next();
// };

const handleErrorResponse = (request, response, next) => {
  console.log('in handleErrorResponse');
  return next(new Error('boom!'));
};

server.get('/error', handleErrorResponse);

const handleNotFoundErrorResponse = (request, response, next) => {
  console.log('in handleNotFoundErrorResponse');
  return next(new errors.NotFoundError('not found!'));
};

server.get('/notfounderror', handleNotFoundErrorResponse);

const handleISEResponse = (request, response, next) => {
  console.log('in handleISEResponse');
  return next(new errors.InternalServerError('on noes!'));
};

server.get('/internalservererror', handleISEResponse);

const handleInvalidArgumentError = (request, response, next) => next(new errors.InvalidArgumentError('Invalid Arg Error'));

server.get('/invalidargumenterror', handleInvalidArgumentError);

const nameHandler = (request, response, next) => {
  if (!request.params.name) {
    response.send(`Please enter your name!  ex. ${server.url}/hello/kevin`);
    // sending false to next stops processing the request
    return next(false);
  }

  response.send(`hello ${request.params.name}`);
  return next();
};

const additionalNameHandler = (request, response, next) => {
  console.log(`${request.params.name} was passed in!`);
  return next();
};

server.get('/hello/:name', nameHandler, additionalNameHandler);

/* VERSIONED ROUTES */

// const PATH = '/versionedhello/:name';
// const VERSION1 = '1.0.0';
// const VERSION2 = '2.0.0';

// const sendV1 = (request, response, next) => {
//   response.send(`versionedhello: ${request.params.name}`);
//   return next();
// };

// const sendV2 = (request, response, next) => {
//   response.send({ versionedhello: request.params.name });
//   return next();
// };

// server.get({ path: PATH, version: VERSION1 }, sendV1);

// server.get({ path: PATH, version: VERSION2 }, sendV2);

// server.get({ path: PATH, version: [VERSION1, VERSION2] }, sendV2);

// TODO:  next.ifError(err) -- how do you use this?

/* POSTs */

const handlePostRequest = (request, response, next) => {
  request.someData = 'bar';
  return next();
};

const handlePostResponse = (request, response, next) => {
  response.send(request.someData);
  return next();
};

server.post('/foo', handlePostRequest, handlePostResponse);

const handlePut = (request, response, next) => {
  console.log('in handlePut');
  response.send(201, 'Something was created!');
  return next();
};

/* PUTs */

server.put('/put', handlePut);

/* DELs */

const handleDelete = (request, response, next) => {
  console.log('in handleDelete');
  response.send(204, 'Something was deleted!');
  return next();
};

server.del('/delete', handleDelete);
