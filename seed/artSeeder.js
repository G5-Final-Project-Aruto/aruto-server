const fs = require('fs')
const { Art, User,Category } = require('../models')

const arts = JSON.parse(fs.readFileSync('./data/arts.json', 'utf-8'))

let user = {
  "username": "AdamantineArt",
  "email": "admin@mail.com",
  "password": 12345,
  "full_name": "rio dicky",
  "art": []
}
function seedArts() {
  let userId = ''
  User.create(user)
    .then(data => {
      console.log(data, "baris 17")
      userId = data._id
      return Category.find({})
    })
    .then((data) => {    
      console.log(data, "baris 22")
      console.log(userId)
      arts.forEach(art => {
        art.user = userId
        art.categories = data
      })
      console.log(arts)
      return Art.insertMany(arts)
    })
    .then((dataArts) => {
      console.log(dataArts, "baris 30")
      return User.update({
        _id: userId
      },{
        $set: {
          arts: dataArts
        }
      })
    })
    .then(data => console.log(data))
    .catch((err) => console.log(err))
}
module.exports = seedArts