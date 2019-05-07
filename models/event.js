const mongoose = require('mongoose');
const eventypes = require('./types');
const Joi = require('joi');

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
    opciones: [{
        
    }],
    sprite:{
        type: String,
        required: true
    },
    types: {
        type: [{
            type: String,
            enum: eventypes,
            set: value => value.toLowerCase(), 
        }],
        min: 1,
        get : v => v.map(value => value.charAt(0).toUpperCase()+value.slice(1))
    }
}, { toJSON: { getters: true }}); // Si quieren que sus getters funcionen en JSON hay que 
//agregar el toJSON, si quieren que funcionen en objetos hay que agregar toObject

const Event = mongoose.model('Event', eventSchema);

function validateEvent(event){
    const schema = {
        name: Joi.string().required().trim(),
        location: Joi.string().required().trim(),
        dateStart: Joi.date().required(),
        dateEnd: Joi.date().required(),
        description: Joi.date().required(),
        organizer: Joi.string().required().trim(),
        sprite: Joi.string().required(),
        types: Joi.array().required().min(1)
    }
    return Joi.validate(event, schema);
}

exports.Event = Event;
exports.validate = validateEvent;