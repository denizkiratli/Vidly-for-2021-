const Joi = require('joi-oid');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlenght: 2,
        maxlenght: 20
    },
    phone: {
        type: String,
        required: true,
        minlenght: 3,
        maxlenght: 10
    },
    isGold: {
        type: Boolean,
        default: false
    }
}));

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(20).required(),
        phone: Joi.string().min(3).max(10).required(),
        isGold: Joi.boolean()
    });

    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;