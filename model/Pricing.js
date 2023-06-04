const mongoose = require('mongoose');

const PricingSchema = new mongoose.Schema({
    startRange: {
      type: Number,
      required: true,
    },
    endRange: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
  });
  
  module.exports = mongoose.model('Pricing', PricingSchema);
  