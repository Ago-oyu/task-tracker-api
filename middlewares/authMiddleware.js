import jwt from "jsonwebtoken";
import db from "../db.js";

const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        } else {
            res.status(401).json({ message: 'unauthorized, access token is missing' })
        }

        // const payload = jwt.decode(token, { json: true })

        const decoded = jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res.status(401).json({
                        message: 'token has expired'
                    })
                } else {
                    res.status(401).json({
                        message: 'invalid token'
                    })
                }
            }
        })

        const user = (await db.query('SELECT * FROM users WHERE id = $1', [payload.userId])).rows[0]

        if (!user) {
            res.status(401).json({ message: 'unauthorized' })
        }
        // console.log(user);
        req.user = decoded;
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export default authorize;