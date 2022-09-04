const {Server} = require('socket.io');
const room = 'fight';

function handleKeyEvent(socket) {
  socket.on('keyDown', function(message) {
    const msg = {
      user: 1,
      key: message.key,
    };
    socket.emit('keyDown', msg);
    socket.broadcast.to(room).emit('keyDown', msg);
  });


  socket.on('keyUp', function(message) {
    const msg = {
      user: 1,
      key: message.key,
    };
    socket.emit('keyUp', msg);
    socket.broadcast.to(room).emit('keyUp', msg);
  });
};

function handleLeft(socket) {

}

function startGame(socket) {
  socket.emit('signal', 'start');
  socket.broadcast.to(room).emit('signal', 'start');
}

exports.listen = function(server) {
  const io = new Server(server);
  io.sockets.on('connection', (socket) => {
    socket.join(room);
    players = io.of('/').adapter.rooms.get(room);
    if(players.size == 2){
      startGame(socket);
    }
    handleKeyEvent(socket);
    handleLeft(socket);
  });
};
