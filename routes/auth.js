const express = require('express')
const router = express.Router()
const Usermodel = require('../models/user')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuserdetails = require('../middlewares/fetchuserdetails');
const my_signature = 'koushiksarkar2001'


//signup endpoint

router.post('/auth',
  // Doing validation

  body('username').isLength({ min: 3 }).isString(),
  body('email').isEmail(),
  body('password', 'minimum password length should be 5').isLength({ min: 6}),

  async (req, res) => {
    let success = false;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({success,  error: "please fill the form in instructed format" });
    }

    try {
      let useremail = await Usermodel.findOne({ email: req.body.email })
      if (useremail) {
        return res.status(400).json({success,  error: 'A user with this ID already exist. Please enter another email' });
      }

      let salt = await bcrypt.genSalt(10);
      let authtoken = await bcrypt.hash(req.body.password, salt)

      let newuser = await Usermodel.create({
        username: req.body.username,
        email: req.body.email,
        // password: req.body.password
        password: authtoken
      });

      let data = { id: newuser.id }
      let jsontoken = jwt.sign(data, my_signature)
      // console.log(jsontoken)
      success= true;
      return res.status(200).json({success, jsontoken})

    } catch (error) {

      console.log(error)
      return res.status(200).json({ error: 'something went wrong' })
    }

  }

)

//login endpoint

router.post('/login',

  body('email').isEmail(),
  body('password', 'minimum password length should be 5').isLength({ min: 5 }),
  async (req, res) => {

    let success = false;

    try {
      let useremail = await Usermodel.findOne({ email: req.body.email })
      if (!useremail) {
        return res.status(400).json({success, error: 'Please login with current credentials' });
      }

      let { password, email } = await req.body;
      let curuser = await Usermodel.findOne({ email });


      let valid = await bcrypt.compare(password, curuser.password)

      if (!valid) {
        return res.status(400).json({success, error: 'Please login with correct credentials' });
      }



      let data = { id: curuser.id }
      let jsontoken = jwt.sign(data, my_signature)
      // console.log(curuser.username)
      success = true;
      return res.status(200).json({ success, jsontoken , user: curuser.username })

    } catch (error) {

      console.log(error)
      return res.status(200).json({success, error: 'something went wrong' })
    }




  })




router.post('/getuser',

fetchuserdetails,
  async (req, res) => {

    try {
      const userid = await req.id;
      const gotusername = await req.username
      const finaluser = await Usermodel.findById(userid).select(-'password')
      res.status(200).json({ token:  userid, user: gotusername});


    } catch (error) {

      console.log(error)
      return res.status(200).json({ error: 'something went wrong' })
    }




  })

module.exports = router;