const {Movie, validate} = require('../models/movie');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Genre} = require('../models/genre');

router.get('/', async (req, res) => {
    res.send(await Movie.find().sort('name'));
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id)
                             .catch(e => {console.error('An error is occurred.', e)});
    
    if(!movie) return res.status(404).send('The movie with the given ID was not found on the system.');

    res.send(movie);
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId)
                             .catch(e => {console.error('An error is occurred.', e)})
    if(!genre) return res.status(400).send('The genre was not found on the system.');
    
    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    
    await movie.save()
               .catch(e => {console.error('An error is occurred.', e)});
    
    res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId)
                             .catch(e => {console.error('An error is occurred.', e)})
    if (!genre) return res.status(400).send('The genre was not found on the system.');
    
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate}, {new: true})
                             .catch(e => {console.error('An error is occurred.', e)});
    
    if(!movie) return res.status(404).send('The movie with the given ID was not found on the system.');

    res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)
                             .catch(e => {console.error('An error is occurred.', e)});

    if(!movie) return res.status(404).send('The movie with the given ID was not found on the system.');

    res.send(movie);
});

module.exports = router;