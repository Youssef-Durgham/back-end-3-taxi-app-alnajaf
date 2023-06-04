const mongoose = require('mongoose');

const bannerAdSchema = new mongoose.Schema({
    imageUrl: String,
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('BannerAd', bannerAdSchema);