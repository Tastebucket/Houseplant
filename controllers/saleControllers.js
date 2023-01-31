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

router.get('/new/:plantId', (req,res) => {
    const plantId = req.params.plantId
    console.log('this is the session', req.session)
    req.body.seller = req.session.userId
    req.body.plant = plantId
    const newSale = req.body
    console.log(newSale)
    // Sale.create(newSale)
    //     .then(sale =>{
    //         res.send(sale)})
    //     .catch((error) => {
    //         console.log('the error', error);
                
    //         res.redirect(`/error?error=${error}`)
    //     })
    res.render('sale/new', {plantId, ...req.session})
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