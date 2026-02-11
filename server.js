const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const UserRouter = require("./routes/UserRoutes");

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use(UserRouter);

var dbUrl = '<Put Mongo Atlas DB Connection link'
mongoose.connect(dbUrl , { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('mongodb connected',err);
    }else{
        console.log('Successfully mongodb connected');
    }
})

var server = http.listen(3001, () => {
    console.log('server is running on port', server.address().port);
});