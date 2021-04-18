const fs = require('fs')
const { Art, User } = require('../models')

const arts = JSON.parse(fs.readFileSync('./data/arts.json', 'utf-8'))

let user = {
  "username": "rio",
  "email": "rio@mail.com",
  "password": 12345,
  "full_name": "rio dicky",
  "art": []
}

function seedArts(){
  User.create(user)
            .then((data) => {
                arts.forEach(art => {
                    art.user = data._id
                })
                return Art.insertMany(arts)
            })
            .then((data) => console.log(data))
            .catch((err) => console.log(err))
  // Art.insertMany(arts)
  // .then(data=> console.log(data))
  // .catch(err => console.log(err))
}
module.exports = seedArts