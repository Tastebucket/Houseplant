///////////////////////////////////////////////////
/// Schema and model for plant resource ///
///////////////////////////////////////////////////

//import mongoose
const mongoose = require('./connection')


// Destructure the Schema and model functions from mongoose
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
    category: {
        type: String
    },
    imageLink: {
        type: String
    },
    apiId: {
        type: String
    },
    flowering: {
    type: Boolean
    },
}, {
    timestamps: true
})

const Plant = model('Plant',plantSchema)

////////////////////////
/// Export our Model ///
////////////////////////

module.exports = Plant