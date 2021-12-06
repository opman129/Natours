const { clearHash } = require('../utils/redis');

module.exports = async (req, res, next) => {
    await next();

    clearHash(req.user.id);
};