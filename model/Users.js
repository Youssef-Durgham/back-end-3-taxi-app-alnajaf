const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  number: {
    type: String,
  },
  name: {
    type: String,
  },
  word: {
    type: String,
  },
  model: {
    type: String,
  },
  color: {
    type: String,
  },
  region: {
    type: String,
  }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    default: 0, // 0 means no discount
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  type: {
    type: String,
    enum: ['student', 'employee', 'captain'],
    default: 'captain'
  },
  deviceToken: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  messages: [{
    text: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
  }],  
  points: {
    type: Number,
    default: 0,
  },
  car: CarSchema,
  person: {
    type: Number,
    default: 0,
  },
  referrals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  }],
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'captain', 'admin'],
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    value: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  captainprofile: {
    type: String,
  },
  debt: {
    type: Number,
    default: 0,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  personcount: {
    type: Number,
  },
  birthdate: {
    type: Date,
  },
  documents: {
    type: Object,
    default: {},
  },
  photoUrl: {
    type: String,
  },
  isTwoWay: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.index({ location: "2dsphere" });
module.exports = mongoose.model('Users', UserSchema);
