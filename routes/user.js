const { User, validateUser } = require('../models/user');
const {Event, validateEvent} = require('../models/event');
const auth = require('../middleware/auth');
const passport = require('passport');
const express = require('express');
const router = express.Router();

router.get('/editProfile', (req, res)=>{
    //Crear EJS
    res.render('editProfile');
});

router.put('/:number', async (req, res) => {
    const { error } = validate(req.body);
    if (error){
        winston.error('Entradas no válidas - PUT');
        return res.status(400).send(error.details[0].message);
    } 
    const number = parseInt(req.params.number);

    const pokemon = await Pokemon.findOneAndUpdate({ number }, {
        $set: {
            name: req.body.name,
            number: req.body.number,
            height: req.body.height,
            weight: req.body.weight,
            types: req.body.types,
            sprite: req.body.sprite
        }
    }, { new: true });
    
    if (!pokemon){
        winston.info('Pokémon no encontrado - PUT');
        return res.status(404).send('Pokemon no encontrado.');
    }else{
        winston.info('Pokémon encontrado y actualizado - PUT');
        return res.send(pokemon);
    }
});

router.get('/attendingEvents', async(req, res)=>{
    const pageSize = parseInt(req.query.pageSize) || 5;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const newEvent = await Event.findOne({organizer: req.params.organizer});
    if(!newEvent) return res.status(404).render('error', {error: 404, message: 'No se encontraron eventos.'});
    
    const events = await Event
        .find()
        .sort({dateStart: 1})
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize);
    
    res.render('myEvents', {events, pageNumber, pageSize, newEvent});
});




module.exports = router;