const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  rated: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['not_paid', 'waiting', 'accepted'],
    default: 'not_paid',
  },
  cancelled: {
    type: Boolean,
    default: false
  },
});

const taxiOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['not_paid', 'waiting', 'accepted'],
    default: 'not_paid',
  },
  taxiType: {
    type: String,
  },
  genderType: {
    type: String,
  },
  typeOfWork: {
    type: String,
    enum: ['morning', 'evening'],
    required: true,
  },
  daysOfWork: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  }],
  status: {
    type: String,
    enum: ['created', 'accepted'],
    default: 'created',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: {
    type: Date,
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
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
  destination: {
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
  ordertype: {
    type: String,
    enum: ['normal', 'vip'],
  },
  passengers: [PassengerSchema],
  invitePhone: {
    type: String,
  },
  discount: {
    type: Number,
    default: 0,
  },
  cost: {
    type: Number,
  },
  payments: [{
    month: { type: Date }, // we will use the start of each month as identifier
    paymentDate: { type: Date, default: Date.now }, // This field records the exact date and time of the payment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    status: {
      type: String,
      enum: ['not_paid', 'waiting', 'accepted'],
      default: 'not_paid',
    },
}],
  cancelled: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model('TaxiOrder', taxiOrderSchema);
module.exports.taxiOrderSchema = taxiOrderSchema;
