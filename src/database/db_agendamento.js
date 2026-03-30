const { connectToDb, closeConnection, getDb, ObjectId } = require('./db');

const pesquisarAgendamento = async (termo) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_agendamentos = bd.collection("agendamentos");
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
      } 
    }
    const encontrar = await collection_agendamentos.find(query).toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null;
    }
    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar agendamento:", err.message);
    throw err;
  }
};

const coletaAgendamento = async (id) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_agendamentos = bd.collection("agendamentos");

    let query = {};

    if (id) {
      query["agendamentos.tecnico"] = new RegExp(`^${id} -`);
    }

    const encontrar = await collection_agendamentos.find(query).toArray();

    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null;
    }

    return encontrar;

  } catch (err) {
    console.error("Erro ao encontrar agendamento:", err.message);
    throw err;
  }
};


const encontrarAgendamento = async () => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_agendamentos = bd.collection("agendamentos");
    const encontrar = await collection_agendamentos.find().toArray();
    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null; 
    }
    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar agendamento:", err.message);
    throw err;
  }
};

const filtrarAgendamento = async ({ tecnico, turma }) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_agendamentos = bd.collection("agendamentos");

    let query = {};

    if (tecnico || turma) {
      query.agendamentos = {
        $elemMatch: {
          ...(tecnico && {
            tecnico: { $regex: tecnico, $options: "i" }
          }),
          ...(turma && {
            turma: { $regex: turma, $options: "i" }
          })
        }
      };
    }

    const encontrar = await collection_agendamentos.find(query).toArray();

    if (encontrar.length === 0) {
      console.log("Nenhum documento foi encontrado.");
      return null;
    }

    return encontrar;
  } catch (err) {
    console.error("Erro ao encontrar agendamento:", err.message);
    throw err;
  }
};


const criarAgendamento = async (modulo, agendamentos) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_agendamentos = bd.collection("agendamentos");
    modulo=modulo;
    const novoAgendamento = {
      modulo:modulo, agendamentos:agendamentos
    }
    const resultado = await collection_agendamentos.insertOne(novoAgendamento);
    return resultado.insertedId;
  } catch (err) {
    console.error("Erro ao inserir agendamento:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

const editarAgendamento = async (id, agendamento) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_agendamentos = bd.collection("agendamentos");
    const editar = await collection_agendamentos.updateOne({_id:ObjectId.createFromHexString(id)}, {$set: agendamento});
    if (editar.modifiedCount === 0) {
      console.log("Nenhum documento foi alterado.");
      return null; 
    }
    console.log("Agendamento atualizado com sucesso!");
    return id;
  } catch (err) {
    console.error("Erro ao atualizar agendamento:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

const deletarAgendamento = async (id) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_agendamentos = bd.collection("agendamentos");
    const deletar = await collection_agendamentos.deleteOne({_id:ObjectId.createFromHexString(id)});
    if (deletar.modifiedCount === 0) {
      console.log("Nenhum documento foi deletado.");
      return null; 
    }
    console.log("Agendamento deletado com sucesso!");
    return id;
  } catch (err) {
    console.error("Erro ao deletar agendamento:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

module.exports = {
  encontrarAgendamento,
  criarAgendamento,
  editarAgendamento,
  deletarAgendamento,
  filtrarAgendamento,
  pesquisarAgendamento,
  coletaAgendamento
};
