var mongoose = require('mongoose');


var dealSchema = new mongoose.Schema({
    restaurantId: String,
    dealname: String,
    price: Number,
    foodType: { type: mongoose.Types.ObjectId, ref: 'FoodType' },
    details: String,
    orders: { type: Number, default: 0 },
    image: String,


});


var Deal = mongoose.model('Deal', dealSchema);


module.exports = {
    Deal: Deal
};