const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true,
    },
    group: {
        type: String,
        required: false,
        default: null,
    },
    recipient: {
        type: String,
        required: false,
        default: null,
    },
    sender: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
})

const ChatModel = mongoose.model("ChatModel", ChatSchema);
module.exports = ChatModel;