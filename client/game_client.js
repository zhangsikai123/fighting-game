const Player = function(socket) {
  this.socket = socket;
};

Player.prototype.keyDown = function(key) {
  this.socket.emit('keyDown', {
    user: 1,
    key: key,
  });
};

Player.prototype.keyUp = function(key) {
  this.socket.emit('keyUp', {
    user: 1,
    key: key,
  });
};
