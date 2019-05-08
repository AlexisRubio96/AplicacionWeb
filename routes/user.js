const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/agregarEvento', (req, res) => {
    console.log('Agregar evento...');
    
    res.render('home', {message: req.flash('loginMessage')}) ;     
});

router.post('/updateEmail', async(req, res) => {
    console.log('Cambiar email');
    var emailCheck = req.user.local.email;
    var newEmail = req.body.newEmail;
    console.log(emailCheck)
    console.log(newEmail)
    console.log("paso");

    //const userUpdate = await User.findOne({"local.email": emailCheck});
    const userUpdate = await User.updateOne({"local.email" : emailCheck}, {"local.email": newEmail});
    //console.log(userUpdate.local.email);
    res.render('profile.ejs', {
        user : req.user 
    });   
});

router.post('/updatePassword', async(req, res) => {
    console.log('Cambiar Password');
    var emailCheck = req.user.local.email;
    var newPassword = req.body.newPass;
    var valPassword = req.body.valPass;
    console.log(emailCheck)
    console.log(newPassword)
    console.log(valPassword)
    if(newPassword = valPassword){
        console.log("paso");
        var pass = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8), null);

        
        const userUpdate = await User.updateOne({"local.email" : emailCheck}, {"local.password": pass});
        
        //console.log(userUpdate.local.password);
        res.render('profile.ejs', {
            user : req.user 
        });  
    }
});

router.post('/delete', async(req, res) => {
    console.log('Borrar Usuario');    
    var emailCheck = req.user.local.email;
    console.log(emailCheck)
    const userDel = await User.findOneAndDelete({"local.email" : emailCheck});
    
    if (!userDel) return res.status(404).send('Pokemon no encontrado.');
    res.render('home', {message: req.flash('loginMessage')}) ;       
});

module.exports = router;