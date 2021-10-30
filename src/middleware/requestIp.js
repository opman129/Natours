const RequestIp = require('@supercharge/request-ip');

exports.getIpAddress = (req, res, next) => {
    req.ip = RequestIp.getClientIp(req);
    console.log(req.ip)
    next();
};