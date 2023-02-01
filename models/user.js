// import what I need
const { Schema, model } = require('./connection.js')

// create the schema
const UserSchema = new Schema(
	{
		username: { 
			type: String, 
			required: true, 
			unique: true 
		},
		password: { 
			type: String, 
			required: true 
		},
		bio: { 
			type: String, 
		},
		favPlant: { 
			type: String, 
		},
		imgLink: { 
			type: String, 
		}

	},
	{ 
	timestamps: true,
	strict: false
	}
)

// creat the model
const User = model('User', UserSchema)

// export the model
module.exports = User
