const app = require('../app')
const seedUser = require('./userSeeder')

const PORT = 3000

seedUser()
app.listen(PORT, () => {
    console.log('listening port 3000')
})