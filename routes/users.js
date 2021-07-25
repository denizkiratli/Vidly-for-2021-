const {User, validate} = require('../models/user');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

router.get('/me', auth, async (req, res) => {
    res.send(await User.findById(req.user._id).select('-password -_id -__v'));
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('The user already registered on the system.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10)); // or await bcrypt.hash(user.password, 10)

    await user.save()
              .catch(e => {console.error('An error is occurred.', e)});

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email',]));
});

module.exports = router;