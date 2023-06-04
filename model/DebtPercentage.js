const mongoose = require('mongoose');

const DebtPercentageSchema = new mongoose.Schema({
  percentage: {
    type: Number,
    required: true,
    default: 20,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DebtPercentage', DebtPercentageSchema);
