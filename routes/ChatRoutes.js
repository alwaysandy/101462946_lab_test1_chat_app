const ChatModel = require("../models/ChatModel");
const express = require('express');
const ChatRoutes = express.Router();

ChatRoutes.get('/direct-messages/:sender/:recipient', async (req, res) => {
    try {
        const {sender, recipient} = req.params;
        const messages = await ChatModel.find({
            $or: [
                { sender: sender, recipient: recipient },
                { sender: recipient, recipient: sender }
            ]
        }).sort({ createdAt: 1 });
        return res.status(200).send(messages);
    } catch {
        return res.status(500);
    }
});

ChatRoutes.get('/group-messages/:group', async (req, res) => {
    try {
        const { group } = req.params;
        const messages = await ChatModel.find({group: group}).sort({createdAt: 1});
        return res.status(200).send(messages);
    } catch {
        return res.status(500);
    }
});

module.exports = ChatRoutes;