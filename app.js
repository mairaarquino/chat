var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};
app.get('/', (req, res) => {
    res.send('server is running');
});

// SocketIO
io.on('connection', function(client) {
    client.on('join', function(name) {
        console.log("Entrou: " + name)
        clients[client.id] = name;
        client.emit("update", "Bem-vindo ao chat!");
        client.broadcast.emit("update", name + " entrou");
    });

    client.on("send", function(msg) {
        console.log("Mensagem de " +clients[client.id] + ": " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function() {
        console.log("Disconnect");
        io.emit("update", clients[client.id] + " saiu");
        delete clients[client.id];
    })
    console.log('Usuário conectado.');
})

http.listen(3000, function() {
    console.log('listening on port 3000');
});