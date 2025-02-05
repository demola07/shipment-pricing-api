import Response from '../utils/response.js';
import HttpCode from '../utils/codes.js';

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HttpCode.INTERNAL_SERVER_ERROR;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return Response.badRequest(res, 'Validation Error', { errors });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return Response.badRequest(res, `Duplicate ${field} value entered`);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return Response.badRequest(res, `Invalid ${err.path}: ${err.value}`);
  }

  if (err.statusCode === HttpCode.NOT_FOUND) {
    return Response.notFound(res, err.message);
  }

  if (err.statusCode === HttpCode.BAD_REQUEST) {
    return Response.badRequest(res, err.message);
  }

  // Default error
  return Response.internalServerError(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  );
};

export default errorHandler; 