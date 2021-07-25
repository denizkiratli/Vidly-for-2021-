const {Genre, validate} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    res.send(await Genre.find().sort('name'));
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id)
                             .catch(e => {console.error('An error is occurred.', e)});
    
    if(!genre) return res.status(404).send('The genre with the given ID was not found on the system.');

    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const genre = new Genre({name: req.body.name});
    await genre.save()
               .catch(e => {console.error('An error is occurred.', e)});
    
    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true})
                             .catch(e => {console.error('An error is occurred.', e)});
    
    if(!genre) return res.status(404).send('The genre with the given ID was not found on the system.');

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
                             .catch(e => {console.error('An error is occurred.', e)});

    if(!genre) return res.status(404).send('The genre with the given ID was not found on the system.');

    res.send(genre);
});

module.exports = router;