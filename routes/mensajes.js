/*
    path: /api/mensajes 
*/

const {Router} = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getMensajes } = require('../controllers/mensajes');

const router = Router();

router.get('/:de', validarJWT, getMensajes )

module.exports = router;