//locate Database config files to server
process.env.NODE_CONFIG_DIR = __dirname + '/config'

//build-in modules
const config = require('config')

//My Modules
const {User} = require('./model/user')

console.log("*** " + config.get('Level') + " ***")

let newUser = new User({
    fullName:"Amir Marandi",
    email: "amirmarandiorg@gmail.com",
    password: "amir1383"
})

newUser.save().then((User) => {
    console.log('user has been saved in database successfully. | ', User);
})