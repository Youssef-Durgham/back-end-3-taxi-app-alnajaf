var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FoodType = require('./FoodType');

var resturantSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    picture: String,
    rating: Number,
  numOrders: Number,
  createdAt: { type: Date, default: Date.now },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  deliveryCostPerKilometer: {
    type: Number,
  },
    
});

const sizesSchema = new Schema({
  size: {
      type: String,
      required: true
  },
  price: {
      type: Number,
      required: true
  },
  additions: [{
      name: {
          type: String,
          required: true
      },
      price: {
          type: Number,
          required: true
      }
  }]
});


const dealSchema = new mongoose.Schema({
  resturantid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resturant",
  },
  dealname: {
      type: String,
      required: true,
  },
  price: {
      type: Number,
      required: true,
  },
  foodType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodType",
  },
  details: {
      type: String,
  },
  restname: {
      type: String,
  },
  image: {
      type: String,
  },
   hasAdditions: {
        type: Boolean,
        default: false
    },
    additions: [{
        name: {
            type: String
        },
        price: {
            type: Number
        }
    }],
    hasSizes: {
        type: Boolean,
        default: false
    },
    sizes: [{
        size: {
            type: String
        },
        price: {
            type: Number
        },
        additions: [{
            name: {
                type: String
            },
            price: {
                type: Number
            }
        }]
    }],
  isFreeAdditions: {
      type: Boolean,
      
  },
});








var Resturant = mongoose.model('Resturant', resturantSchema);
var Deal = mongoose.model('Deal', dealSchema);

module.exports = {
    Resturant: Resturant,
    Deal: Deal
};