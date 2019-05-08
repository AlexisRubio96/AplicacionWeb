const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const router = express.Router();

router.get('/agregarEvento', (req, res) => {
    console.log('Agregar evento...');
    
    res.render('home', {message: req.flash('loginMessage')}) ;     
});



module.exports = router;