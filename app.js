var express = require('express')
, path = require('path')
, http = require('http');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.static(path.join(__dirname, 'public')));
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);


app.get('/', function (req, res) {
  res.render('index.jade');
});

var usernames = {};

io.sockets.on('connection', function (socket) {
  // cuando el cliente emite 'sendchat', este escucha y ejecuta
  socket.on('sendchat', function (data) {
    // El cliente ejecuta 'updatechat' con 2 parametros
    io.sockets.emit('updatechat', socket.username, data);
  });

  // cuando el cliente emite 'adduser', este escucha y ejecuta
  socket.on('adduser', function(username){
    socket.username = username;
    usernames[username] = username;
    // Emite un mensaje que el cliente se ha conectado
    socket.emit('updatechat', 'SERVER', ' se ha conectado');
    // Emite mensaje a todos los clientes que un cliente se ha conectado
    socket.broadcast.emit('updatechat', 'SERVER', username + ' se ha conectado');
    // Actualiza la lista de usuario en el lado del cliente
    io.sockets.emit('updateusers', usernames);
  });

  // Cuando el usuario se desconecta
  socket.on('disconnect', function(){
    // elimina el nombre de suario de la lista de usuarios
    delete usernames[socket.username];
    // Actualiza la lista de usuarios en el lado del cliente
    io.sockets.emit('updateusers', usernames);
    // Emite un mensdaje globalmente que el usuario se ha desconectado
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' se ha desconectado');
  });

});