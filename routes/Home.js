const router = require("express").Router();
const Users = require("../model/Users.js");
const jwt = require("jsonwebtoken");
const TaxiOrder = require("../model/TaxiOrder.js");
const Pricing = require("../model/Pricing.js");
const DebtPercentage = require("../model/DebtPercentage.js");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const mongoose = require('mongoose');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });


// Get your Firebase server key from the Firebase console.
const serviceAccount = require("../taxi-a519a-firebase-adminsdk-c1qag-a4149b9d00.json");
const NotificationToken = require("../model/NotificationToken.js");
const Notification = require("../model/Notification.js");

// Create a new FCM client.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// check the user jwt token
const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(401)
      .json({
        error: "No token, authorization denied",
        source: "authMiddleware",
      });
  }
};



// api for return the users locations and data in the order
router.get('/order-userslocations', auth, async (req, res) => {
  // Extract the user id from the JWT token
  const captainId = req.user.id;

  try {
    // Fetch all non-cancelled orders of the captain
    const orders = await TaxiOrder.find({
      captain: mongoose.Types.ObjectId(captainId),
      cancelled: false,
    });

    // Prepare an array to store user and passenger data
    let userData = [];

    // Prepare an array to store destination data
    let destinations = [];

    // Loop through each order
    for (let order of orders) {
      // Fetch main user data
      const user = await Users.findOne({
        _id: mongoose.Types.ObjectId(order.user),
      }, '_id name picture location');

      // Add main user data to the array
      userData.push(user);

      // Fetch passenger data
      for (let passenger of order.passengers) {
        const passengerData = await Users.findOne({
          _id: mongoose.Types.ObjectId(passenger.user),
        }, '_id name picture location');

        // Add passenger data to the array
        userData.push(passengerData);
      }

      // Add destination to destinations array if not already present
      if (!destinations.find(dest => dest.location.coordinates[0] === order.destination.coordinates[0]
        && dest.location.coordinates[1] === order.destination.coordinates[1])) {
        destinations.push({
          _id: `destination${orders.indexOf(order) + 1}`,
          name: `وجهة ${orders.indexOf(order) + 1}`,
          location: order.destination
        });
      }
    }

    // Combine user and destinations data
    userData = userData.concat(destinations);

    // Send the response
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// api for send arrive notification
router.post('/send-notification', auth, async (req, res) => {
  const {userId, title, body} = req.body;

  // fetch all tokens of the user
  const tokens = await NotificationToken.find({user: userId});

  // prepare the message
  const message = {
      notification: {
          title: title,
          body: body
      },
      tokens: tokens.map(token => token.token)
  };

  // send the notification
  try {
      const response = await admin.messaging().sendMulticast(message);
      console.log(response.successCount + ' messages were sent successfully');
  } catch (error) {
      console.log('Error sending message:', error);
  }

  // save the notification in the database
  const notification = new Notification({
      user: userId,
      title: title,
      body: body
  });
  try {
      await notification.save();
      res.json({message: 'Notification sent and saved successfully.'});
  } catch (err) {
      res.status(500).json({error: err.message});
  }
});

// websocket connection

let captainClients = new Map(); // {captainId: ws}
let userClients = new Map(); // {userId: ws}
let adminClients = []; // List of admin clients
let captainLocations = new Map(); // {captainId: location}

wss.on('connection', ws => {
  console.log(captainClients, userClients);
  ws.send(JSON.stringify({ message: 'Connection successful!' }));

  ws.on('message', message => {
    let payload = JSON.parse(message);
    const { token } = payload;
    const { role, id } = jwt.verify(token, process.env.JWT_SECRET); // Verify the JWT token
    console.log(token, role, id)
    console.log(captainClients, userClients)
    console.log(payload)

    if (role === 'captain') {
      captainClients.set(id, ws);
    
      // Update location if provided
      if (payload.location) {
        captainLocations.set(id, payload.location);
    
        // Notify all admin clients about this captain's location
        adminClients.forEach(adminWs => {
          if (adminWs.readyState === WebSocket.OPEN) {
            adminWs.send(JSON.stringify({ captainId: id, location: payload.location }));
          }
        });
      }
    } else if (role === 'user') {
      userClients.set(id, ws);
      ws.send(JSON.stringify({ message: 'User added successfully!' }));
    } else if (role === 'admin') {
      adminClients.push(ws);

      // Send locations of all connected captains to the admin
      let locations = [];
      for (let [captainId, location] of captainLocations.entries()) {
        let captainWs = captainClients.get(captainId);
        if (captainWs && captainWs.readyState === WebSocket.OPEN) {
          locations.push({ captainId: captainId, location: location });
        }
      }
      ws.send(JSON.stringify(locations));
    }
  });
  
  ws.on('close', () => {
    for (let [captainId, captainWs] of captainClients.entries()) {
      if (ws === captainWs) {
        captainClients.delete(captainId);
        captainLocations.delete(captainId);
      }
    }
    
    for (let [userId, userWs] of userClients.entries()) {
      if (ws === userWs) {
        userClients.delete(userId);
      }
    }
  });
});

// Interval to send captain locations to user clients every 10 seconds
setInterval(() => {
  for (let [userId, userWs] of userClients.entries()) {
    if (userWs.readyState === WebSocket.OPEN) {
      // Find the most recent order for this user
      TaxiOrder.find({ user: userId, cancelled: false })
        .sort('-createdAt')
        .limit(1)
        .exec((err, orders) => {
          if (err) return console.error(err);
          if (orders.length === 0) return;
    
          let order = orders[0];
          let captainId = order.captain;
          let location = captainLocations.get(captainId);
    
          // If the location is known, send it to the user
          if (location) {
            userWs.send(JSON.stringify({ captainId: captainId, location: location }));
          }
        });
    }
  }
}, 10000);






module.exports = router;
