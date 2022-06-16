const validator = require('validator')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const config = require('config')

const { mongoose } = require('../db/mongodb')

const tokenOptions = {
    type: String,
    required: true
}

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
    },
    tokens: [{
        access: tokenOptions,
        token: tokenOptions
    }]
})

UserSchema.methods.toJSON = function () {
    let user = this
    let userObj = user.toObject()

    return _.pick(userObj, ['_id', 'fullname', 'email'])
}

UserSchema.statics.findByCredentials = function (email, password) {
    let User = this

    return User.findOne({
        email
    }).then((user) => {
        if (!user) {
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user)
                } else {
                    reject()
                }
            })
        })
    })
}

UserSchema.methods.generateAuthToken = function () {
    let user = this
    let access = 'auth'

    let token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, config.get('JWT_SECRET')).toString()

    user.tokens.push({
        access: access,
        token: token
    })

    return user.save().then(() => {
        return token
    })
}

UserSchema.pre('save', function (next) {
    let user = this

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
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