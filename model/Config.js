const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Config', ConfigSchema);
