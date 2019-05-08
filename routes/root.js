const express = require('express');
const passport = require('passport');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const winston = require('winston');

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        winston.info('isLoggedIn' + 'El usuario se autentificó de manera correcta');
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

router.get('/', (req, res) => {
    winston.info('Se accedió a la página de inicio');
    res.render('home') ;       //Aqui va 'home'
});

router.get('/homeUser', isLoggedIn, function(req, res) {
    winston.info('Se accedió a la página de inicio cuando estaba loggeado');
    res.render('homeUser.ejs', {
        user : req.user 
    });
});

router.get('/logout', (req, res) => {
    winston.info('Salió de sesión');
    req.logout();
    res.redirect('/') ;       
});

router.get('/profile', isLoggedIn, function(req, res) {
    winston.info('Accedió a su perfil');
    res.render('profile.ejs', {
        user : req.user 
    });
});

module.exports = router;
