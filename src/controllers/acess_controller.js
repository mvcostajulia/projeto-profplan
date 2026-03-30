const jsonwebtoken = require('jsonwebtoken');

const authorize = (roles = [],redirectTo = null) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ erro: "Usuário não autenticado" });
        }
        if (roles.length && !roles.includes(req.usuario.funcao)) {
            if (redirectTo) {
                return res.redirect(`${redirectTo}?erro=acesso`);
            }
        }
        next();
    };
};

module.exports = authorize;