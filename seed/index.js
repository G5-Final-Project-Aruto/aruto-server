const connectDatabase = require('../config/database')
const seedArts = require('./artSeeder')
const seedUser = require('./userSeeder')
const seedCategory = require('./categorySeeder')

connectDatabase()
seedArts()
seedUser()
seedCategory()
