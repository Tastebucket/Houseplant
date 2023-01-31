/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Sale = require('../models/sale')
const Plant = require('../models/plant')
require('dotenv').config()
const axios = require('axios')

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

/////////////////////////////
////      Routes         ////
/////////////////////////////

//Index route for sales on a plant
router.get('/:plantId', (req,res) =>{
    const { username, loggedIn, userId } = req.session
    // find all the plants
    const plantId = req.params.plantId
    Sale.find({plant: plantId })
        .populate('plant', 'name')
        .populate('seller', 'username')
        .then(sales => { 
            res.render('sale/index', { sales, username, loggedIn, userId })
        })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})

// Get route for new sale form
router.get('/new/:plantId', (req,res) => {
    res.render('sale/new', { ...req.session})
    })
///Create Route
router.post('/new/:plantId', (req,res) => {
    const plantId = req.params.plantId
    console.log(req.session.userId)
    req.body.seller = req.session.userId
    req.body.plant = plantId
    const newSale = req.body
    Sale.create(newSale)
        .then(sale =>{
            res.redirect(`/plants/${plantId}`)})
        .catch((error) => {
            console.log('the error', error);
                
            res.redirect(`/error?error=${error}`)
        })
    })

//////////////////////////////
//// Export Router        ////
//////////////////////////////

module.exports = router