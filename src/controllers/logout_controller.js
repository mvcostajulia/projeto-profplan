async function deslogar(req, res) {
    try {
        sessionStorage.setItem('usuarioLogado', JSON.stringify(""));
        res.clearCookie('Token');
        return res.redirect('/');
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = deslogar;
