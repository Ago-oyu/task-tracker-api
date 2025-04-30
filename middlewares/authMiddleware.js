import jwt from "jsonwebtoken";
import db from "../db.js";

const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        } else {
            res.status(401).json({ message: 'unauthorized' })
        }

        const payload = jwt.decode(token, { json: true })

        const user = (await db.query('SELECT * FROM users WHERE id = $1', [payload.userId])).rows[0]

        if (!user) {
            res.status(401).json({ message: 'unauthorized' })
        }
        // console.log(user);
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export default authorize;