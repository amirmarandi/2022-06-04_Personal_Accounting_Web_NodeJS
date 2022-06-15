const validator = require('validator')

const {mongoose} = require('../db/mongodb')

let UserSchema = new mongoose.Schema ({
    fullname: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    email: {
        type: String,
        minlength: 6,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Your Email is not Valid ! check your email address'
        }
    
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    }
})

let User = mongoose.model('user', UserSchema)

module.exports = {
    User
}