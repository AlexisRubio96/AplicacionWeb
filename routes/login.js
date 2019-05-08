const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const winston = require('winston');

router.get('/', (req, res) => {
    winston.info('login/GET' + 'Se entró a la pantalla de login');
    res.render('login', {message: req.flash('loginMessage')}) ;     
});

router.post('/', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));


module.exports = router;