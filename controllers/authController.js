import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import db from "../db.js";

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email == '' || password == '') {
            res.status(400).json({ message: "Bad Request" });
        }

        // check if email already used
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email])
        if (user.rows.length > 0) {
            res.status(400).json({ message: "email already used" });
        } else {
            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // insert new user
            const newUser = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", [email, hashedPassword]);

            const token = jwt.sign({ userId: newUser.rows[0]["id"] }, process.env.SECRET_KEY, { expiresIn: "1h" });

            res.status(201).json({
                message: "User created",
                data: {
                    token,
                    user: newUser.rows[0]
                }
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server error",
        })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email == '' || password == '') {
            res.status(400).json({ message: "Bad Request" });
        }

        // find user
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email])
        if (user.rows.length > 0) {
            // const salt = await bcrypt.genSalt(10);
            // const hashedPassword = await bcrypt.hash(password, salt);

            const isPasswordValid = await bcrypt.compare(password, user.rows[0]["password"]);

            // match password
            if (isPasswordValid) {
                const token = jwt.sign({ userId: user.rows[0]["id"] }, process.env.SECRET_KEY, { expiresIn: "1h" });
                res.status(200).json({
                    message: "Login success",
                    data: {
                        token,
                        user: user.rows[0]
                    }
                })
            } else {
                res.status(401).json({
                    message: "wrong password"
                })
            }
        } else {
            res.status(401).json({
                message: "email not found"
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server error",
        })
    }
}