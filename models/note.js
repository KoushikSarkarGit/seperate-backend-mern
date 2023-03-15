const mongoose = require('mongoose')
const { Schema } = mongoose;

const note = new Schema({

    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'

    },

    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Tag: {
        type: String,
        required: true
    },

    Date: {
        type: Date,
        default: Date.now
    }
});

const notemodel = mongoose.model('Notes', note);

module.exports = notemodel;