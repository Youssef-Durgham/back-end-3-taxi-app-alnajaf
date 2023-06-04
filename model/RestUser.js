const mongoose = require("mongoose");
// create user schema and model
const RestUserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  picture: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    // required: true,
  },
  rating: Number,
  numOrders: Number,
  role: {
    type: String,
    require: true,
  },
  createdAt: { type: Date, default: Date.now },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  deliveryCostPerKilometer: {
    type: Number,
  },
});

module.exports = mongoose.model("RestUser", RestUserSchema);
