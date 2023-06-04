var mongoose = require('mongoose');


const foodTypeSchema = new mongoose.Schema({
    name: String,
    picture: String,
  });

module.exports = mongoose.model("FoodType", foodTypeSchema);
  