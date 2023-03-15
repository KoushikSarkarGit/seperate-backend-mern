const express = require('express')
const connect = require('./db/db')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
connect();

let app = express();
let port = process.env.BACKEND_PORT || 27017;

app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/auth'))
app.use('/api', require('./routes/noteroute'))




app.listen(port, () => {
    
  console.log(`Example app listening on port ${port}`)
})


