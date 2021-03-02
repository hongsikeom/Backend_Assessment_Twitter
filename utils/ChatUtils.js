// This funcitonality was not tested yet!

// Chat
const app = require('../app');
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const { userInChat, getCurrentUser, deleteUser, getUsersInSameRoom } = require('./userList');


// Socket
io.on('connection', socket => {
    socket.on('chatRoom', ({username, room}) => {
        // Create user object
        const user = userInChat(socket.id, username, room);
        socket.join(user.room);

        // Send to the user just being connected
        socket.emit('msg', 'Welcom to ChatCord!');
        // Send to the users in the room
        socket.boradcast.to(user.room).emit('msg', `${user.username} has joined the chat`);

        // Send current room info and users in the room
        io.to(user.room).emit({
            room: user.room,
            users: getUsersInSameRoom(user.room)
        });
    });


    // Listen for chatMessage
    socket.on('chatMsg', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('msg', msg);
    });


    // User disconnects
    socket.on('disconnect', () => {
        const user = deleteUser(socket.id);
        if (user) {
            io.emit('msg', `${user.username} has left the chat`);

            // Send current room info and users in the room
            io.to(user.room).emit({
                room: user.room,
                users: getUsersInSameRoom(user.room)
            });
        }
    });
});