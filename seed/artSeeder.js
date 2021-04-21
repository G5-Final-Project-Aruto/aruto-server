const fs = require('fs')
const { Art, User,Category } = require('../models')
const updateUserSeeder = require('./updateUserSeeder')

const arts = JSON.parse(fs.readFileSync('./data/arts.json', 'utf-8'))


function seedArts() {
  let users
  User.find({})
    .then(data => {
      users = data
      return Category.find({})
    })
    .then((data) => {    
      arts.forEach(art => {
        art.user = users[Math.floor(Math.random()*users.length)]
        art.categories = [data[Math.floor(Math.random()*data.length)]]
      })
      return Art.insertMany(arts)
    })
    // .then((dataArts) => {
    //   console.log(dataArts, "baris 30")
    //   return User.update({
    //     _id: users
    //   },{
    //     $set: {
    //       arts: dataArts
    //     }
    //   })
    // })
    .then(data => {
      updateUserSeeder()
    })
    .catch((err) => console.log(err))
}
module.exports = seedArts