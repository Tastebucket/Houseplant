///////////////////////////////////////
//// Import Dependencies          ////
//////////////////////////////////////
const mongoose = require('./connection')


// Destructure the Schema from mongoose
const { Schema, model } = mongoose

// message schema
const messageSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

const Message = model('Message',messageSchema)
////////////////////////////////
//// Export Schema          ////
////////////////////////////////
module.exports = Message