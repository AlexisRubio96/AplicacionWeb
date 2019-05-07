// app/models/user.js
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const Joi = require('joi');
const eventype = require("./types");

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        get: value => value.charAt(0).toUpperCase()+value.slice(1),
        set: value => value.toLowerCase()
    },
    location: {
        type: String,
        required: true,
        min: 1
    },
    dateStart: {
        type: Date,
        required: true
    },
    dateEnd: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    organizer:{
        type: String,
        required: true
    },
    sprite:{
        type: String,
        required: true
    }
}, { toJSON: { getters: true }});

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
    },
    events: [eventSchema]
}, { toJSON: { getters: true } });

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = {
        local: Joi.string().required().trim(),
        facebook: Joi.string().trim(),
        twitter: Joi.string().trim(),
        google: Joi.string().trim(),
        events: Joi.array().items(
            Joi.object({
                name: Joi.string().required().trim(),
                location: Joi.string().required().trim(),
                dateStart: Joi.date().required(),
                dateEnd: Joi.date().required(),
                description: Joi.date().required(),
                organizer: Joi.string().required().trim(),
                sprite: Joi.string().required()
            })
        )
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