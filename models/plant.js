// import dependencies
const mongoose = require('./connection')

// import commentSchema for use as subdoc
const commentSchema = require('./comment')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const plantSchema = new Schema(
	{
		name: { type: String, required: true },
		scientificName: { type: String},
        light: { type: String },
		water: { type: String },
		flowering: { type: Boolean }
	},
	{ timestamps: true }
)

const Plant = model('Plant', plantSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Plant
