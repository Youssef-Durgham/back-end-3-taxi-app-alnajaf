let captainClients = new Map(); // {captainId: ws}
let userClients = new Map(); // {userId: ws}
let adminClients = []; // List of admin clients
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
// Check role to determine who is connecting (captain, user, or admin)
if (role === 'captain') {
  captainClients.set(id, ws);

  // Update location if provided
  if (payload.location) {
    ws.location = payload.location;

    // Notify all admin clients about this captain's location
    adminClients.forEach(adminWs => {
      if (adminWs.readyState === WebSocket.OPEN) {
        adminWs.send(JSON.stringify({ captainId: id, location: ws.location }));
      }
    });

    // Notify the main user and all passenger users with a recent order associated with this captain
    TaxiOrder.find({ captain: id, cancelled: false }).sort('-createdAt')
      .limit(1)
      .exec((err, orders) => {
        if (err) return console.error(err);
        if (orders.length === 0) return;

        let order = orders[0];

        // Send location to main user
        let userId = order.user;
        sendLocationToUser(userId, id, ws.location);

        // Send location to all passengers
        order.passengers.forEach(passenger => {
          sendLocationToUser(passenger.user, id, ws.location);
        });
      });
  }
} else if (role === 'user') {
  userClients.set(id, ws);
  ws.send(JSON.stringify({ message: 'User added successfully!' }));

  // Find any active (non-cancelled) orders for this user
  TaxiOrder.find({ user: id, cancelled: false }).sort('-createdAt')
    .limit(1)
    .exec((err, orders) => {
      if (err) return console.error(err);
      if (orders.length === 0) return;

      let order = orders[0];
      let captainId = order.captain;

      // Find the captain's WebSocket
      let captainWs = captainClients.get(captainId.toString());

      // If the captain's WebSocket is open and the location is known, send the location to the user
      if (captainWs && captainWs.readyState === WebSocket.OPEN && captainWs.location) {
        ws.send(JSON.stringify({ captainId: captainId, location: captainWs.location }));
      }
    });

} else if (role === 'admin') {
  adminClients.push(ws);

  // Send locations of all connected captains to the admin
  let locations = [];
  for (let [captainId, captainWs] of captainClients.entries()) {
    if (captainWs.readyState === WebSocket.OPEN && captainWs.location) {
      locations.push({ captainId: captainId, location: captainWs.location });
    }
  }
  ws.send(JSON.stringify(locations));
}});

  ws.on('close', () => {
      for (let [captainId, captainWs] of captainClients.entries()) {
          if (ws === captainWs) {
              captainClients.delete(captainId);
          }
      }

      for (let [userId, userWs] of userClients.entries()) {
          if (ws === userWs) {
              userClients.delete(userId);
          }
      }

      let adminIndex = adminClients.indexOf(ws);
      if (adminIndex !== -1) {
          adminClients.splice(adminIndex, 1);
      }
  });
});

// Helper function to send location to a user
function sendLocationToUser(userId, captainId, location) {
  let userWs = userClients.get(userId.toString());

  // If the user's WebSocket is open, send the captain's location to the user
  if (userWs && userWs.readyState === WebSocket.OPEN) {
    userWs.send(JSON.stringify({ captainId: captainId, location: location }));
  } else {
    // The user's WebSocket is not open, so do nothing
  }
}
