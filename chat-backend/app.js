const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');

const publicPath = path.join(__dirname, '../', 'public');
app.use(express.static(publicPath));

app.get('/', function (req, res) {
  res.sendFile(path.join(publicPath, 'index.html'));
});

io.on('connection', function (socket) {
  console.log('connected');
  socket.on('username', function(username) {
    if (!username || !username.trim()) {
      return socket.emit('errorMessage', 'No username!');
    }
    socket.username = String(username);
  });

  socket.on('room', function(requestedRoom) {
    if (!socket.username) {
      return socket.emit('errorMessage', 'Username not set!');
    }
    if (!requestedRoom) {
      return socket.emit('errorMessage', 'No room!');
    }
    if (socket.room) {
      socket.leave(socket.room);
    }
    socket.room = requestedRoom;
    socket.join(requestedRoom, function() {
      socket.to(requestedRoom).emit('message', {
        username: 'System',
        content: socket.username + ' has joined'
      });
    });
  });

  socket.on('message', function(message) {
    if (!socket.room) {
      return socket.emit('errorMessage', 'No rooms joined!');
    }
    socket.to(socket.room).emit('message', {
      username: socket.username,
      content: message
    });
  })
});

const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log(`Backend server listening on port ${port}!`);
});
