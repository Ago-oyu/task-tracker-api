import db from "../db.js"

const getAllTasks = async (req, res) => {
    const { tagId = null } = req.query;


    try {
        const tasks = await db.query("SELECT * FROM tasks where user_id = $1 AND ($2::int IS NULL OR tag_id = $2)", [req.user.id, tagId]);
        res.status(200).json({
            success: true,
            data: tasks.rows
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server error",
        })
    }
}

const getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const tasks = await db.query("SELECT * FROM tasks WHERE id = $1", [id])


        if (tasks.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        if (tasks.rows[0]['user_id'] != id) {
            res.status(401).json({ message: 'unauthorized' })
        }

        res.status(200).json({
            success: true,
            data: tasks.rows
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server error",
        })
    }

}

const createTask = async (req, res) => {
    const { description, tagId = null } = req.body;

    if (description == null) {
        res.status(400).json({
            success: false,
            message: "Request body invalid"
        })
    }

    try {
        const task = await db.query("INSERT INTO tasks(description, tag_id) VALUES ($1, $2) RETURNING *", [description, tagId]);
        res.status(201).json({
            success: true,
            data: task.rows[0]
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server error",
        })
    }
}

const updateTask = async (req, res) => {

}

const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);

        if (task.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        await db.query("DELETE FROM tasks WHERE id = $1", [id]);
        res.status(200).json({
            success: true,
            message: "Taks Deleted",
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};