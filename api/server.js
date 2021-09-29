const express = require('express'); // importing a CommonJS module

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json());
// server.use(logger); // globally, affects all routers and endpoints that come after
server.use('/api/hubs', logger, hubsRouter);

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome to the Lambda Hubs API</p>
  `);
});

server.use('*', (req, res, next) => {
  // catch all 404 errors middleware
  res.status(404).json({ message: `${req.method} ${req.originalUrl} not found!` })
});

module.exports = server;

function logger(req, res, next) {
  console.log(`it is a ${req.method} request to ${req.originalUrl}`)
  next() // next without args, sends req and res along the pipe
}
