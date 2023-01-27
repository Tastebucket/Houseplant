/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Plant = require('../models/plant')
require('dotenv').config()

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

///Index route
router.get('/', (req, res) => {
    // find all the fruits
    Plant.find({})
        .then(plants => { res.json({ plants: plants })})
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})





module.exports = router