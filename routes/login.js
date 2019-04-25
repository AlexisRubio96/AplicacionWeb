const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('login', {message: req.flash('loginMessage')}) ;     
});

router.post('/', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));


module.exports = router;