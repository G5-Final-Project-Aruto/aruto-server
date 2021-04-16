const jwt = require('jsonwebtoken')

const secretKey = process.env.SECRET_KEY

function getToken(user){
    const token = jwt.sign(user, secretKey);
     return token
}

function verifyToken(token){
    const decoded = jwt.verify(token, secretKey);
    return decoded
}

module.exports = {
  getToken,
  verifyToken
}