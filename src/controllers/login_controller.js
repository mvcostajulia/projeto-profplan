const { connectToDb, closeConnection, getDb, ObjectId } = require('../database/db');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function logar(body, res) {
    const { matricula, senha } = body; 

    if (!matricula || !senha) {
        return res.json({ erro: 'Dados insuficientes' });
    }
    try {
        await connectToDb();
        const bd = getDb();
        const collection_usuarios = bd.collection("usuarios");
        const usuario = await collection_usuarios.findOne({ matricula });
        if (!usuario) {
            return res.redirect('/?erro=true');
        }
        if (usuario.status !== 'Ativo') {
            return res.redirect('/?erro=true');
        }
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.redirect('/?erro=true');
        }
        
        const token = jsonwebtoken.sign(
            { matricula: usuario.matricula, funcao: usuario.funcao, area:usuario.area },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.cookie('Token', token, { httpOnly: true, secure: true });
        return res.redirect('/index');
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }finally {
        await closeConnection();
    }
}

module.exports = logar;
