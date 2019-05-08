const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const router = express.Router();

router.post('/name', (req, res) => {
    console.log(req.body.search);
    res.render('home', {message: req.flash('signupMessage')}) ;     
});

router.get('/', (req, res) => {
    res.render('signup', {message: req.flash('signupMessage')}) ;     
});


module.exports = router;