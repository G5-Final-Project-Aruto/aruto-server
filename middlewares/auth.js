const { User } = require('../models')
const { verifyToken } = require('../helpers')

function authentic (req, res, next) {
  try {
    const user = verifyToken(req.headers.access_token)
    User.findOne({
      email: user.email
    })
      .then(data => {
        req.currentUser = data
        next()
      })
      .catch(err => next(err))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  authentic
}