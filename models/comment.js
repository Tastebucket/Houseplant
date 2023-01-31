///////////////////////////////////////
//// Import Dependencies          ////
//////////////////////////////////////
const mongoose = require('./connection')


// Destructure the Schema from mongoose
const { Schema } = mongoose

// comment schema
const commentSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

////////////////////////////////
//// Export Schema          ////
////////////////////////////////
module.exports = commentSchema