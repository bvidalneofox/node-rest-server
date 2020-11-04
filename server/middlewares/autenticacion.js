const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok: false,
                error: err
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if(usuario.role !== 'ADMIN_ROLE'){

        return res.status(401).json({
            ok: false,
            error: {
                message: 'No cuenta con los permisos para realizar esta acción'
            }
        });

    }

    next();

};

module.exports = {
    verificaToken,
    verificaAdminRole
}