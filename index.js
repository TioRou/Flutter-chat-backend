const express = require('express');
const path = require('path');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('./controllers/socket');
const { comprobarJWT } = require('./helpers/jwt');
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
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/mensajes', require('./routes/mensajes'));

app.use(express.static(publicPath));

// Node server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    // Check authentication
    if (!valido) {return client.disconnect();}

    // Client authentication checked
    usuarioConectado(uid)

    // Ingresar al usuario a una sala específica
    client.join(uid);

    // Escuchar del cliente el mensaje personal
    client.on('mensaje-personal', async (payload) => {
        await grabarMensaje(payload);

        io.to(payload.para).emit('mensaje-personal', payload);
    });

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

});

server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);

    console.log('Servidor corriendo en puerto!!!', process.env.PORT);
});