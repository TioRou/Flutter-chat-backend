const response = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

// Nuevo usuario
const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body;

    try {

        const existeEmail = await Usuario.findOne({email});
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya existe en la base de datos'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar mi JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

// Login
const login = async (req, res = response) => {

    const {email, password} = req.body;

    try {
        // Validar Email
        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Validar Password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es correcta'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuarioDB.id);        
        return res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

// Validar/Renovar JWT
const renewToken = async (req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuarioToken = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario: usuarioToken,
        token
    });
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}