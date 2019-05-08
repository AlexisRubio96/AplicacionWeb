const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const { User, validateUser} = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //_________SIGNUP_____________________
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        //usernameField : 'username',
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        process.nextTick(function() {

        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err){
                return done(err);
            }
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                var newUser            = new User();
               // newUser.local.username = username;
                newUser.local.email    = email;
                newUser.local.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);    //Encripta contraseña

                console.log('LALALALALALALALA' + email + password);
                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    
    //_________LOGIN_____________________
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    async function(req, email, password, done) { 

        //Prof
        //const { error } = validateLogin(req.body);
        //if (error) return done(error.details[0].message);

        let user = await User.findOne({ 'local.email' :  email });
        if (!user) return done(null, false, { message: 'User is not signed up.'});

        const validPassword = await bcrypt.compare(password, user.local.password);
        if (!validPassword) return done(null, false, { message: 'Incorrect Pasword.'});

        return done(null, user);
        //

    }));

};