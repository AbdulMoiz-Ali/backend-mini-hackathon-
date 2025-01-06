import jwt from 'jsonwebtoken';

// Middleware to verify Access Token
const verifyAccessToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Authorization: Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: "Access Denied, No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);  // Verify Access Token
        req.user = decoded;  // Attach user info to request object
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired Access Token" });
    }
};

export default verifyAccessToken;