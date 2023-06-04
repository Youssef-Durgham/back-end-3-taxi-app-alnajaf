const mongoose = require('mongoose');

const PriceAdjustmentSchema = new mongoose.Schema({
  multiplier: {
    type: Number,
  },
  days1To3Reduction: {
    type: Number,
  },
  days6To7Increase: {
    type: Number,
  },
});

module.exports = mongoose.model('PriceAdjustment', PriceAdjustmentSchema);
