/*
    path: /api/login 
*/

const {Router} = require('express');
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// New user
router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'La contraseña debe tener, al menos, 8 caracteres').isLength({min: 8}),
    check('password', 'La contraseña debe contener, al menos, un número').matches('[0-9]'),
    check('password', 'La contraseña debe contener, al menos, una minúscula').matches('[a-z]'),
    check('password', 'La contraseña debe contener, al menos, una mayúscula').matches('[A-Z]'),
    check('password', 'La contraseña debe contener, al menos, un carácter especial').matches('[!@#%&():;<>/=?]'),
    validarCampos
], crearUsuario); 

// Login
router.post('/', [
    check('email', 'El email es obligatorio').normalizeEmail().isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login); 

// Validar/Renovar JWT
router.get('/renew', validarJWT, renewToken )

module.exports = router;