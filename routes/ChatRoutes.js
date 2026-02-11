const ChatModel = require("../models/ChatModel");
const express = require('express');
const ChatRoutes = express.Router();

ChatRoutes.get('/direct-messages/:sender/:recipient', async (req, res) => {
    try {
        const {sender, recipient} = req.params;
        const messages = await ChatModel.find({sender, recipient}).sort({createdAt: 1});
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

ChatRoutes.post('/direct-message', async (req, res) => {
    if (!req.body.sender) {
        return res.status(400).send("No sender specified");
    }

    if (!req.body.recipient) {
        return res.status(400).send("No recipient specified");
    }

    if (!req.body.message) {
        return res.status(400).send("Message content is required");
    }

    const sender = req.body.sender;
    const recipient = req.body.recipient;
    const message = req.body.message;

    try {
        const newMessage = new ChatModel({
            sender: sender,
            recipient: recipient,
            message: message,
        });

        const savedMessage = await newMessage.save();
        return res.status(201).json({
            success: true,
            data: savedMessage
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

ChatRoutes.post('/group-message', async (req, res) => {
    if (!req.body.sender) {
        return res.status(400).send("No sender specified");
    }

    if (!req.body.group) {
        return res.status(400).send("No group specified");
    }

    if (!req.body.message) {
        return res.status(400).send("Message content is required");
    }

    const { sender, group, message } = req.body;

    try {
        const newMessage = new ChatModel({
            sender: sender,
            group: group,
            message: message
        });

        const savedMessage = await newMessage.save();
        return res.status(201).json({
            success: true,
            data: savedMessage
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

module.exports = ChatRoutes;