const Joi = require('joi-oid');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlenght: 2,
        maxlenght: 20
    },
    email: {
        type:String,
        unique: true,
        required: true,
        minlenght: 5,
        maxlenght: 30
    },
    password: {
        type: String,
        required: true,
        minlenght: 8,
        maxlenght: 255
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(20).required(),
        email: Joi.string().min(5).max(30).required().email(),
        password: Joi.string().min(8).max(255).required()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;