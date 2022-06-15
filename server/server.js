//locate Database config files to server
process.env.NODE_CONFIG_DIR = __dirname + '/config'

//build-in modules
const config = require('config')
const express = require('express')
const _ = require('lodash')

//My Modules
const { User } = require('./model/user')
const app = express()
app.use(express.json())

console.log("*** " + config.get('Level') + " ***")

app.post('/api/users', (req, res) => {
    const body = _.pick(req.body, ['fullname', 'email', 'password'])
    console.log(body)

    let user = new User(body)
    user.save().then((user) => {
        res.status(200).send(user)
    }, (err) => {
        res.status(400).json({
            Error: `Something is went wrong | ${err}`
        })
    })
})

app.listen(config.get('PORT'), () => {
    console.log(`Server is running on port : ${config.get('PORT')}`);
})