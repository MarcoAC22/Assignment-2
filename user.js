const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');



// Setting up the schema
const User = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    email: { type: String },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }

});

// Setting up the passport plugin
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
