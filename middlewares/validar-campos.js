const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        console.log(errores.mapped());
        
        var msg = "";

        // Validate the type of error depending of checks made in routes/auth.js
        // Save the 'msg' value en var 'msg'
        if (errores.mapped().email) {
            msg = errores.mapped().email["msg"];
        } else if (errores.mapped().password) {
            msg = errores.mapped().password["msg"];
        }

        return res.status(400).json({
            ok: false,
            msg: msg
        });
    }
        
    next();
    
}

module.exports = {
    validarCampos
}