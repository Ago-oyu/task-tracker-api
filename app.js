import express from "express";
import "dotenv/config";

import taskRoute from "./routes/taskRoute.js";
import authRoute from "./routes/authRoute.js";
import db from "./db.js";
import authorize from "./middlewares/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Task Tracker API");
});

// Import routes
app.use("/api/auth", authRoute)
app.use("/api/tasks", taskRoute)

app.listen(PORT, () => {
    // Connect to the database
    db.query(
        `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tags (
            id SERIAL PRIMARY KEY,
            name varchar(255) unique NOT NULL,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TYPE task_status AS ENUM('todo', 'in-progress', 'done');

        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            description varchar(255),
            status task_status NOT NULL DEFAULT 'todo',
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            tag_id INT REFERENCES tags(id) ON DELETE SET NULL,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP
        );
        
        `
    )
    console.log(`Server is running on port ${PORT}`);
});