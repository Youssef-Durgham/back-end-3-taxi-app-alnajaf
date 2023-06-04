const mongoose = require('mongoose');

const SuggestionPlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

SuggestionPlaceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('SuggestionPlace', SuggestionPlaceSchema);
