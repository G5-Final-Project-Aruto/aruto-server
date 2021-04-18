const { User, Art } = require('../models')
const { verifyToken } = require('../helpers')

async function authorization(req, res, next) {
  try {
    if(!req.headers.access_token) {
      throw ({name: "access_token not found"})
    }
    const user = verifyToken(req.headers.access_token)
    if(user._id && user.email) {
      const dataUser = await User.findById({
        _id: user._id
      })
      if(dataUser.email === user.email) {
        req.currentUser = dataUser
        next()
      }else {
        throw ({name: "user not found"})
      }  
    }
  } catch (error) {
    next(error)
  }
}
async function authentication( req, res, next ) {
  try {
    const art = await Art.findById({
      _id: req.params.id
    }).populate('user')
    console.log(art, "ini art")
    console.log(req.currentUser, "ini user")
    if(art.user._id == req.currentUser._id){
      next()
    }else {
      throw ({name: "User cannot access this Art"})
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  authorization,
  authentication
}