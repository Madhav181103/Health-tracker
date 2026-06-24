const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * 
 * JWT verification performs two main checks:
 * 1. Signature Verification: It validates that the token was signed with the server's private secret (`JWT_SECRET`). 
 *    If any part of the token (header/payload) was tampered with, the signature check fails.
 * 2. Expiration Check (Expiry): It parses the `exp` claim from the token payload and compares it to the current server time. 
 *    If the token has expired, verification fails.
 */
const authMiddleware = (req, res, next) => {
  // 1. Read the Authorization header from the incoming request
  const authHeader = req.headers.authorization;

  // 2. Check if it starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // 3. Extract the token (everything after 'Bearer ')
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify the token using jwt.verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the decoded userId to req.userId and proceed
    req.userId = decoded.userId || decoded.id;
    next();
  } catch (error) {
    // 6. If verification fails (expired, invalid signature, etc.)
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
