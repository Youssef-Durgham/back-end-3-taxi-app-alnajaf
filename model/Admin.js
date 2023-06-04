const mongoose = require('mongoose');
// create user schema and model
const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    picture: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    phonenumber: {
        type: Number,
    },
    password: {
        type: String
        // required: true,
    },
    method: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        require: true
    }
    
});

module.exports = mongoose.model('Admin', AdminSchema);