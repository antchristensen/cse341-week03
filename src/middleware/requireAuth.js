// src/middleware/requireAuth.js
module.exports = (req, res, next) => {
  // Allow CORS preflight through so the browser can ask permission
  if (req.method === 'OPTIONS') return next();

  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Unauthorized' });
};
