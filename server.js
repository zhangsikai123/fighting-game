const express = require('express');
const gameServer = require('./server/game_server');
const app = express();
const http = require('http');
const server = http.createServer(app);
app.use(express.static(__dirname));
gameServer.listen(server);
server.listen(3000, () => {
  console.log('listening on *:3000');
});
