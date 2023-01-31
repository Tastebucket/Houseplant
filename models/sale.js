///////////////////////////////////////////////////
/// Schema and model for sale resource ///
///////////////////////////////////////////////////

const mongoose = require('./connection')

// Destructure the Schema and model functions from mongoose
const{ Schema, model } = mongoose

const saleSchema = new Schema ({
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plant: {
        type: Schema.Types.ObjectId,
        ref: 'Plant',
        required: true
    },
    price: {
        type: Number
    },
    age: {
        type: String
    },
    height: {
        type: String
    },
    image: {
        type: String
    }
})