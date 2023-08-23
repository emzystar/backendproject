const mongoose = require("mongoose")
 
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'please provide a username']
    },
    email: {
        type: String,
        required: [true, "Please provide user email address"],
        unique: [true, "Email address already taken"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)