const { connectToDb, closeConnection, getDb, ObjectId } = require('./db');
const bcrypt = require('bcryptjs');

const pesquisarConta = async (matricula) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_usuarios = bd.collection("usuarios");
    let query = {};
    if (matricula) {
        query.$or = [
            { matricula: { $regex: matricula, $options: 'i' } }
        ];
    }
    const encontrar = await collection_usuarios.find(query).toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null;
    }
    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar conta:", err.message);
    throw err;
  }
};

const pesquisarMatricula = async (matricula) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_usuarios = bd.collection("usuarios");
    let query = {matricula: matricula.termo};
    const encontrar = await collection_usuarios.find(query).toArray();
    if (encontrar.length === 0) {
      return null;
    }
    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar conta:", err.message);
    throw err;
  }
};

const pesquisarUsuario = async (termo) => {
    try {
      await connectToDb();
      const bd = getDb();
      const collection_usuarios = bd.collection("usuarios");
      let query = {};
      if (termo) {
        let objectId = null;
        try {
          objectId = ObjectId.createFromHexString(termo);
        } catch (error) {
          objectId = null;
        }
        if (objectId) {
          query.$or = [{ _id: objectId }];
        } else {
          query.$or = [
              { matricula: { $regex: termo, $options: 'i' } },
              { nome: { $regex: termo, $options: 'i' } }
          ];
      }
      }
      const encontrar = await collection_usuarios.find(query).toArray();
      if (encontrar.length === 0) {
        console.log("Nenhum documento foi encontrado.");
        return null;
      }
      return encontrar;
    } catch (err) {
      console.error("Erro ao encontrar usuário:", err.message);
      throw err;
    }
};

const encontrarUsuario = async (id) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_usuarios = bd.collection("usuarios");
    const encontrar = await collection_usuarios.find().toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null; 
    }
    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar usuário:", err.message);
    throw err;
  }
};

const filtrarUsuario = async ({funcao, status}) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_usuarios = bd.collection("usuarios");
    let query = {};
    if (funcao) {
      query.funcao = { $regex: funcao, $options: 'i' };
    }
    if (status) {
      query.status = { $regex: status, $options: 'i' };
    }
    const encontrar = await collection_usuarios.find(query).toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null;
    }

    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar usuario:", err.message);
    throw err;
  }
};

const criarUsuario = async (nome, matricula, area, email, funcao, status, senha) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_usuarios = bd.collection("usuarios");
    nome=nome.toUpperCase();
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = {
      nome:nome, 
      matricula:matricula, 
      area:area,
      email:email, 
      funcao:funcao, 
      status:status, 
      senha:senhaCriptografada,
      avatar:"http://localhost:3000/img/avatares/semfoto.png"
    }
    const resultado = await collection_usuarios.insertOne(novoUsuario);
    return resultado.insertedId;
  } catch (err) {
    console.error("Erro ao inserir usuário:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

const editarUsuario = async (id, usuario) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_usuarios = bd.collection("usuarios");
    if (usuario.senha) {
      usuario.senha = await bcrypt.hash(usuario.senha, 10);
    }
    const editar = await collection_usuarios.updateOne({_id:ObjectId.createFromHexString(id)}, {$set: usuario});
    if (editar.modifiedCount === 0) {
      console.log("Nenhum documento foi alterado.");
      return null; 
    }
    console.log("Usuário atualizado com sucesso!");
    return editar;
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

const deletarUsuario = async (id) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_usuarios = bd.collection("usuarios");
    const deletar = await collection_usuarios.deleteOne({_id:ObjectId.createFromHexString(id)});
    if (deletar.modifiedCount === 0) {
      console.log("Nenhum documento foi deletado.");
      return null; 
    }
    console.log("Usuário deletada com sucesso!");
    return deletar;
  } catch (err) {
    console.error("Erro ao deletar usuário:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};



module.exports = {
  encontrarUsuario,
  criarUsuario,
  editarUsuario,
  deletarUsuario,
  pesquisarConta,
  pesquisarUsuario,
  filtrarUsuario,
  pesquisarMatricula
};
