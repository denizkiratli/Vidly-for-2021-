const {Rental, validate} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    res.send(await Rental.find().sort('-dateOut'));
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id)
                               .catch(e => {console.log('An error is occurred.'), e});

    if(!rental) return res.status(404).send('The rental with the given ID was not found on the system.');

    res.send(rental);
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('The customer was not found on the system.');
    
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('The movie was not found on the system.');

    if(movie.numberInStock === 0) return res.status(400).send('The movie is not in stock.');

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    saveRentals(rental, movie, res);

    async function saveRentals (rental, movie, res) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await rental.save();
    
            movie.numberInStock--;
            movie.save();
            
            res.send(rental);
        }
        catch(e) {
            await session.abortTransaction();
            console.error('An error is occurred.', e);
        }
        finally {
            session.endSession();
        }
    }
});

router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('The customer was not found on the system.');
    
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('The movie was not found on the system.');
    
    const rental = await Rental.findByIdAndUpdate(req.params.id, {

    })
                               .catch(e => {console.log('An error is occurred.'), e});

    if(!rental) return res.status(404).send('The rental with the given ID was not found on the system.');
});

router.delete('/:id', async (req, res) => {
    
});

module.exports = router;