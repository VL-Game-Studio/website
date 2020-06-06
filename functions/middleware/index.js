const functions = require('firebase-functions');

const middleware = async (req, res, next) => {
  const secret = process.env.SECRET || functions.config().discord.secret;

  if (!req.headers || req.headers.secret !== secret) {
    return res.status(403).json({ error: 'You are not authorized for this action.' });
  }

  return next();
};

module.exports = middleware;
