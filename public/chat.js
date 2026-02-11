const clientIO = io();

const username = localStorage.getItem("username");
let isTyping = false;

if (!username) {
    window.location.href = "/login.html";
} else {
    clientIO.emit('join', username);
}

const messageInfo = {
    username: localStorage.username,
    group: null,
    recipient: null
}

clientIO.on('all-users', (data) => {
    console.log(data);
    const $container = $('#user-list');
    $container.empty();
    $.each(data, function(index, chatuser) {
        if (chatuser === username) {
            return;
        }
        // Create the button with the same classes and attributes as your template
        $('<button>')
            .attr('id', chatuser)
            .attr('onclick', 'toRecipient(this.id)')
            .addClass('btn btn-primary text-start user-recipient')
            .text(chatuser)
            .appendTo($container);
    });
});

clientIO.on('group-message', (data) => {
    addMessage(data.message, data.sender);
})

const joinGroup = (group) => {
    if (messageInfo.group == group) {
        return;
    }

    if (messageInfo.group !== null) {
        clientIO.emit('leave-group', group);
    }

    messageInfo.recipient = null;
    clientIO.emit('join-group', group);
    messageInfo["group"] = group;

    $("#sending-to").text("Group: " + group);
    $.get(`/group-messages/${messageInfo.group}`)
        .done(function(data) {
            fillChatBox(data);
            // Logic to render messages to the UI goes here
        })
        .fail(function(error) {
            console.error("Error fetching messages:", error.responseJSON);
        });
}

const toRecipient = (recipient) => {
    if (messageInfo.recipient == recipient) {
        return;
    }

    if (messageInfo.group !== null) {
        clientIO.emit('leave-group', messageInfo.group);
    }

    messageInfo.group = null;
    messageInfo.recipient = recipient;
    $('#sending-to').text("Recipient: " + recipient);

    $.get(`/direct-messages/${messageInfo.username}/${messageInfo.recipient}`)
        .done(function(data) {
            fillChatBox(data);
            // Logic to render messages to the UI goes here
        })
        .fail(function(error) {
            console.error("Error fetching messages:", error.responseJSON);
        });
}

const fillChatBox = (messages) => {
    const chatBox = $("#chat-box");
    chatBox.empty();
    messages.forEach(function(message) {
        // "<p class=\"p-2 bg-light rounded\">Hey, how's the project going? <br>Sent by: Andy</p>"
        $('<p>')
            .addClass('p-2 bg-light rounded')
            .text(message.message + " Sent by: " + message.sender)
            .appendTo(chatBox);
    })
}

const addMessage = (message, sender) => {
    const chatBox = $("#chat-box");
    $('<p>')
        .addClass('p-2 bg-light rounded')
        .text(message + " Sent by: " + sender)
        .appendTo(chatBox);
}

$("#send-message").click(() => {
    clientIO.emit('isnt-typing-from-client', messageInfo);
    const messageBox = $("#message");
    const message = messageBox.val();
    messageBox.val("");
    if (message) {
        const payload = {
            sender: messageInfo.username,
            message: message,
            group: messageInfo.group,
            recipient: messageInfo.recipient
        }

        if (messageInfo.group !== null) {
            clientIO.emit('group-message-from-client', payload);
        } else {
            clientIO.emit('direct-message-from-client', payload);
        }
    }
});

clientIO.on('group-message-from-server', (data) => {
    addMessage(data.message, data.sender);
})

clientIO.on('direct-message-from-server', (data) => {
    addMessage(data.message, data.sender);
})

clientIO.on('is-typing-from-server', (data) => {
    const isTypingBox = $('#typing-indicators');
    isTypingBox.empty();
    for (let user of data) {
        if (user === messageInfo.username) {
            continue;
        }
        $('<small>')
            .css('font-style', 'italic')
            .text(user + " is typing")
            .appendTo(isTypingBox);
    }
});

$("#leave-room").click(() => {
    if (messageInfo.group !== null) {
        clientIO.emit('leave-group', messageInfo.group);
    }
    $('#sending-to').text("Select a Chat");
    messageInfo.recipient = null;
    messageInfo.group = null;
    const chatBox = $("#chat-box");
    chatBox.empty();
});

$("#message").on('input', (e) => {
    if (e.target.value == "") {
        clientIO.emit('isnt-typing-from-client', messageInfo);
    } else {
        clientIO.emit('is-typing-from-client', messageInfo);
    }
})

$("#logout").click(() => {
    localStorage.clear();
    window.location.href = "/login.html";
    messageInfo = {};
});