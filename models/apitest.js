const mongoose = require('./connection')
const Plant = require('./plant')
const axios = require("axios");
const express = require('express')
require('dotenv').config()
// const router = express.Router()

const db = mongoose.connection

const options = {
  method: 'GET',
  url: `${process.env.API_URL}`,
  headers: {
    'X-RapidAPI-Key': `${process.env.API_KEY}`,
    'X-RapidAPI-Host': `${process.env.API_HOST}`
  }
}
// const startPlants = []

// router.get('/apitest', (req, res) =>{
//     axios.request(options).then(function (response) {
// 	    console.log(response.data[1])
//         res.send(response.data[1])
//         }).catch(function (error) {
// 	    console.error(error)
//     })
// })


db.on('open', () => {
    const startPlants = []
    Plant.deleteMany({})
        .then(() => {
            // then we'll seed(create) our starter plants
            axios.request(options).then(function (response) {
                console.log(response.data[1])
                for (i=0; i<response.data.length; i++){
                    startPlants[i]={ name : `${response.data[i]['Common name']}`}
                }
                Plant.create(startPlants)
                // tell our app what to do with success and failures
                .then(data => {
                    console.log('here are the created plants: \n', data)
                    // once it's done, we close the connection
                    db.close()
                })
                .catch(err => {
                    console.log('The following error occurred: \n', err)
                    // always close the connection
                    db.close()
                })
                }).catch(function (error) {
                console.error(error)
            })
            
        })
        .catch(err => {
            console.log(err)
            // always make sure to close the connection
            db.close()
        })
})

// module.exports = router