const { User, validateUser } = require('../models/user');
const {Event, validateEvent} = require('../models/event');
const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const router = express.Router();

router.post('/addEvent', async(req, res) => {
    console.log('Add event...');
    const {error} = validateEvent(req.body);
    if(error) return res.status(400).render('error', {error: 400, message: error.details[0].message});

    event = new Event({
        name: req.body.name,
        location: req.body.location,
        dateStart: req.body.dateStart,
        dateEnd: req.body.dateEnd,
        description: req.body.description,
        organizer: req.body.organizer,
        //sprite: req.body.sprite,
        types: req.body.types
    });
    await event.save();
    console.log('Se guardo en mongo el evento');
    //**********Cambiar por la dirección del detalle del evento. EJS
    return res.redirect('/detailedEvent');    
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



router.post('/name', async(req, res) => {
    console.log('Llegue a un evento en especifico');
    console.log(req.body.search);

    const pageSize = parseInt(req.query.pageSize) || 5;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const eventNuevo = await Event.findOne({name: req.body.search});

    if(!eventNuevo) return res.status(404).render('error', {error: 404, message: 'No se encontraron eventos.'})

    const events = new Event
        .find()
        .sort({dateStart: 1})
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize);

    console.log('Eventos con nombre:' + req.body.search);
    console.log(events);
    res.render('eventDetailed', {events, pageNumber, pageSize, eventNuevo}) ;     
});



router.get('/', (req, res) => {
    res.render('login', {message: req.flash('loginMessage')}) ;     
});


module.exports = router;