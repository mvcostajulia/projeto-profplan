const { connectToDb, closeConnection, getDb, ObjectId } = require('./db');

const criarLog = async (idDocumento, usuario, acao) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_logs = bd.collection("logs");
    const novoLog = {
      idDocumento:idDocumento, acao:acao, usuario:usuario, dataAcao:new Date() 
    }
    const resultado = await collection_logs.insertOne(novoLog);
    return resultado.insertedId;
  } catch (err) {
    console.error("Erro ao inserir log:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

const criarLogExclusao = async (idDocumento, acao, usuario, dadosExcluidos) => {
  try {
    await connectToDb();
    const bd = getDb();
    const collection_logs = bd.collection("logs");
    const novoLog = {
      idDocumento:idDocumento, acao:acao, usuario:usuario, dataAcao:new Date(), dadosExcluidos 
    }
    const resultado = await collection_logs.insertOne(novoLog);
    return resultado.insertedId;
  } catch (err) {
    console.error("Erro ao inserir log:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

module.exports = {
  criarLog,
  criarLogExclusao,
};
