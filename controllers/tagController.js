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

export const updateTag = async (req, res) => {
    const { tagId } = req.params
    const { name } = req.body

    try {
        const tag = await db.query('SELECT * FROM tags WHERE id = $1', [tagId])
        if (tag.rowCount == 0) {
            res.status(404).json({
                success: false,
                message: 'tag not found'
            })
        }

        await db.query('UPDATE tags SET name = $1, updated_at = $2 WHERE id = $3', [name, new Date().toISOString(), tagId])

        res.status(204).json({
            success: true
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server error",
        })
    }
}