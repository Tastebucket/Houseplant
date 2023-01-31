/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Plant = require('../models/plant')
require('dotenv').config()
const axios = require('axios')

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

///Index route
router.get('/', (req, res) => {
    const { username, loggedIn, userId } = req.session
    // find all the fruits
    Plant.find({})
        .then(plants => { 
            res.render('plants/index', { plants, username, loggedIn, userId })
        })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})





module.exports = router