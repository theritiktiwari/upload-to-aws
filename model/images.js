const mongoose = require('mongoose');
const { Schema } = mongoose;

// Declare the schema (how the image data will be stored)
const imageSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Image = mongoose.model('image', imageSchema);
module.exports = Image;