const clientIO = io();

const username = localStorage.getItem("username");
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
    // Clear chat
    // Get chat messages
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
    $.get(`/messages/${messageInfo.username}/${messageInfo.recipient}`)
        .done(function(data) {
            console.log("Conversation history:", data);
            // Logic to render messages to the UI goes here
        })
        .fail(function(error) {
            console.error("Error fetching messages:", error.responseJSON);
        });
}

const logout = () => {
    localStorage.clear();
    window.location.href = "/login.html";
}

const buttonAck = (e) => {
    console.log(e);
}