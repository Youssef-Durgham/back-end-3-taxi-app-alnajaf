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
const fs = require("fs");
const sslify = require("express-sslify");
const pm2 = require('pm2')

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Use helmet to set HTTP headers that improve security
app.use(helmet());
const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 400, // limit each IP to 400 requests per windowMs
});

// Apply the rate limiter to all routes
app.use(rateLimiter);

// ssl setting need an ssl to buy it after that i will setup

// // Read the SSL certificate and key
// const privateKey = fs.readFileSync("/path/to/private.key");
// const certificate = fs.readFileSync("/path/to/certificate.crt");
// const ca = fs.readFileSync("/path/to/ca_bundle.crt");

// // Set up the SSL certificate and key
// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca
// };

// // Use the express-sslify middleware to redirect all HTTP traffic to HTTPS
// app.use(sslify.HTTPS({ trustProtoHeader: true }));

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//Route Middlewares
app.use("/", home);

// // Start the HTTPS server for ssl
// https.createServer(credentials, app).listen(3000, () => {
//     console.log("Server listening on port 3000");
//   });

app.listen(3003, () => console.log("server running on port 3000"));

// Connect to PM2
pm2.connect((error) => {
    if (error) {
      console.error(error);
      process.exit(2);
    };
  
    // Start the server with PM2
    pm2.start({
      name: 'back-end', // name of the app
      script: 'server.js', // entry point of the app
      instances: 4, // number of instances to start
      max_memory_restart: '100M', // restart the app if it exceeds 100MB of memory
    }, (error, apps) => {
      pm2.disconnect(); // Disconnects from PM2
      if (error) throw error;
    });
  });
