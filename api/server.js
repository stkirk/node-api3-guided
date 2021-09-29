const express = require('express'); // importing a CommonJS module
const helmet = require('helmet'); // middleware from npm
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json());
server.use(helmet()); // global middleware, affects everything
// server.use(logger); // global middleware , affects all routers and endpoints that come after
server.use('/api/hubs', logger, hubsRouter);

server.get('/', logger, (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

server.use('*', (req, res, next) => {
  // catch all 404 errors middleware
  res.status(404).json({ message: `${req.method} ${req.originalUrl} not found!` })
});

server.use(errorHandling) // will trap errors happening above

module.exports = server;

function logger(req, res, next) { // middleware
  console.log(`it is a ${req.method} request to ${req.originalUrl}`)
  next() // next without args, sends req and res along the pipe
}
function errorHandling(err, req, res, next) { // error handling
  // connect this with server.use at the end of the pipeline
  res.status(err.status || 500).json({
    message: err.message,
  })
}
