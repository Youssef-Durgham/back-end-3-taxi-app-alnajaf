const mongoose = require('mongoose');

const CaptainSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  }],
});

module.exports = mongoose.model('Captain', CaptainSchema);
