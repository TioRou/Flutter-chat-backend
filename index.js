const express = require('express');
const path = require('path');
require('dotenv').config();

// DB Config
require('./database/config').dbConnection();

// App de Express
const app = express();

// Lectura y parseo del body
app.use(express.json());

// Path público
const publicPath = path.resolve(__dirname, 'public');

// Mis rutas
app.use('/api/login', require('./routes/auth'));

app.use(express.static(publicPath));

// Node server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

});

server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);

    console.log('Servidor corriendo en puerto!!!', process.env.PORT);
});