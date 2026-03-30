const { connectToDb, closeConnection, getDb, ObjectId } = require('./db');

const pesquisarCurso = async (termo) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_cursos = bd.collection("cursos");
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
            { nome: { $regex: termo, $options: 'i' } }
        ];
    }
    }
    const encontrar = await collection_cursos.find(query).toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null;
    }
    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar curso:", err.message);
    throw err;
  }
};

const encontrarCurso = async () => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_cursos = bd.collection("cursos");
    const encontrar = await collection_cursos.find().toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null; 
    }
    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar curso:", err.message);
    throw err;
  }
};

const filtrarCurso = async ({area, habilitacao}) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_cursos = bd.collection("cursos");
    let query = {};
    if (area) {
      query.area = { $regex: area, $options: 'i' };
    }
    if (habilitacao) {
      query.habilitacao = { $regex: habilitacao, $options: 'i' };
    }

    const encontrar = await collection_cursos.find(query).toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null;
    }

    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar curso:", err.message);
    throw err;
  }
};

const criarCurso = async (nome, codigo, externo, carga, habilitacao, area, ucs) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_cursos = bd.collection("cursos");
    nome=nome.toUpperCase();
    codigo=codigo.toUpperCase();
    const novoCurso = {
      nome:nome, codigo:codigo, externo:externo, carga:carga, habilitacao:habilitacao, area:area, ucs:ucs
    }
    const resultado = await collection_cursos.insertOne(novoCurso);
    return resultado.insertedId;
  } catch (err) {
    console.error("Erro ao inserir curso:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

const editarCurso = async (id, curso) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_cursos = bd.collection("cursos");
    const editar = await collection_cursos.updateOne({_id:ObjectId.createFromHexString(id)}, {$set: curso});
    if (editar.modifiedCount === 0) {
      console.log("Nenhum documento foi alterado.");
      return null; 
    }
    console.log("Curso atualizada com sucesso!");
    return editar;
  } catch (err) {
    console.error("Erro ao atualizar curso:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

const deletarCurso = async (id) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_cursos = bd.collection("cursos");
    const deletar = await collection_cursos.deleteOne({_id:ObjectId.createFromHexString(id)});
    if (deletar.modifiedCount === 0) {
      console.log("Nenhum documento foi deletado.");
      return null; 
    }
    console.log("Curso deletada com sucesso!");
    return deletar;
  } catch (err) {
    console.error("Erro ao deletar curso:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

module.exports = {
  encontrarCurso,
  pesquisarCurso,
  criarCurso,
  editarCurso,
  deletarCurso,
  filtrarCurso
};
