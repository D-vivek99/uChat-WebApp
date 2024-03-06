// server.js
const express = require('express');
const http = require('http');
const cors = require("cors");
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static('public'));
app.use(cors());

// Store usernames
const users = {};

// Socket.IO events
io.on('connection', (socket) => {

    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    })

    // Event for when a user disconnects
    socket.on('disconnect', () => {
        socket.broadcast.emit('user left', users[socket.id]);
        delete users[socket.id];
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
