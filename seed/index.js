// const connectDatabase = require('../config/database')
const app = require('../app')
const seedArts = require('./artSeeder')
const seedUser = require('./userSeeder')
const seedCategory = require('./categorySeeder')
const PORT = 3000

seedUser()
seedCategory()
seedArts()
app.listen(PORT, () => {
    console.log('listening port 3000')
})