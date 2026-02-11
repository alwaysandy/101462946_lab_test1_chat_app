require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const iosocket = require('socket.io');

const UserModel = require("./models/UserModel");
const UserRouter = require("./routes/UserRoutes");
const ChatRouter = require("./routes/ChatRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/chat.html'))
})
app.use(UserRouter);
app.use(ChatRouter);

var dbUrl = process.env.MONGO_URI;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(success => {
    console.log(`MongoDB connected ${success}`)
}).catch(err => {
    console.log(`Error while MongoDB connection ${err}`)
});

const server = app.listen(3001, () => {
    console.log('server is running on port', server.address().port);
});

const io = iosocket(server);
const users = []
const usernames = [];
UserModel.find({}).select('username').then((users) => {
    users.map((user) => {
        usernames.push(user.username);
    });
});

io.on('connection', (socket) => {
    if (!users.includes(socket.id)) {
        users.push(socket.id);
    }

    io.emit('all-users', usernames);

    socket.on('join-group', (group) => {
        console.log("Joining" + group);
        socket.join(group);
    })

    socket.on('leave-group', (group) => {
        console.log("Leaving" + group);
        socket.leave(group);
    })

    socket.on('disconnect', () => {
        const index = users.indexOf(socket.id);
        if (index !== -1) {
            users.splice(index, 1);
        }
    })

})