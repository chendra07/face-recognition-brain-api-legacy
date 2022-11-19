//OK
function res200(req, res, body, message) {
  return res.status(200).json({
    message: message ?? "OK",
    statusCode: 200,
    data: body,
  });
}

//Created
function res201(req, res, body, message) {
  return res.status(201).json({
    message: message ?? "Created",
    statusCode: 201,
    data: body,
  });
}

//Bad Request
function res400(req, res, body, message) {
  return res.status(400).json({
    message: message ?? "Bad Request",
    statusCode: 400,
    data: body,
  });
}

//Unauthorized
function res401(req, res, body, message) {
  return res.status(401).json({
    message: message ?? "Unauthorized",
    statusCode: 401,
    data: body,
  });
}

//Forbidden
function res403(req, res, body, message) {
  return res.status(403).json({
    message: message ?? "Forbidden",
    statusCode: 403,
    data: body,
  });
}

//Not Found
function res404(req, res, body, message) {
  return res.status(404).json({
    message: message ?? "Not Found",
    statusCode: 404,
    data: body,
  });
}

//Method Not Allowed
function res405(req, res, body, message) {
  return res.status(405).json({
    message: message ?? "Method Not Allowed",
    statusCode: 405,
    data: body,
  });
}

//Request Timeout
function res408(req, res, body, message) {
  return res.status(408).json({
    message: message ?? "Request Timeout",
    statusCode: 408,
    data: body,
  });
}

//Confict
function res409(req, res, body, message) {
  return res.status(409).json({
    message: message ?? "Confict",
    statusCode: 409,
    data: body,
  });
}

//Too Many Request
function res429(req, res, body, message) {
  return res.status(429).json({
    message: message ?? "Too Many Request",
    statusCode: 429,
    data: body,
  });
}

//Internal Server Error
function res500(req, res, body, message) {
  return res.status(500).json({
    message: message ?? "Internal Server Error",
    statusCode: 500,
    data: body,
  });
}

//Bad Gateway
function res502(req, res, body, message) {
  return res.status(502).json({
    message: message ?? "Bad Gateway",
    statusCode: 502,
    data: body,
  });
}

//Network Authentication Required
function res511(req, res, body, message) {
  return res.status(511).json({
    message: message ?? "Network Authentication Required",
    statusCode: 511,
    data: body,
  });
}

module.exports = {
  res200,
  res201,
  res400,
  res401,
  res403,
  res404,
  res405,
  res408,
  res409,
  res429,
  res500,
  res502,
  res511,
};
