/* eslint-disable no-console */

const RestifyErrors = require('restify-errors');
const RestifyServer = require('./server');

/* GETs */

const handleErrorRequest = (request, response, next) => {
  console.log('in handleErrorRequest');
  return next();
};

const handleErrorResponse = (request, response, next) => {
  console.log('in handleErrorResponse');
  return next(new Error('boom!'));
};

RestifyServer.get('/error', handleErrorRequest, handleErrorResponse);

const handleNotFoundErrorResponse = (request, response, next) => {
  console.log('in handleNotFoundErrorResponse');
  return next(new RestifyErrors.NotFoundError('not found!'));
};

RestifyServer.get('/notfounderror', handleErrorRequest, handleNotFoundErrorResponse);

const nameHandler = (request, response, next) => {
  if (!request.params.name) {
    response.send(`Please enter your name!  ex. ${RestifyServer.url}/hello/kevin`);
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

RestifyServer.get('/hello/:name', nameHandler, additionalNameHandler);

const PATH = '/versionedhello/:name';
const VERSION1 = '1.0.0';
const VERSION2 = '2.0.0';

const sendV1 = (request, response, next) => {
  response.send(`versionedhello: ${request.params.name}`);
  return next();
};

const sendV2 = (request, response, next) => {
  response.send({ hello: request.params.name });
  return next();
};

RestifyServer.get({ path: PATH, version: VERSION1 }, sendV1);

RestifyServer.get({ path: PATH, version: VERSION2 }, sendV2);

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

RestifyServer.post('/foo', handlePostRequest, handlePostResponse);

const handlePut = (request, response, next) => {
  console.log('in handlePut');
  response.send(201, 'Something was created!');
  return next();
};

/* PUTs */

RestifyServer.put('/put', handlePut);

/* DELs */

const handleDelete = (request, response, next) => {
  console.log('in handleDelete');
  response.send(204, 'Something was deleted!');
  return next();
};

RestifyServer.del('/delete', handleDelete);
