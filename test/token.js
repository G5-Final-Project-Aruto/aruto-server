const { getToken } = require('../helpers')

const admin_token = getToken({
  username: 'admin',
  email: 'admin@gmail.com'
})

const user_token = getToken({
  username: 'user',
  email: 'user@gmail.com'
})

module.exports = {
  admin_token,
  user_token
}