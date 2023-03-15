const mongoose = require('mongoose');
require('dotenv').config()



const mongouri = process.env.mongouri;

const connectToMongo = ()=>{

    try {
        mongoose.connect(mongouri, ()=>{
            console.log('connected to mongodb')
            // console.log(process.env.REACT_APP_mongouri)
        })
    } catch (error) {
        console.log(error);
    }

   
}

module.exports = connectToMongo;