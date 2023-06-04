const mongoose = require('mongoose');

const NotificationTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    default: null,
  },
});

module.exports = mongoose.model('NotificationToken', NotificationTokenSchema);
