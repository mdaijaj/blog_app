import jwt from 'jsonwebtoken'

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.access_token;
        if (!token) {
            return res.status(403).json({ message: 'Unauthorized: No token provided' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken; 
        next(); 
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};