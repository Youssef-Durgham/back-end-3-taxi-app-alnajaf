const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
dotenv.config();
const home = require("./routes/Home");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const serverless = require('serverless-http');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Use helmet to set HTTP headers that improve security
app.use(helmet());
const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 4000000000, // limit each IP to 400 requests per windowMs
});

// Apply the rate limiter to all routes
app.use(rateLimiter);

// enable CORS and allow x-auth-token header
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//Route Middlewares
app.use("/", home);

// Lambda function handler
module.exports.handler = (event, context, callback) => {
  const handler = serverless(app);
  return handler(event, context, callback);
};
