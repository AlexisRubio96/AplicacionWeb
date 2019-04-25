// app/models/user.js
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const Joi = require('joi');

// define the schema for our user model
const userSchema = new mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = {
        //...
    }
    return Joi.validate(user, schema);
}

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
//module.exports = mongoose.model('User', userSchema);
exports.User = User;
exports.validate = validateUser;