/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Message = require('../models/message')
const User = require('../models/user')
const { populate } = require('../models/plant')

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

/////////////////////////////
////      Routes         ////
/////////////////////////////

//Index route
//index of all message threads
router.get('/threads', (req,res) =>{
    Message.find({$or: [{recipient: req.session.userId},{author: req.session.userId}]})
        .populate('author', 'username')
        .then(messages=>{
            const threads = []
            messages.forEach(msg=>{
                if (!threads.includes(msg.author)){
                    threads.push(msg.author)
                }
            })
            console.log(threads)
            res.render('messages/threads', {threads, ...req.session})
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

//Create Route
router.post('/:receiverId', (req,res)=> {
    const receiverId = req.params.receiverId
    req.body.recipient = receiverId
    req.body.author = req.session.userId
    const newMessage = req.body
    Message.create(newMessage)
        .then(message=>{
            res.redirect(`/message/${receiverId}`)
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})
//Index route
router.get('/:receiverId', (req,res) => {
    const recipientId = req.params.receiverId
    Message.find({$or: 
        [{$and: [{recipient: recipientId},{author: req.session.userId}]},
        {$and: [{recipient: req.session.userId}, {author: recipientId}]}
        ]})
        .populate('recipient', 'username')
        .populate('author', 'username')
        .then(messages =>{
            console.log
            User.findById(recipientId)
                .then(recipient=>{
                    res.render('messages/index', {messages, recipient, ...req.session})
                })
                .catch((error) => {
                    res.redirect(`/error?error=${error}`)
                })
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

//Index route
//index of all message threads
router.get('/threads', (req,res) =>{
    Message.find({$or: [{recipient: req.session.userId},{author: req.session.userId}]})
        .then(messages=>{
            //const authors = messages.distinct('author')
            console.log(messages)
            res.render('index')
        })
        .catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

//Delete Route
router.delete('/:id', (req, res)=>{
    const id = req.params.id
    Message.findById(id)
        .then(message=> {
            const recipient = message.recipient
            console.log('this is the message', message)
            // if the author of the message is the person who is logged in
            if (message.author == req.session.userId) {
                // send success message
                //res.sendStatus(204)
                // delete the message
                res.redirect(`/message/${recipient}`)
                return message.deleteOne()
            } else {
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20message`)
            }
        })
        .catch(error => {
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

//////////////////////////////
//// Export Router        ////
//////////////////////////////

module.exports = router