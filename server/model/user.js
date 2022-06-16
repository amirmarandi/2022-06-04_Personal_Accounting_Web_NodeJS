const validator = require('validator')
const bcrypt = require('bcryptjs')
const _ = require('lodash')

const { mongoose } = require('../db/mongodb')

let UserSchema = new mongoose.Schema({
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

UserSchema.methods.toJSON = function (){
    let user = this
    let userObj = user.toObject()

    return _.pick(userObj, ['_id', 'fullname', 'email'])
}

UserSchema.pre('save', function (next){
    let user = this

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

let User = mongoose.model('user', UserSchema)

module.exports = {
    User
}