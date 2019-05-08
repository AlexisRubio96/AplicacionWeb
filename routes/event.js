const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const router = express.Router();

router.post('/name', (req, res) => {
    console.log('Llegue a un evento en especifico');
    console.log(req.body.search);
    res.render('home', {message: req.flash('loginMessage')}) ;     
});

router.get('/new', (req, res) => {
    res.render('createEvent', {message: req.flash('eventCreation')}) ;     
});

router.get('/', (req, res) => {
    res.render('login', {message: req.flash('loginMessage')}) ;     
});


module.exports = router;