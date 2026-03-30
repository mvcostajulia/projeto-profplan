const jwt = require('jsonwebtoken');

function renovarToken(req, res, next) {
    const token = req.cookies.Token;
    if (!token) return next();
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const novoToken = jwt.sign(
            { matricula: decoded.matricula, funcao: decoded.funcao, area: decoded.area },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('Token', novoToken, { httpOnly: true, secure: true });
    } catch (err) {
    }

    next();
}
 module.exports = renovarToken;