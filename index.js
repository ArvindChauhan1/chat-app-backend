const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();

const PORT = 4500 || process.env.PORT;

const users = [{}];

app.use(cors())

app.get("/", (req, res) => {
    res.send("<h1>Server is Working</h1>")
})

const server = http.createServer(app);

const io = socketIO(server)

io.on("connection", (socket) => {
    console.log("new connection");

    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        console.log(`${user} has joined`)
        socket.broadcast.emit('userJoined', { user: "Admin", message: `${users[socket.id]} has joined}` })
        socket.emit('welcome', { user: "Admin", message: `Welcome to the chat, ${users[socket.id]}` })
    })

    socket.on('message', ({ message,id }) => {
        io.emit('sendMessage',{user:users[id],message,id})
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', { user: "Admin", message: `user has left` })
        console.log(`user left`)
    })

})

server.listen(PORT, () => {
    console.log(`Server is working on http://localhost:${PORT}`);
})