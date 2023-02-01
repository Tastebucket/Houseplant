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
    Message.find({$or: [{recipient: recipientId}, {author: req.session.userId}] })
        .populate('recipient', 'username')
        .populate('author', 'username')
        .then(messages =>{
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

//Create route
router.get('/')

//////////////////////////////
//// Export Router        ////
//////////////////////////////

module.exports = router