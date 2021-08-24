const express = require("express")
const httpServer = require("http").createServer()
const app = express()

let noOfUsers = 0
let users = []
let GLOBAL_ROOM = "Lounge"

app.use(express.static('public'))

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  socket.on("new-connection", (data) => {
    noOfUsers++
    const { username } = data
    users.push({ username, id: socket.id })
    socket.join(GLOBAL_ROOM)
  })

  socket.on("send-welcome-msg", (username) => {
    socket.to(GLOBAL_ROOM).emit("welcome-msg", { username })
  })

  socket.on("new-msg", (data) => {
    const { username, message } = data
    socket.broadcast.emit("broadcast-msg", { username, message })
  })

  socket.on("disconnect", (id) => {
    noOfUsers--
    let index = -1
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) index = i
    }
    if (index !== -1) users.splice(index, 1)
  })
})

httpServer.listen(3000);