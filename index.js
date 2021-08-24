const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = module.exports.io = require("socket.io")(server)

let noOfUsers = 0
let users = []
let GLOBAL_ROOM = "Lounge"

app.use(express.static(__dirname + './public'))

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

server.listen(process.env.PORT || 3000)