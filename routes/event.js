<<<<<<< HEAD
=======
const { User, validateUser } = require('../models/user');
>>>>>>> 9127d0d471895af0d6750b70a7b6184943217107
const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const router = express.Router();

router.post('/name', (req, res) => {
<<<<<<< HEAD
    console.log(req.body.search);
    res.render('home', {message: req.flash('signupMessage')}) ;     
});

router.get('/', (req, res) => {
    res.render('signup', {message: req.flash('signupMessage')}) ;     
=======
    console.log('Llegue a un evento en especifico');
    console.log(req.body.search);
    res.render('home', {message: req.flash('loginMessage')}) ;     
});

router.get('/new', (req, res) => {
    res.render('createEvent', {message: req.flash('eventCreation')}) ;     
});

router.get('/', (req, res) => {
    res.render('login', {message: req.flash('loginMessage')}) ;     
>>>>>>> 9127d0d471895af0d6750b70a7b6184943217107
});


module.exports = router;