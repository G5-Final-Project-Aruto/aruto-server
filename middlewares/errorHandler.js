module.exports = (err, req, res, next) => {
  if (!err) return;
  console.log(err);

  let error = {
    status: 500,
    message: "Internal Server Error",
  };

  switch (err.name) {
    case "Invalid email / password":
    case "Image is required":
    case "Uploaded file must be image":
    case "transactionId is required":
      error = {
        ...error,
        status: 400,
        message: err.name,
      };
      break;
    case "ValidationError":
      error = {
        ...error,
        status: 400,
        message: err.message,
      };
      break;
    case "MongoError":
      const attribute = Object.keys(err.keyValue)[0];
      error = {
        ...error,
        status: 400,
        message: `${attribute} is unique`,
      };
      break;
    case "Please login first":
    case "Unauthorize user":
    case "Invalid token":
      error = {
        ...error,
        status: 401,
        message: err.name,
      };
      break;
    case "Transaction is not found":
      error = {
        ...error,
        status: 404,
        message: err.name,
      };
      break;
    default:
      break;
  }

  res.status(error.status).json({ message: error.message });
};
