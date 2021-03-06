const fs = require('fs')
const { User } = require('../models')
const { hashPassword } = require('../helpers')
const seedCategory = require('./categorySeeder')

const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'))
users.forEach(user => {
  let password = hashPassword(String(user.password))
  user.password = password
})

function seedUser(){
  User.insertMany(users)
  .then(data=> {
    console.log(data)
    seedCategory()
  })
  .catch(err => console.log(err))
}
module.exports = seedUser
