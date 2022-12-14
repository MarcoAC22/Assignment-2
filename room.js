const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');



// Setting up the schema
const Room = new mongoose.Schema({
    title: String,
    description: String,
});

// Setting up the passport plugin
Room.plugin(passportLocalMongoose);

module.exports = mongoose.model('Room', Room);
