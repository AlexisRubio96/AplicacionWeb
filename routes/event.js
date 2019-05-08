const { User, validateUser } = require('../models/user');
const {Event, validateEvent} = require('../models/event');
const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const router = express.Router();

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

router.post('/addEvent', async(req, res) => {
    console.log('Add event...');
    const {error} = validateEvent(req.body);
    if(error) return res.status(400).render('error', {error: 400, message: error.details[0].message});

    events = new Event({
        name: req.body.name,
        location: req.body.location,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd,
        description: req.body.description,
        organizer: req.body.organizer,
        //sprite: req.body.sprite,
        types: req.body.types
    });
    await events.save();
    console.log('Se guardo en mongo el evento');
    //**********Cambiar por la dirección del detalle del evento. EJS
    //return res.redirect('/detailedEvent');
    res.render('detailedEvent', {events}) ;    
});

router.get('/add', (req, res) => {
    res.render('createEvent.ejs', {
        user : req.user 
    });
    //res.render('createEvent', {message: req.flash('eventCreation')}) ;     
});

router.get('/name', (req, res) => {
    console.log(req.body.name);
    res.render('detailedEvent', {message: req.flash('eventDetail')}) ;     
});

router.get('/share', (req, res) => {
    console.log(req.body);
    res.render('sendEmail', {message: req.flash('eventDetail')}) ;     
});

router.post('/send', (req, res) => {
    //console.log(req.body); 
    const output = `
        <p> You have a new invitation to an event. </p>
        <h3> Event details. </h3>
        <ul>
            <p>  Message: ${req.body.message} </p>
        </ul>
    `;    
});



router.post('/name', async(req, res) => {
    console.log('Llegue a un evento en especifico');
    console.log(req.body.search);
    const events = await Event.findOne({ name: req.body.search });
    console.log(events);

    res.render('detailedEvent', {events}) ;     
});



router.get('/', (req, res) => {
    res.render('login', {message: req.flash('loginMessage')}) ;     
});


module.exports = router;