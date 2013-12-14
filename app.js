var express = require('express'),
        path = require('path'),
        http = require('http'),
        cons = require('consolidate'),
        user = require("./models/users.js");

var app = express();


app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.engine(".html", cons.jade);
    app.set("view engine", "html");
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

var server = http.createServer(app);

server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

app.get('/', function(req, res) {
    res.render('index');
});

io.sockets.on('connection', function(socket) {
    // cuando el cliente emite 'sendchat', este escucha y ejecuta
    socket.on('sendchat', function(data) {
        // El cliente ejecuta 'updatechat' con 2 parametros
        io.sockets.emit('updatechat', socket.username, data);
    });

    // cuando el cliente emite 'adduser', este escucha y ejecuta
    socket.on('adduser', function(username) {
        if (user.findUser(username) > -1) {
            socket.emit('errorchat', username, 'Usuario ya existe');
        } else {
            username = user.addUser(username);
            socket.username = username;
            // Emite un mensaje que el cliente se ha conectado
            socket.emit('updatechat', username, ' Te has conectado');
            // Emite mensaje a todos los clientes que un cliente se ha conectado
            socket.broadcast.emit('updatechat', username, ' se ha conectado');
            // Actualiza la lista de usuario en el lado del cliente
            io.sockets.emit('updateusers', user.getUsers());
        }

    });

    var obj_locations = {};

    socket.on('add:locations', function(location) {
        var user_id = socket.username;
        location.user_id = user_id;
        obj_locations[user_id] = location;
        socket.emit('user:locations', user_id);
        socket.broadcast.emit('update:locations', obj_locations);
    });

    // Cuando el usuario se desconecta
    socket.on('disconnect', function() {
        if (user.deleteUser(socket.username) === true) {
            var user_id = socket.username;
            // Actualiza la lista de usuarios en el lado del cliente
            io.sockets.emit('updateusers', user.getUsers());
            // Emite un mensdaje globalmente que el usuario se ha desconectado
            socket.broadcast.emit('updatechat', socket.username, ' se ha desconectado');
            delete obj_locations[user_id];
            socket.broadcast.emit('update:locations', obj_locations);
        }
    });

});