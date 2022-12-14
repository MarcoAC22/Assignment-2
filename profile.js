const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');



// Setting up the schema
const Profile = new mongoose.Schema({
    firstname: String,
    lastname: String, 
    image: String,
});

// Setting up the passport plugin
Profile.plugin(passportLocalMongoose);

module.exports = mongoose.model('Profile', Profile);
