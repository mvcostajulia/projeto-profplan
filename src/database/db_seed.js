const bcrypt = require("bcryptjs");
const { connectToDb, getDb} = require('./db');

async function seedUsuario() {
  try {
    await connectToDb();
    const db = getDb();
    const usuarios = db.collection("usuarios");
    const matricula = "1234";
    const existe = await usuarios.findOne({ matricula });
    if (existe) {
      console.log("Usuário de teste já existe");
      return;
    }
    const senhaHash = await bcrypt.hash("1234", 10);
    const novoUsuario = {
      nome:"Teste", 
      matricula:matricula, 
      area:"Tecnologia da Informação",
      email:"teste@teste.com", 
      funcao:"Administrador", 
      status:"Ativo", 
      senha:senhaHash,
      avatar:"http://localhost:3000/img/avatares/semfoto.png"
    };
    await usuarios.insertOne(novoUsuario);

    console.log("Usuário de teste criado com sucesso");
  } catch (err) {
    console.error("Erro no seed:", err.message);
  } finally {
  }
}

seedUsuario();