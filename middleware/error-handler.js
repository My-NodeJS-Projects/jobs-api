// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Some thing went wrong try agin later',
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if (err.name && err.name === 'ValidationError') {
    customError.statusCode = 400
    customError.message = Object.values(err.errors)
      .map((items) => items.message)
      .join(', ')
  }
  if (err.name && err.name === 'CastError') {
    customError.statusCode = 404
    customError.message = `No object found with id :${err.value} `
  }
  if (err.code && err.code === 11000) {
    customError.statusCode = 400
    customError.message = `Duplicate value entered for the ${Object.keys(
      err.keyValue
    )} field. Please try another value`
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.message })
}

module.exports = errorHandlerMiddleware
