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
    Message.find({$or: [{recipient: recipientId},{author: recipientId}] })
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
                // delete the fruit
                res.redirect(`/message/${recipient}`)
                return message.deleteOne()
            } else {
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20fruit`)
            }
        })
        .catch(err => {
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

//////////////////////////////
//// Export Router        ////
//////////////////////////////

module.exports = router