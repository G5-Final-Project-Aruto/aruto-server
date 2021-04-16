const fs = require('fs')
const { User } = require('../models')

const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'))

function seedUser(){
  User.insertMany(users)
  .then(data=> console.log(data))
  .catch(err => console.log(err))
}
module.exports = seedUser
