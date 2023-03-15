const express = require('express')
const jwt = require('jsonwebtoken');
const my_signature = process.env.REACT_APP_secret

const fetchuserdetails = async (req, res, next)=>{

    try {
        
    

    const vtoken = await req.header('token');

    if(!vtoken){
        return res.status(400).json({ error: 'Please get valid token' });
    }

    const data = await jwt.verify(vtoken, my_signature);
    req.id = data.id;
    // req.username = data.username

    next()
} catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'Please get valid token 2' });
}
}



module.exports = fetchuserdetails;