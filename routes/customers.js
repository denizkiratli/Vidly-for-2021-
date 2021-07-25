const {Customer, validate} = require('../models/customer');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    res.send(await Customer.find().sort('name'));
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
                                   .catch(e => {console.error('An error is occurred.', e)});
    
    if(!customer) return res.status(404).send('The customer with the given ID was not found on the system.');

    res.send(customer);
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone
    });
    await customer.save()
                  .catch(e => {console.error('An error is occurred.', e)});
    
    res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold}, {new: true})
                                   .catch(e => {console.error('An error is occurred.', e)});
    
    if(!customer) return res.status(404).send('The customer with the given ID was not found on the system.');

    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
                                   .catch(e => {console.error('An error is occurred.', e)});

    if(!customer) return res.status(404).send('The customer with the given ID was not found on the system.');

    res.send(customer);
});

module.exports = router;