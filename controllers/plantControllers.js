/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Plant = require('../models/plant')
const Sale = require('../models/sale')
require('dotenv').config()
const axios = require('axios')

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()


/////////////////////////////
////      Routes         ////
/////////////////////////////
///Index route
router.get('/', (req, res) => {
    const { username, loggedIn, userId } = req.session
    // find all the plants
    Plant.find({})
        .then(async plants => { 
            const options = {
                method: 'GET',
                url: `${process.env.API_URL_CAT}`,
                headers: {
                  'X-RapidAPI-Key': `${process.env.API_KEY}`,
                  'X-RapidAPI-Host': `${process.env.API_HOST}`
                }
            }
            const categoryCall = await axios(options)
            const categories = categoryCall.data
            console.log(categories)
            res.render('plants/index', { plants, categories, username, loggedIn, userId })
            })
                .catch(function (error) {
                    console.error(error);
        })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})
///Index route
router.get('/category/:categoryName', (req, res) => {
    const { username, loggedIn, userId } = req.session
    // find all the plants
    const category = req.params.categoryName
    console.log(category)
    Plant.find({category: `${category}`})
        .then(plants => { 
                    res.render('plants/index', { plants, username, loggedIn, userId })
                })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
    })
//Show route
router.get('/:id', (req, res) => {
    const id = req.params.id
    const { username, loggedIn, userId } = req.session
    console.log("This is the id", req.params.id)
    console.log('this is the session', req.session)
    // find the plant by its id
    Plant.findById(id)
        .then(plant => { 
            res.render('plants/show',  { plant, username, loggedIn, userId })
            // res.send( plants )
        })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////

module.exports = router