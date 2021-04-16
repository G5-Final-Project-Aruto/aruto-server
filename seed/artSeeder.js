const fs = require('fs')
const { Art } = require('../models')

const arts = JSON.parse(fs.readFileSync('./data/arts.json', 'utf-8'))

function seedArts(){
  Art.insertMany(arts)
  .then(data=> console.log(data))
  .catch(err => console.log(err))
}
module.exports = seedArts