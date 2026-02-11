const userModel = require("../models/UserModel");
const express = require('express');
const UserRoutes = express.Router();

UserRoutes.post('/signup', async (req, res) => {
    const user = new userModel(req.body);
    console.log(user);
    try {
        const newUser = await user.save();
        return res.status(201).send({
            message: "User created successfully",
            user_id: newUser._id
        });
    } catch (err) {
        return res.status(500).send(
            err.message
        );
    }
});

UserRoutes.post('/login', async (req, res) => {
    console.log(req.body);
    console.log(req.body.username);
    try {
        const user = await userModel.findOne({username: req.body.username});
        if (!user) {
            return res.status(401).send({
                status: false,
                message: "Invalid username or password"
            });
        }

        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(401).send({
                status: false,
                message: "Invalid username or password"
            });
        }

        return res.status(201).send("Logged in successfully");
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        });
    }
});

module.exports = UserRoutes;