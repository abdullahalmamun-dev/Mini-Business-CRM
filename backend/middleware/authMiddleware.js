const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers['x-authorization'] || req.headers['crm-access-token'];
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (!token || token === 'null' || token === 'undefined') {
    console.log('[Auth Debug]: No valid token found in headers or cookies. AuthHeader:', authHeader);
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_key';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    console.log('[Auth Debug]: Token verified for user:', decoded.id);
    next();
  } catch (error) {
    console.log('[Auth Debug]: Token verification failed:', error.message, 'Token snippet:', token.substring(0, 10));
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const roleHierarchy = {
  'Admin': 3,
  'Manager': 2,
  'Staff': 1
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access denied. User role not found.' });
    }

    const userLevel = roleHierarchy[req.user.role] || 0;
    const requiredLevel = Math.min(...allowedRoles.map(role => roleHierarchy[role] || 999));

    if (userLevel >= requiredLevel) {
      return next();
    }

    return res.status(403).json({ 
      message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}` 
    });
  };
};

module.exports = {
  verifyToken,
  authorizeRoles
};
