const express = require('express');
const { ProctectRoute } = require('../middleware/auth');
const { getUserForSlider, getAllMessages, makeMessageAsSeen, sendMessage } = require('../controller/MessageController');
const  messageRouter = express.Router()


messageRouter.get('/users', ProctectRoute, getUserForSlider)
messageRouter.get('/:id', ProctectRoute, getAllMessages)
messageRouter.get('/mark/:id', ProctectRoute, makeMessageAsSeen)
messageRouter.post('/send/:id', ProctectRoute, sendMessage)

module.exports = messageRouter 