const mongoose = require("mongoose");
const shortid = require('shortid');

// Set up the Order model
const OrderSchema = new mongoose.Schema({
  restaurantId: String,
  userId: String,
  status: String,
  previousStatus: String,
  dishes: [
    {
      dish: {
        type: Object,
      },
      quantity: Number,
      selectSize: [{
        type: Object,
        default: []
      }],
      selectedAddOns: [{
        type: Object,
        default: []
      }],
      notes: {
        type: String,
        default: ""
      }
    },
  ],
  promoCode: String,
  startprice: Number,
  finalPrice: Number,
  notes: String, // Add this field to the model
  discount: Number,
  deliveryCost: Number,
  distance: Number,
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  email: String,
  phone: Number,
  fullname: String,
  company: String,
  orderId: { type: String, default: shortid.generate, unique: true },
});

module.exports = mongoose.model("Order", OrderSchema);
