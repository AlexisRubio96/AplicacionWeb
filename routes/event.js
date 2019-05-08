const { User, validateUser } = require('../models/user');
const {Event, validateEvent} = require('../models/event');
const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const winston = require('winston');

const nodemailer = require('nodemailer');
const exphbs = require('express-handlebars');

const mailer = nodemailer.createTransport({
    from: 'no-reply@example.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'gmail.user@gmail.com',
        pass: 'userpass'
    }
});

router.post('/addEvent', async(req, res) => {
    winston.info('Add event...');
    const {error} = validateEvent(req.body);
    if(error){
        winston.error(error.details[0].message);
        return res.status(400).render('error', {error: 400, message: error.details[0].message});
    } 
    
    const emailAdd = req.user.local.email;

    const events = new Event({
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
    winston.info(emailAdd);
    winston.info(events);

    //Asscoicate event with name
    const userUpdate = await User.updateOne({"local.email" : emailAdd}, { $push: {myEvents: events} });
    winston.info('Se guardo en mongo el evento, Por: ' + req.user.local.email);
    winston.info(req.user);
    //**********Cambiar por la dirección del detalle del evento. EJS
    //return res.redirect('/detailedEvent');
    res.render('detailedEvent.ejs', {
        user : req.user,
        events : events
    });   
});

router.get('/add', (req, res) => {
    res.render('createEvent.ejs', {
        user : req.user 
    });
    //res.render('createEvent', {message: req.flash('eventCreation')}) ;     
});

router.get('/name', (req, res) => {
    winston.info('GET/name' + req.body.name);
    res.render('detailedEvent', {message: req.flash('eventDetail')}) ;
});


//Para cuando se ha inciado sesión
router.get('/nameUser', (req, res) => {
    winston.info('GET/nameUser' + req.body.name);    
    res.render('detailedEventUser.ejs', {
        user : req.user, 
        event : req.event
    });  
});

router.post('/share', (req, res) => {
    winston.info('Enviar invitación a este evento:');
    winston.info('POST/share' + req.user);
    winston.info('POST/share' + req.event);
    //console.log(req.body.eventName)
    res.render('sendEmail', {message: req.flash('eventDetail')}) ;  
    // res.render('sendEmail.ejs', {
    //     //events : req.events 
    //     event : req.event
    // });   
});

router.post('/send', (req, res) => {
    winston.info('POST/send' + req.body); 
    const output = `
        <p> You have a new invitation to an event. </p>
        <h3> Event details. </h3>
        <ul>
            <p>  Message: ${req.body.message} </p>
        </ul>
    `;
    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'netocervantes.spam@gmail.com',
        pass: 'CucharaA21*'
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"InviteUs!" <netocervantes.spam@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: 'InviteUs! Invitation', // Subject line
      text: 'IT works', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          winston.error('POST/send' + error);
          return console.log(error);
      }
      winston.info('Message sent: %s', info.messageId);   
      winston.info('Email has been sent');
  });  
  
  res.render('home', {message: req.flash('eventDetail')}) ;
});

router.post('/assist', (req, res) => {
    winston.info('POST/assist' + 'Llegue a un evento en especifico');
    winston.info('POST/assist' + "user " + req.user);
    winston.info('POST/assist' + "Event " + req.event);

    winston.info('POST/assist' + "Element " + req.body.name);

    /**
    res.render('homeUser.ejs', {
        user : req.user, 
    });  */    
});

router.post('/name', async(req, res) => {
    winston.info('POST/name' + 'Llegue a un evento en especifico');
    winston.info('POST/name' + req.body.event);
    const events = await Event.findOne({ name: req.body.search });
    winston.info('POST/name' + events);

    res.render('detailedEvent', {events}) ;     
});

router.post('/nameUser', async (req, res) => {  
    const event = await Event.findOne({ name: req.body.search });  
    res.render('detailedEventUser.ejs', {
        user : req.user, 
        event : event
    });  
});


router.get('/', (req, res) => {
    res.render('login', {message: req.flash('loginMessage')}) ;     
});


module.exports = router;