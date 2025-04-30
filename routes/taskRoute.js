import express from "express";

import { getAllTasks, getTaskById, createTask, deleteTask, updateTask } from "../controllers/taskController.js";
import authorize from "../middlewares/authMiddleware.js";

// "/api/tasks" route
const router = express.Router();

router.use(authorize)

router.get("/", getAllTasks)

router.get("/:id", getTaskById)

router.post("/", createTask)

router.put("/:id", updateTask)

router.delete("/:id", deleteTask)


export default router;