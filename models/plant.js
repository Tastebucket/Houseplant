///////////////////////////////////////////////////
/// Our schema and model for the fruit resource ///
///////////////////////////////////////////////////

//const mongoose = require('mongoose')  //import mongoose
const mongoose = require('./connection')

// import our commentSchema, to use as a subdocument
const commentSchema = require('./comment')

// we'll destructure the Schema and model functions from mongoose
const{ Schema, model } = mongoose

const plantSchema = new Schema ({
    name: {
    type: String,
    required: true
    },
    scientificName: {
    type: String
    },
    water: {
        type: String
    },
    light: {
        type: String
    },
    flowering: {
    type: Boolean
    },
    comments: [commentSchema]
}, {
    timestamps: true
})

const Plant = model('Plant',plantSchema)

////////////////////////
/// Export our Model ///
////////////////////////

module.exports = Plant