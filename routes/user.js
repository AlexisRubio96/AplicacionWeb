const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const winston = require('winston');

router.get('/agregarEvento', (req, res) => {
    winston.info('Agregar evento...');
    
    res.render('home', {message: req.flash('loginMessage')}) ;     
});

router.post('/updateEmail', async(req, res) => {
    winston.info('Cambiar email');
    var emailCheck = req.user.local.email;
    var newEmail = req.body.newEmail;
    winston.info(emailCheck)
    winston.info(newEmail)

    const user = await User.findOne({"local.email" : newEmail});
    
    if (!user) {
        const userUpdate = await User.updateOne({"local.email" : emailCheck}, {"local.email": newEmail});
        res.render('profile.ejs', {
            user : req.user 
        }); 
    }else{
        winston.error('POST/updateEmail' + 'Email is alredy taken');
        return res.status(404).send('Email is alredy taken');
    }
    //console.log("paso");
    //const userUpdate = await User.findOne({"local.email": emailCheck});
    //console.log(userUpdate.local.email);
      
});

router.post('/updatePassword', async(req, res) => {
    winston.info('Cambiar Password');
    var emailCheck = req.user.local.email;
    var newPassword = req.body.newPass;
    var valPassword = req.body.valPass;
    winston.info(emailCheck)
    winston.info(newPassword)
    winston.info(valPassword)
    if(newPassword = valPassword){
        //console.log("paso");
        var pass = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8), null);

        
        const userUpdate = await User.updateOne({"local.email" : emailCheck}, {"local.password": pass});
        
        //console.log(userUpdate.local.password);
        res.render('profile.ejs', {
            user : req.user 
        });  
    }
});

router.post('/delete', async(req, res) => {
    winston.info('Borrar Usuario');    
    var emailCheck = req.user.local.email;
    winston.info(emailCheck)
    const userDel = await User.findOneAndDelete({"local.email" : emailCheck});
    
    if (!userDel) {
        winston.error('POST/delete' + 'Usuario no encontrado');
        return res.status(404).send('Usuario no encontrado');
    }
    
    res.render('home', {message: req.flash('loginMessage')}) ;       
});

module.exports = router;