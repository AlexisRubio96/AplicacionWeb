const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const winston = require('winston');

router.get('/', (req, res) => {
    res.render('signup', {message: req.flash('signupMessage')}) ;     
});

router.post('/', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));


module.exports = router;