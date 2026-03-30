const { connectToDb, closeConnection, getDb, ObjectId } = require('./db');

const pesquisarTurma = async (termo) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_turmas = bd.collection("turmas");
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
            { codigo: { $regex: termo, $options: 'i' } },
            { nome: { $regex: termo, $options: 'i' } }
        ];
    }
    }
    const encontrar = await collection_turmas.find(query).toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null;
    }
    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar turma:", err.message);
    throw err;
  }
};

const encontrarTurma = async () => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_turmas = bd.collection("turmas");
    const encontrar = await collection_turmas.find().toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null; 
    }
    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar turma:", err.message);
    throw err;
  }
};

const filtrarTurma = async ({datainicial, datafinal, status, turno, curso}) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_turmas = bd.collection("turmas");
    let query = {};
    if (datainicial) {
      const dataInicial = new Date(datainicial);
      if (!isNaN(dataInicial)) {
        query.data_inicio = { $gte: dataInicial };
      }
    }
    if (datafinal) {
      const dataFinal = new Date(datafinal);
      if (!isNaN(dataFinal)) {
        query.data_fim = { $lte: dataFinal };
      }
    }
    if (status) {
      query.status = { $regex: status, $options: 'i' };
    }
    if (turno) {
      query.turno = { $regex: turno, $options: 'i' };
    }

    if (curso) {
      query.curso = { $regex: curso, $options: 'i' };
    }

    const encontrar = await collection_turmas.find(query).toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null;
    }

    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar turma:", err.message);
    throw err;
  }
};

const criarTurma = async (nome, curso, modulo, origem, turno, data_inicio, data_fim, observacoes) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_turmas = bd.collection("turmas");
    nome=nome.toUpperCase();
    const novaTurma = {
      nome:nome, curso:curso, modulo:modulo, codigo:"Indefinido", origem:origem, turno:turno, data_inicio:new Date(data_inicio), data_fim:new Date(data_fim), observacoes:observacoes, status:"Provisório"
    }
    const resultado = await collection_turmas.insertOne(novaTurma);
    return resultado.insertedId;
  } catch (err) {
    console.error("Erro ao inserir turma:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

const editarTurma = async (id, turma) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_turmas = bd.collection("turmas");
    const editar = await collection_turmas.updateOne({_id:ObjectId.createFromHexString(id)}, {$set: turma});
    if (editar.modifiedCount === 0) {
      console.log("Nenhum documento foi alterado.");
      return null; 
    }
    console.log("Turma atualizada com sucesso!");
    return editar;
  } catch (err) {
    console.error("Erro ao atualizar turma:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

const deletarTurma = async (id) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_turmas = bd.collection("turmas");
    const deletar = await collection_turmas.deleteOne({_id:ObjectId.createFromHexString(id)});
    if (deletar.modifiedCount === 0) {
      console.log("Nenhum documento foi deletado.");
      return null; 
    }
    console.log("Turma deletada com sucesso!");
    return deletar;
  } catch (err) {
    console.error("Erro ao deletar turma:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

module.exports = {
  encontrarTurma,
  pesquisarTurma,
  criarTurma,
  editarTurma,
  deletarTurma,
  filtrarTurma
};
