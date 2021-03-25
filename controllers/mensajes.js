const { response } = require("express");
const Mensaje = require("../models/mensaje");


const getMensajes = async (req, res = response) => {

    const miId = req.uid;
    const mensajeDe = req.params.de;

    // Get last 30 messages
    const last30 = await Mensaje.find({
        $or: [{de: miId, para: mensajeDe}, {de: mensajeDe, para: miId}]
    })
    .sort({createdAt: 'desc'})
    .limit(30);

    res.json({
        ok: true,
        mensajes: last30
    });
    
    // // Setup pagination
    // const desde = Number(req.query.desde) || 0;

    // const usuarios = await Usuario
    //     .find({_id: {$ne: req.uid}}) // filter usuario distinct of usuario client
    //     .sort('-online')
    //     .skip(desde) // Pagination implementation
    //     .limit(20) // Limit of items getted



}

module.exports = {
    getMensajes
}