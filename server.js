require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const UserRouter = require("./routes/UserRoutes");

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));
app.use(UserRouter);

var dbUrl = process.env.MONGO_URI;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(success => {
    console.log(`MongoDB connected ${success}`)
}).catch(err => {
    console.log(`Error while MongoDB connection ${err}`)
});

var server = http.listen(3001, () => {
    console.log('server is running on port', server.address().port);
});