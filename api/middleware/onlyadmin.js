import jwt from 'jsonwebtoken'

export const onlyadmin = async (req, res, next) => {
    try {
        console.log("req.headers-->", req.headers)
        const token = req.headers['access_token'] || req.headers['authorization']?.split(' ')[1]
        console.log("token", token)
        if (!token) {
            return res.status(403).json({ message: 'Unauthorized' })
        }

        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log("decodeToken-->", decodeToken)
        if (decodeToken.role === 'admin') {
            req.user = decodeToken
            next()
        } else {
            return res.status(403).json({ message: 'Unauthorized' })
        }
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' })
        }
        next(500, error.message)
    }
}