const { connectToDb, closeConnection, getDb, ObjectId } = require('./db');

const pesquisarTecnico = async (termo) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_tecnicos = bd.collection("tecnicos");
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
            { nome: { $regex: termo, $options: 'i' }},
            {matricula: { $regex: termo, $options: 'i' } }
        ];
    }
    }
    const encontrar = await collection_tecnicos.find(query).toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null;
    }
    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar tecnico:", err.message);
    throw err;
  }
};

const pesquisarMatriculaTec = async (matricula) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_tecnicos = bd.collection("tecnicos");
    let query = {matricula: matricula.termo};
    const encontrar = await collection_tecnicos.find(query).toArray();
    if (encontrar.length === 0) {
      return null;
    }
    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar conta:", err.message);
    throw err;
  }
};

const encontrarTecnico = async () => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_tecnicos = bd.collection("tecnicos");
    const encontrar = await collection_tecnicos.find().toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null; 
    }
    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar tecnico:", err.message);
    throw err;
  }
};

const filtrarTecnico = async ({area, turno, status}) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_tecnicos = bd.collection("tecnicos");
    let query = {};
    if (area) {
      query.area = { $regex: area, $options: 'i' };
    }
    if (turno) {
      query.turno = { $regex: turno, $options: 'i' };
    }
    if (status) {
      query.status = {$eq: status};
    }
    

    const encontrar = await collection_tecnicos.find(query).toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null;
    }

    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar tecnico:", err.message);
    throw err;
  }
};

const criarTecnico = async (nome, matricula, tipoContratacao, area, turno, status, horarios, ausencias) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_tecnicos = bd.collection("tecnicos");
    nome=nome.toUpperCase();
    const novoTecnico = {
      nome:nome, matricula:matricula, tipoContratacao:tipoContratacao, area:area, turno:turno, tipoContratacao:tipoContratacao, status:status, horarios:horarios, ausencias:ausencias
    }
    const resultado = await collection_tecnicos.insertOne(novoTecnico);
    return resultado.insertedId;
  } catch (err) {
    console.error("Erro ao inserir tecnico:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

const editarTecnico = async (id, tecnico) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_tecnicos = bd.collection("tecnicos");
    const editar = await collection_tecnicos.updateOne({_id:ObjectId.createFromHexString(id)}, {$set: tecnico});
    if (editar.modifiedCount === 0) {
      console.log("Nenhum documento foi alterado.");
      return null; 
    }
    console.log("Tecnico atualizado com sucesso!");
    return editar;
  } catch (err) {
    console.error("Erro ao atualizar tecnico:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

const editarStatusTecnico = async (id,status) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_tecnicos = bd.collection("tecnicos");
    const editar = await collection_tecnicos.updateOne({_id:ObjectId.createFromHexString(id)}, {$set: {status: status}});

    if (editar.modifiedCount === 0) {
      console.log("Nenhum documento foi alterado.");
      return null;
    }

    console.log("Técnico atualizado com sucesso!");
    return editar;
  } catch (err) {
    console.error("Erro ao atualizar técnico:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};


const deletarTecnico = async (id) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_tecnicos = bd.collection("tecnicos");
    const deletar = await collection_tecnicos.deleteOne({_id:ObjectId.createFromHexString(id)});
    if (deletar.modifiedCount === 0) {
      console.log("Nenhum documento foi deletado.");
      return null; 
    }
    console.log("Tecnico deletado com sucesso!");
    return deletar;
  } catch (err) {
    console.error("Erro ao deletar tecnico:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

module.exports = {
  encontrarTecnico,
  pesquisarTecnico,
  criarTecnico,
  editarTecnico,
  editarStatusTecnico,
  deletarTecnico,
  filtrarTecnico,
  pesquisarMatriculaTec
};
