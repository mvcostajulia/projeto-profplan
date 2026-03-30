const jsonwebtoken = require('jsonwebtoken');

function verificarAutenticacao(req, res, next) {
    const token = req.cookies.Token; 
    if (!token) {
        return res.redirect('/');
    }

    try {
        const usuario = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.usuario = usuario; 
        next(); 
    } catch (err) {
        return res.redirect('/');
    }
}

module.exports = verificarAutenticacao;

