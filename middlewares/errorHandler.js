function errorHandler(err, req, res, next){
  console.log(err._message)
  res.status(400).json({errors: err._message})
}
module.exports = errorHandler