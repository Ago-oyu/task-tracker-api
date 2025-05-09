import express from "express"
import { createTag, getTags, updateTag } from "../controllers/tagController.js"

const tagRouter = express.Router()

tagRouter.get('/user/:userId', getTags)
tagRouter.post('/', createTag)
tagRouter.put('/:tagId', updateTag)

export default tagRouter;