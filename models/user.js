const mongoose = require('mongoose')
const { Schema } = mongoose;

const user = new Schema({
    username: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    
    date:{
        type: Date,
        default: Date.now
    }
});

const usermodel = mongoose.model('Users', user);

module.exports = usermodel;