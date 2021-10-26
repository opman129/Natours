function responseHandler (response, data, next, statusCode, message, numOfResults) {
  if (data instanceof Error) {
    return next(data);
  } else {
    return response.status(statusCode).json({
      status: "success",
      message,
      results: numOfResults,
      data,
    });
  };
};
  
module.exports = responseHandler;