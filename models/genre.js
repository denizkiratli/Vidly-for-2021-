const Joi = require('joi-oid');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlenght: 3,
        maxlenght: 20
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate  = validateGenre;
exports.genreSchema = genreSchema;