const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    registration_time: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
