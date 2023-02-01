////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const User = require('../models/user')
const Plant = require('../models/plant')
const bcrypt = require('bcryptjs')

////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()


// Routes

// GET to render the signup form
router.get('/signup', (req, res) => {
	res.render('auth/signup')
})

// POST to send the signup info
router.post('/signup', async (req, res) => {
	// set the password to hashed password
  req.body.password = await bcrypt.hash(
		req.body.password,
		await bcrypt.genSalt(10)
	)
	// create a new user
	User.create(req.body)
		// if created successfully redirect to login
		.then((user) => {
			res.redirect('/auth/login')
		})
		// if an error occurs, send err
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// two login routes
// get to render the login form
router.get('/login', (req, res) => {
	res.render('auth/login')
})
// post to send the login info(and create a session)
router.post('/login', async (req, res) => {
	// console.log('request object', req)
	// get the data from the request body
	console.log('req.body', req.body);
	
	const { username, password } = req.body
	// then we search for the user
	User.findOne({ username: username })
		.then(async (user) => {
			// check if the user exists
			if (user) {
				// compare the password
				// bcrypt.compare evaluates to a truthy or a falsy value
				const result = await bcrypt.compare(password, user.password)

				if (result) {
					console.log('the user', user);
					
					// store some properties in the session
					req.session.username = user.username
					req.session.loggedIn = true
					req.session.userId = user.id

          			const { username, loggedIn, userId } = req.session

					console.log('session user id', req.session.userId)
					// redirect to home if login is successful
					res.redirect('/')
				} else {
					// send an error if the password doesnt match
					res.redirect('/error?error=username%20or%20password%20incorrect')
				}
			} else {
				// send an error if the user doesnt exist
				res.redirect('/error?error=That%20user%20does%20not%20exist')
			}
		})
		// catch any other errors that occur
		.catch((error) => {
			console.log('the error', error);
			
			res.redirect(`/error?error=${error}`)
		})
})

// logout route -> destroy the session
router.get('/logout', (req, res) => {
	req.session.destroy(() => {
		res.redirect('/')
	})
})
//GET -> edit route
router.get('/edit/:id', (req,res) => {
    const id = req.params.id
    User.findById(id)
        .then(user => {
            res.render('auth/edit', {user, ...req.session})
        })
        .catch(err=> {
            res.redirect(`/error?error=${err}`)
        })
})


// PUT route
// Update -> updates a specific sale(only if the seller is updating)
router.put('/:id', (req, res) => {
    const id = req.params.id
    User.findById(id)
        .then(user=> {
			console.log('This is the user', user.id)
            // if the selleer is the person who is logged in
            if (user.id === req.session.userId) {
				res.redirect(`/auth/${id}`)
                // update and save the sale
                return user.updateOne(req.body)
            } else {
				console.log('no worky')
                // otherwise send a 401 unauthorized status
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20sale`)
            }
        })
        .catch(err => {
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})
// show route
router.get('/:userId', (req,res)=>{
	const userId = req.params.userId
	User.findById(userId)
		.then(user=>{
			res.render('auth/show', {user,...req.session})
	})
		.catch((error) => {
			console.log('the error', error);
			
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
