////////////////////
//  Dependencies  //
////////////////////
require("dotenv").config() // make env variables available
const express = require("express")
const middleware = require('./utils/middleware')
const PlantRouter = require('./controllers/plantControllers')
const UserRouter = require('./controllers/user')
// const TestRouter = require('./models/apitest')
const User = require("./models/user")
// SEE MORE DEPENDENCIES IN ./utils/middleware.js
// user and resource routes linked in ./utils/middleware.js

//////////////////////////////
// Middleware + App Object  //
//////////////////////////////
const app = require("liquid-express-views")(express())

middleware(app)

////////////////////
//    Routes      //
////////////////////
const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://house-plants2.p.rapidapi.com/id/53417c12-4824-5995-bce0-b81984ebbd1d',
  headers: {
    'X-RapidAPI-Key': 'fa772b2ccfmsha501e58960b67eap1babc2jsn2c0a909f7b3c',
    'X-RapidAPI-Host': 'house-plants2.p.rapidapi.com'
  }
};

// app.get('/test/apitest', (req,res) => {
// 	axios.request(options).then(function (response) {
// 	console.log(response.data);
// 	res.send(response.data)
// }).catch(function (error) {
// 	console.error(error);
// });


//})
app.use('/auth', UserRouter)
app.use('/plants', PlantRouter)
// app.use('/test', TestRouter)


app.get('/', (req, res) => {
    const { username, userId, loggedIn } = req.session
	res.render('index.liquid', { loggedIn, username, userId })
})

app.get('/error', (req, res) => {
	const error = req.query.error || 'This Page Does Not Exist'
    const { username, loggedIn, userId } = req.session
	res.render('error.liquid', { error, username, loggedIn, userId })
})

// if page is not found, send to error page
app.all('*', (req, res) => {
	res.redirect('/error')
})



//////////////////////////////
//      App Listener        //
//////////////////////////////
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})