const mongoose = require("mongoose");

// Set up the PromoCode model
const PromoCodeSchema = new mongoose.Schema({
    code: String,
    discount: Number,
    restaurantIds: [Number], // Modify this field to track an array of restaurant IDs that the promo code can be used at
    validForAll: Boolean, // Add this field to track whether the promo code is valid for all restaurants
    expireAt: Date,
  });
  
  module.exports = mongoose.model("PromoCode", PromoCodeSchema);