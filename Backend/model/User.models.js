const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
        },
     password: {
            type: String,
            required: true
     },
     bio : {
        type: String,
        required: true
        
     },

     profileImg : {
        type: String,
        required: true
        
     }

     

}, {timestamps: true})

const User = mongoose.model("User", userSchema)
module.exports = User;