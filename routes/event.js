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

router.post('/:name', (req, res) => {
    console.log('Llegue a un evento en especifico');
    console.log(req.body.search);
    res.render('detailedEvent', {message: req.flash('loginMessage')}) ;     
});


router.get('/new', (req, res) => {
    //Crear EJS y redirigir a /event/addEvent
    res.render('createEvent', {message: req.flash('eventCreation')}) ;     
});

//En el ejs se define un botón con referencia a <a href="/attending/<%= i.organizer %>">
router.get('/attending/:organizer', async(req, res)=>{
    const pageSize = parseInt(req.query.pageSize) || 5;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const attendingEvents = await Event.findOne({organizer: req.params.organizer});

    if(!newEvent) return res.status(404).render('error', {error: 404, message: 'No se encontraron eventos.'});

    const events = await Event
        .find()
        .sort({dateStart: 1})
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize);
    //Crear EJS
    res.render('attendingEvents', {events, pageNumber, pageSize, attendingEvents});
});

//En el ejs se define un botón con referencia a <a href="/invited/<%= i.organizer %>">
router.get('/invited/:organizer', async(req, res)=>{
    const pageSize = parseInt(req.query.pageSize) || 5;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const invitedEvents = await Event.findOne({organizer: req.params.organizer});

    if(!newEvent) return res.status(404).render('error', {error: 404, message: 'No se encontraron eventos.'});

    const events = await Event
        .find()
        .sort({dateStart: 1})
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize);
    //Crear EJS
    res.render('invitedEvents', {events, pageNumber, pageSize, invitedEvents});
});

//En el ejs se define un botón con referencia a <a href="/event/<%= i.organizer %>">
router.get('/:organizer', async(req, res)=>{
    const pageSize = parseInt(req.query.pageSize) || 5;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const newEvent = await Event.findOne({organizer: req.params.organizer});

    if(!newEvent) return res.status(404).render('error', {error: 404, message: 'No se encontraron eventos.'});
    
    const events = await Event
        .find()
        .sort({dateStart: 1})
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize);
    //Crear EJS
    res.render('myEvents', {events, pageNumber, pageSize, newEvent});
});

router.get('/', (req, res) => {
    res.render('login', {message: req.flash('loginMessage')}) ;     
});


module.exports = router;