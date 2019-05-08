const express = require('express');
const passport = require('passport');
const router = express.Router();

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

router.get('/', (req, res) => {
    res.render('createEvent') ;       //Aqui va 'home'
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/') ;       
});

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
        user : req.user 
    });
});

module.exports = router;
