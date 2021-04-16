const fs = require('fs')
const { Category } = require('../models')

const categories = JSON.parse(fs.readFileSync('./data/categories.json', 'utf-8'))

function seedCategory(){
  Category.insertMany(categories)
  .then(data=> console.log(data))
  .catch(err => console.log(err))
}
module.exports = seedCategory