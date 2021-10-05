const express = require("express"); // importing a CommonJS module
const morgan = require("morgan");
const helmet = require("helmet");
//CUSTOM middleware imports
const { logQuote, checkWord } = require("./middlewares/middleware.js");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

//Global middleware:
//helmet protects headers from displaying sensitive information we don't want everyone to have
server.use(helmet());
// morgan relays information about each request
server.use(morgan("dev"));
server.use(express.json());
server.use(logQuote("penny"));

server.use("/api/hubs", hubsRouter);

// set up checkWord for the home page only
server.get("/", checkWord, logQuote("quarter"), (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome to the Lambda Hubs API WEBPT30</p>
  `);
});

// if middleware gets a string as first argument it is only used for certain requests on the path of that string, in this case '*' means any path
server.use("*", (req, res, next) => {
  // catch all 404 errors middleware, use req object to customize message
  //calling next with an argument sends the argument to the error handling middleware below
  console.log(`hitting ${req.method} ${req.baseUrl}`);
  next({ status: 404, message: "not found" }); //the object passed to next becomes the 'err' in the error handling middleware below
});

//error handling middleware for all sad paths that arise in the application
server.use((err, req, res, next) => {
  //log error to the console
  console.log(err);
  // shoot back a response to the client if anything goes wrong in ANY of the middlewares that precede this one
  res
    .status(err.status || 500)
    .json({ message: `Something went wrong: ${err.status} ${err.message}` });
});

module.exports = server;
