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
            res.redirect(`/sale/${plantId}`)})
        .catch((error) => {
            console.log('the error', error);
                
            res.redirect(`/error?error=${error}`)
        })
    })

// GET route
// User specific shows user's sales
router.get('/mine', (req, res) => {
    // save title for views page
    const title = req.session.username
    // find fruits by ownership
    Sale.find({ seller: req.session.userId })
        .populate('seller', 'username')
        .then(sales => {
            // if found, display the fruits
            res.render('sale/index', { sales, title, ...req.session })
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})
//GET -> edit route
router.get('/edit/:id', (req,res) => {
    const saleId = req.params.id
    Sale.findById(saleId)
        .then(sale => {
            res.render('sale/edit', {sale, ...req.session})
        })
        .catch(err=> {
            res.redirect(`/error?error=${err}`)
        })
})


// PUT route
// Update -> updates a specific sale(only if the seller is updating)
router.put('/:id', (req, res) => {
    const id = req.params.id
    Sale.findById(id)
        .then(sale => {
            // if the selleer is the person who is logged in
            if (sale.seller == req.session.userId) {
                // update and save the sale
                res.redirect('/sale/mine')
                return sale.updateOne(req.body)
            } else {
                // otherwise send a 401 unauthorized status
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20sale`)
            }
        })
        .catch(err => {
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

//Delete Route
router.delete('/:id', (req, res) => {
    const id = req.params.id
    Sale.findById(id)
        .then(sale => {
            // if the selleer is the person who is logged in
            if (sale.seller == req.session.userId) {
                // update and save the sale
                return sale.deleteOne()
            } else {
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20sale`)
            }
        })
        .then(() => {
            res.redirect('/sale/mine')
        })
        .catch(err => {
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})


//Index route for sales on a plant
router.get('/:plantId', (req,res) =>{
    const { username, loggedIn, userId } = req.session
    const plantId = req.params.plantId
    // find all the plants
    Sale.find({plant: plantId })
        .populate('plant', 'name')
        .populate('seller', 'username')
        .then(sales => { 
            // save title for views page
            const title = sales[0].plant.name
            res.render('sale/index', { sales, title, username, loggedIn, userId })
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