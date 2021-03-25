const { response } = require("express");
const Usuario = require("../models/usuario");


const getUsuarios = async (req, res = response) => {

    // Setup pagination
    const desde = Number(req.query.desde) || 0;

    const usuarios = await Usuario
        .find({_id: {$ne: req.uid}}) // filter usuario distinct of usuario client
        .sort('-online')
        .skip(desde) // Pagination implementation
        .limit(20) // Limit of items getted

    res.json({
        ok: true,
        usuarios: usuarios
    });

}

module.exports = {
    getUsuarios
}