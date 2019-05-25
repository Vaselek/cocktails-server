const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CocktailSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    receipt: {
        type: String,
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
        enum: [false, true]
    },
    ingredients: [{
        name: String,
        quantity: String
    }],
});


const Cocktail = mongoose.model('Cocktail', CocktailSchema);

module.exports = Cocktail;