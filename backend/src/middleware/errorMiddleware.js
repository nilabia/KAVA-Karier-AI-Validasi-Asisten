const ClientError = require('../exceptions/ClientError');

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  }

  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'An error occurred on the server',
  });
};

module.exports = errorMiddleware;