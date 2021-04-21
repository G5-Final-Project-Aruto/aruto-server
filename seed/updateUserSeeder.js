const { User, Art } = require('../models')

async function updateUserSeeder(){
  const users = await User.find({})
  const arts = await Art.find({}).populate('user')
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    for (let j = 0; j < arts.length; j++) {
      const art = arts[j]
      if(user.email == art.user.email) {
        user.arts.push(art._id)
      }
    }
  }
  users.forEach(user => {
    if(user.arts.length > 0) {
      User.updateOne({
        _id: user._id
      }, {
        $set: {
          arts: user.arts
        }
      })
      .then(data => {console.log(data)})
      .catch(err => console.log(err))
    }
  })
}

module.exports = updateUserSeeder