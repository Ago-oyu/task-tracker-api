import db from "../db.js"

export const getTags = async (req, res) => {
    const { userId } = req.params

    if (userId == null) {
        res.status(400).json({
            success: false,
            message: 'userId param required'
        })
    }

    try {
        const tags = await db.query('SELECT * FROM tags WHERE user_id = $1', [userId])

        res.status(200).json({
            success: true,
            data: tags
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server error",
        })
    }
}

export const createTag = async (req, res) => {
    const { name } = req.body

    try {
        await db.query('INSERT INTO tags (name, user_id) VALUES ($1, $2)', [name])
    } catch (error) {

    }
}