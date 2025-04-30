import express from "express"

const tagRouter = express.Router()

tagRouter.get('/tag/:userId')
tagRouter.post('tag')