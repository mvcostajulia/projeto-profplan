const express = require("express");
require('dotenv').config();
const path = require('path');
const util = require('util'); 
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser"); 
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const tempStaticDir = path.join(os.tmpdir(), 'profplan_static');
const embeddedSrcPath = path.join(__dirname, 'src');
const PDFDocument = require("pdfkit");

const app=express();

const { connectToDb} = require("./src/database/db");
const { encontrarTurma, pesquisarTurma, criarTurma, editarTurma, deletarTurma, filtrarTurma} = require("./src/database/db_turma");
const { encontrarTecnico, pesquisarMatriculaTec, pesquisarTecnico, criarTecnico, editarTecnico, editarStatusTecnico, deletarTecnico, filtrarTecnico} = require("./src/database/db_tecnico");
const { encontrarUsuario, pesquisarConta, pesquisarUsuario, pesquisarMatricula, criarUsuario, editarUsuario, deletarUsuario, filtrarUsuario} = require("./src/database/db_usuario");
const { encontrarCurso, pesquisarCurso, criarCurso, editarCurso, deletarCurso,  filtrarCurso} = require("./src/database/db_curso");
const { encontrarAgendamento, coletaAgendamento, pesquisarAgendamento, criarAgendamento, editarAgendamento, deletarAgendamento,  filtrarAgendamento} = require("./src/database/db_agendamento");
const { criarLog, criarLogExclusao} = require("./src/database/db_logs");

const logar = require('./src/controllers/login_controller');
const deslogar = require('./src/controllers/logout_controller');
const verificarAutenticacao = require('./src/controllers/auth_controller');
const verificarAcesso = require('./src/controllers/acess_controller');
const renovarToken = require('./src/controllers/token_controller');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'src/calendarios')));
app.use(express.static(path.join(__dirname, 'src/agendamentos')));
app.use(express.static(path.join(__dirname, 'src/conta')));
app.use(express.static(path.join(__dirname, 'src/informacoes')));
app.use(express.static(path.join(__dirname, 'src/login')));
app.use(express.static(path.join(__dirname, 'src/shared')));
app.use(express.static(path.join(__dirname, 'src/tecnicos')));
app.use(express.static(path.join(__dirname, 'src/turmas')));
app.use(express.static(path.join(__dirname, 'src/usuarios')));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());
app.use(bodyParser.json());

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    fs.readdirSync(src).forEach(file => {
      copyRecursiveSync(
        path.join(src, file),
        path.join(dest, file)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(embeddedSrcPath, tempStaticDir);

// Conexão com o banco
connectToDb()
  .then(() => {
    console.log("Servidor e banco de dados conectados com sucesso");
  })
  .catch((err) => console.error("Erro ao conectar ao banco de dados", err));


// Middlewares de login
app.post('/api/logar', async (req, res) => {
  try {
      await logar(req.body, res); 
  } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/logout', async (req, res) => {
  try {
      await deslogar(req.body, res); 
  } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Geração de PDF - Em construção

/*
app.post('/gerar-pdf', async (req, res) => {
    try {
    const { calendarioRaw = [], horarios = [] } = req.body;
    const eventos = [...calendarioRaw, ...horarios];
    if (!eventos.length) return res.status(400).json({ erro: 'Nenhum evento recebido.' });

    const [_, mesStr, anoStr] = eventos[0].data.split('/');
    const mesNum = parseInt(mesStr);
    const anoNum = parseInt(anoStr);
    const nomeMeses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const eventosPorData = {};
    eventos.forEach(ev => {
      const data = ev.data;
      if (!eventosPorData[data]) eventosPorData[data] = [];
      eventosPorData[data].push(ev);
    });

    const primeiroDia = new Date(anoNum, mesNum - 1, 1).getDay();
    const totalDias = new Date(anoNum, mesNum, 0).getDate();
    const cores = ['#b3e5fc', '#ffccbc', '#dcedc8', '#f8bdb0', '#fff9c4', '#c5cae9', '#ffe0b2', '#c8e6c9'];
    const corPorData = {};
    const datas = Object.keys(eventosPorData);
    datas.forEach((data, i) => corPorData[data] = cores[i % cores.length]);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const filePath = path.join(__dirname, `calendario_${mesNum}_${anoNum}.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(18).text(`Calendário - ${nomeMeses[mesNum - 1]} ${anoNum}`, { align: 'center' });
    doc.moveDown(1);

    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const startX = 40;
    const startY = 100;
    const cellWidth = 75;
    const cellHeight = 70;

    doc.fontSize(10).fillColor('black');
    diasSemana.forEach((dia, i) => {
      const x = startX + i * cellWidth;
      doc.text(dia, x + cellWidth / 2 - doc.widthOfString(dia) / 2, startY - 15);
    });

    let diaAtual = 1;
    let linha = 0;
    let col = primeiroDia;

    while (diaAtual <= totalDias) {
      const x = startX + col * cellWidth;
      const y = startY + linha * cellHeight;
      const dataStr = `${String(diaAtual).padStart(2, '0')}/${String(mesNum).padStart(2, '0')}/${anoNum}`;
      const eventosDoDia = eventosPorData[dataStr] || [];
      const corFundo = eventosDoDia.length > 0 ? corPorData[dataStr] : 'var(--cor-base)';
      doc.save().rect(x, y, cellWidth, cellHeight).fillColor(corFundo).fill().restore();
      doc.rect(x, y, cellWidth, cellHeight).stroke();
      doc.font('Helvetica-Bold').fontSize(8).fillColor('black').text(`${diaAtual}`, x + 2, y + 2);
      diaAtual++; col++;
      if (col > 6) { col = 0; linha++; }
    }

    doc.moveDown(2);
    doc.fontSize(12).text('Legenda:', { underline: true });
    doc.moveDown(0.5);

    datas.forEach((data, i) => {
      const eventosDia = eventosPorData[data];
      const cor = corPorData[data];
      doc.save().rect(50, doc.y, 10, 10).fillColor(cor).fill().restore();
      doc.fillColor('black').fontSize(9).text(` ${data}`, 65, doc.y - 1);
      eventosDia.forEach(ev => {
        const turma = ev.turma ? ev.turma.split(' - ')[1] : ev.rotulo || '';
        const uc = ev.uc ? ev.uc.split(' - ')[1] : '';
        doc.text(`   • ${turma} - ${uc}`);
      });
      doc.moveDown(0.5);
    });

    doc.end();
    writeStream.on('finish', () => {
      res.download(filePath, `calendario_${mesNum}_${anoNum}.pdf`, err => {
        if (err) console.error(err);
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Falha ao gerar PDF.' });
  }
});
*/


// Middlewares das turmas
app.get('/turmas/gerenciar',verificarAutenticacao, async (req,res) => {
    try {
        await connectToDb();
        const turmas = await encontrarTurma();
        if (!turmas) {
          return res.status(404).json({ error: "Nenhuma turma encontrada." });
        }
        return res.status(200).json(turmas);
      } catch (err) {
        console.error("Erro ao processar a consulta:", err);
        return res.status(500).json({ error: "Erro ao buscar turmas.", details: err.message });
      }
});

app.get('/turmas/gerenciar/pesquisa/:termo',verificarAutenticacao, async (req,res) => {
  try {
      await connectToDb();
      const { termo } = req.params;
      if (!termo) {
        return res.status(400).json({ error: "Termo de pesquisa não fornecido." });
      }
      const turmas = await pesquisarTurma(termo);
      if (!turmas) {
        return res.status(404).json({ error: "Nenhuma turma encontrada." });
      }
      return res.status(200).json(turmas);
    } catch (err) {
      console.error("Erro ao processar a consulta:", err);
      return res.status(500).json({ error: "Erro ao buscar turmas.", details: err.message });
    }
});

app.get('/turmas/gerenciar/filtrar', verificarAutenticacao, async (req, res) => {
  try {
    await connectToDb();
    const { datainicial, datafinal, status, turno, curso } = req.query;
    const turmas = await filtrarTurma({ datainicial, datafinal, status, turno, curso });
    if (!turmas || turmas.length === 0) {
      return res.status(404).json({ error: "Nenhuma turma encontrada." });
    }
    return res.status(200).json(turmas);
  } catch (err) {
    console.error("Erro ao processar a consulta:", err);
    return res.status(500).json({ error: "Erro ao buscar turmas.", details: err.message });
  }
});


app.post('/turmas/gerenciar',verificarAutenticacao, async (req,res) => {
    const {nome, curso, modulo, origem, turno, data_inicio, data_fim, observacoes} = req.body;
    try {
        await connectToDb();
        const idDocumento = await criarTurma(
          nome,
          curso,
          modulo, 
          origem,
          turno,
          data_inicio,
          data_fim,
          observacoes
        );
        res.status(201).json({idDocumento});
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao criar turma" });
      }
});

app.put('/turmas/gerenciar/:id',verificarAutenticacao, async (req,res) => {
    const { id } = req.params; 
    const { nome, codigo, curso, modulo, origem, turno, data_inicio, data_fim, observacoes, status} = req.body;
    try {
        const attTurma = {  nome, codigo, curso, modulo, origem, turno, data_inicio, data_fim, observacoes, status};
        const turmaAtualizada = await editarTurma(id, attTurma);
        if (!turmaAtualizada) {
          return res.status(404).json({ error: "Turma não encontrada ou não foi modificada" });
        }
        res.status(200).json(turmaAtualizada);
      } catch (err) {
        console.error("Erro ao atualizar turma:", err.message);
        res.status(500).json({ error: "Erro ao atualizar turma", details: err.message });
      }
});

app.put('/turmas/gerenciar/codificar/:id',verificarAutenticacao, async (req,res) => {
  const { id } = req.params; 
  const { codigo, status} = req.body;

  try {
      const attTurma = {codigo, status};
      const turmaAtualizada = await editarTurma(id, attTurma);
      if (!turmaAtualizada) {
        return res.status(404).json({ error: "Turma não encontrada ou não foi modificada" });
      }
      res.status(200).json(turmaAtualizada);
    } catch (err) {
      console.error("Erro ao atualizar turma:", err.message);
      res.status(500).json({ error: "Erro ao atualizar turma", details: err.message });
    }
});

app.put('/turmas/gerenciar/cancelar/:id',verificarAutenticacao, async (req,res) => {
  const { id } = req.params; 
  const { codigo, status} = req.body;

  try {
      const attTurma = {codigo, status};
      const turmaAtualizada = await editarTurma(id, attTurma);
      if (!turmaAtualizada) {
        return res.status(404).json({ error: "Turma não encontrada ou não foi modificada" });
      }
      res.status(200).json(turmaAtualizada);
    } catch (err) {
      console.error("Erro ao atualizar turma:", err.message);
      res.status(500).json({ error: "Erro ao atualizar turma", details: err.message });
    }
});

app.put('/turmas/gerenciar/concluir/:id',verificarAutenticacao, async (req,res) => {
  const { id } = req.params; 
  const { codigo, status} = req.body;

  try {
      const attTurma = {codigo, status};
      const turmaAtualizada = await editarTurma(id, attTurma);
      if (!turmaAtualizada) {
        return res.status(404).json({ error: "Turma não encontrada ou não foi modificada" });
      }
      res.status(200).json(turmaAtualizada);
    } catch (err) {
      console.error("Erro ao atualizar turma:", err.message);
      res.status(500).json({ error: "Erro ao atualizar turma", details: err.message });
    }
});

app.delete('/turmas/gerenciar/:id',verificarAutenticacao, async (req, res) => {
    const {id} = req.params;
    try {
        const turmaDeletada = await deletarTurma(id);
        if (!turmaDeletada) {
          return res.status(404).json({ error: "Turma não encontrada ou não foi deletada" });
        }
        res.status(200).json(turmaDeletada);
      } catch (err) {
        console.error("Erro ao deletar turma:", err.message);
        res.status(500).json({ error: "Erro ao deletar turma", details: err.message });
      }
});

//Middlewares dos tecnicos
app.get('/tecnicos/gerenciar',verificarAutenticacao, async (req,res) => {
  try {
      await connectToDb();
      const tecnicos = await encontrarTecnico();
      if (!tecnicos) {
        return res.status(404).json({ error: "Nenhum tecnico encontrada." });
      }
      return res.status(200).json(tecnicos);
    } catch (err) {
      console.error("Erro ao processar a consulta:", err);
      return res.status(500).json({ error: "Erro ao buscar tecnicos.", details: err.message });
    }
});

app.get('/tecnicos/gerenciar/pesquisa/:termo',verificarAutenticacao, async (req,res) => {
try {
    await connectToDb();
    const { termo } = req.params;
    if (!termo) {
      return res.status(400).json({ error: "Termo de pesquisa não fornecido." });
    }
    const tecnicos = await pesquisarTecnico(termo);
    if (!tecnicos) {
      return res.status(404).json({ error: "Nenhum tecnico encontrada." });
    }
    return res.status(200).json(tecnicos);
  } catch (err) {
    console.error("Erro ao processar a consulta:", err);
    return res.status(500).json({ error: "Erro ao buscar tecnicos.", details: err.message });
  }
});

app.get('/tecnicos/gerenciar/filtrar', verificarAutenticacao, async (req, res) => {
try {
  await connectToDb();
  const {area, facilitador, turno, status} = req.query;
  const tecnicos = await filtrarTecnico({ area, facilitador, turno, status});
  if (!tecnicos || tecnicos.length === 0) {
    return res.status(404).json({ error: "Nenhum tecnico encontrada." });
  }
  return res.status(200).json(tecnicos);
} catch (err) {
  console.error("Erro ao processar a consulta:", err);
  return res.status(500).json({ error: "Erro ao buscar tecnicos.", details: err.message });
}
});

app.get('/tecnicos/gerenciar/matricula/:termo',verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador']), async (req,res) => {
  try {
      await connectToDb();
      const matricula= req.params;
      const tecnico = await pesquisarMatriculaTec(matricula);
      if (!tecnico) {
        return res.status(404).json({ error: "Nenhuma conta encontrado." });
      }
      return res.status(200).json(tecnico);
    } catch (err) {
      console.error("Erro ao processar a consulta:", err);
      return res.status(500).json({ error: "Erro ao buscar conta.", details: err.message });
    }
});


app.post('/tecnicos/gerenciar',verificarAutenticacao, async (req,res) => {
  const {nome, matricula, tipoContratacao, area, turno, status, horarios, ausencias} = req.body;
  try {
      await connectToDb();
      const idDocumento = await criarTecnico(
        nome, matricula, tipoContratacao, area, turno, status, horarios, ausencias
      );
      res.status(201).json({idDocumento});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar tecnico" });
    }
});

app.put('/tecnicos/gerenciar/:id',verificarAutenticacao, async (req,res) => {
  const { id } = req.params; 
  const { nome, matricula, tipoContratacao, area, turno, status, horarios, ausencias} = req.body;
  try {
      const attTecnico = { nome, matricula, tipoContratacao, area, turno, status, horarios, ausencias};
      
      const tecnicoAtualizado = await editarTecnico(id, attTecnico);
      if (!tecnicoAtualizado) {
        return res.status(404).json({ error: "Tecnico não encontrado ou não foi modificado" });
      }
      res.status(200).json(tecnicoAtualizado);
    } catch (err) {
      console.error("Erro ao atualizar tecnico:", err.message);
      res.status(500).json({ error: "Erro ao atualizar tecnico", details: err.message });
    }
});

app.put('/tecnicos/gerenciar/status/:idTec',verificarAutenticacao, async (req,res) => {
  const { idTec } = req.params; 
  const { status} = req.body;
  try {      
      const tecnicoAtualizado = await editarStatusTecnico(idTec, status);
      if (!tecnicoAtualizado) {
        return res.status(404).json({ error: "Tecnico não encontrado ou não foi modificado" });
      }
      res.status(200).json(tecnicoAtualizado);
    } catch (err) {
      console.error("Erro ao atualizar tecnico:", err.message);
      res.status(500).json({ error: "Erro ao atualizar tecnico", details: err.message });
    }
});

app.delete('/tecnicos/gerenciar/:id',verificarAutenticacao, async (req, res) => {
  const {id} = req.params;
  try {
      const tecnicoDeletado = await deletarTecnico(id);
      if (!tecnicoDeletado) {
        return res.status(404).json({ error: "Tecnico não encontrado ou não foi deletado" });
      }
      res.status(200).json(tecnicoDeletado);
    } catch (err) {
      console.error("Erro ao deletar tecnico:", err.message);
      res.status(500).json({ error: "Erro ao deletar tecnico", details: err.message });
    }
});

//Middlewares dos cursos
app.get('/cursos/gerenciar',verificarAutenticacao, async (req,res) => {
  try {
      await connectToDb();
      const cursos = await encontrarCurso();
      if (!cursos) {
        return res.status(404).json({ error: "Nenhum curso encontrada." });
      }
      return res.status(200).json(cursos);
    } catch (err) {
      console.error("Erro ao processar a consulta:", err);
      return res.status(500).json({ error: "Erro ao buscar cursos.", details: err.message });
    }
});

app.get('/cursos/gerenciar/pesquisa/:termo',verificarAutenticacao, async (req,res) => {
try {
    await connectToDb();
    const { termo } = req.params;
    if (!termo) {
      return res.status(400).json({ error: "Termo de pesquisa não fornecido." });
    }
    const cursos = await pesquisarCurso(termo);
    if (!cursos) {
      return res.status(404).json({ error: "Nenhum curso encontrado." });
    }
    return res.status(200).json(cursos);
  } catch (err) {
    console.error("Erro ao processar a consulta:", err);
    return res.status(500).json({ error: "Erro ao buscar cursos.", details: err.message });
  }
});

app.get('/cursos/gerenciar/filtrar', verificarAutenticacao, async (req, res) => {
try {
  await connectToDb();
  const {area, habilitacao} = req.query;
  const cursos = await filtrarCurso({area, habilitacao});
  if (!cursos || cursos.length === 0) {
    return res.status(404).json({ error: "Nenhum curso encontrado." });
  }
  return res.status(200).json(cursos);
} catch (err) {
  console.error("Erro ao processar a consulta:", err);
  return res.status(500).json({ error: "Erro ao buscar cursos.", details: err.message });
}
});


app.post('/cursos/gerenciar',verificarAutenticacao, async (req,res) => {
  const {nome, codigo, externo, carga, habilitacao, area, ucs} = req.body;
  try {
      await connectToDb();
      const idDocumento = await criarCurso(
        nome, codigo, externo, carga, habilitacao, area, ucs
      );
      res.status(201).json({idDocumento});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar curso" });
    }
});

app.put('/cursos/gerenciar/:id',verificarAutenticacao, async (req,res) => {
  const { id } = req.params; 
  const { nome, codigo, externo, carga, habilitacao, area, ucs} = req.body;
  try {
      const attcurso = { nome, codigo, externo, carga, habilitacao, area, ucs};
      const cursoAtualizado = await editarCurso(id, attcurso);
      if (!cursoAtualizado) {
        return res.status(404).json({ error: "Curso não encontrado ou não foi modificado" });
      }
      res.status(200).json(cursoAtualizado);
    } catch (err) {
      console.error("Erro ao atualizar curso:", err.message);
      res.status(500).json({ error: "Erro ao atualizar curso", details: err.message });
    }
});

app.delete('/cursos/gerenciar/:id',verificarAutenticacao, async (req, res) => {
  const {id} = req.params;
  try {
      const cursoDeletado = await deletarCurso(id);
      if (!cursoDeletado) {
        return res.status(404).json({ error: "Curso não encontrado ou não foi deletado" });
      }
      res.status(200).json(cursoDeletado);
    } catch (err) {
      console.error("Erro ao deletar curso:", err.message);
      res.status(500).json({ error: "Erro ao deletar curso", details: err.message });
    }
});

// Middlewares dos usuários
app.get('/usuarios/gerenciar',verificarAutenticacao, verificarAcesso(['Administrador', 'Facilitador', 'Técnico']), async (req,res) => {
  const {id} = req.query;
  try {
      await connectToDb();
      const usuarios = await encontrarUsuario(id);
      if (!usuarios) {
        return res.status(404).json({ error: "Nenhum usuário encontrado." });
      }
      return res.status(200).json(usuarios);
    } catch (err) {
      console.error("Erro ao processar a consulta:", err);
      return res.status(500).json({ error: "Erro ao buscar usuarios.", details: err.message });
    }
});

app.get('/usuarios/gerenciar/filtrar', verificarAutenticacao, verificarAcesso(['Administrador']), async (req, res) => {
  try {
    await connectToDb();
    const {funcao, status} = req.query;
    const usuarios = await filtrarUsuario({funcao, status});
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ error: "Nenhum usuario encontrado." });
    }
    return res.status(200).json(usuarios);
  } catch (err) {
    console.error("Erro ao processar a consulta:", err);
    return res.status(500).json({ error: "Erro ao buscar usuarios.", details: err.message });
  }
});

app.get('/usuarios/gerenciar/pesquisa/:termo',verificarAutenticacao, verificarAcesso(['Administrador']), async (req,res) => {
  try {
      await connectToDb();
      const { termo } = req.params;
      if (!termo) {
        return res.status(400).json({ error: "Termo de pesquisa não fornecido." });
      }
      const usuarios = await pesquisarUsuario(termo);
      if (!usuarios) {
        return res.status(404).json({ error: "Nenhum usuario encontrado." });
      }
      return res.status(200).json(usuarios);
  } catch (err) {
      console.error("Erro ao processar a consulta:", err);
      return res.status(500).json({ error: "Erro ao buscar usuarios.", details: err.message });
  }
});

app.get('/usuarios/gerenciar/conta/:termo',verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador']), async (req,res) => {
  try {
      await connectToDb();
      const { matricula } = req.params;
      const usuario = await pesquisarConta(matricula);
      if (!usuario) {
        return res.status(404).json({ error: "Nenhuma conta encontrado." });
      }
      return res.status(200).json(usuario);
    } catch (err) {
      console.error("Erro ao processar a consulta:", err);
      return res.status(500).json({ error: "Erro ao buscar conta.", details: err.message });
    }
});

app.get('/usuarios/gerenciar/matricula/:termo',verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador']), async (req,res) => {
  try {
      await connectToDb();
      const matricula= req.params;
      const usuario = await pesquisarMatricula(matricula);
      if (!usuario) {
        return res.status(404).json({ error: "Nenhuma conta encontrado." });
      }
      return res.status(200).json(usuario);
    } catch (err) {
      console.error("Erro ao processar a consulta:", err);
      return res.status(500).json({ error: "Erro ao buscar conta.", details: err.message });
    }
});

app.post('/usuarios/gerenciar',verificarAutenticacao, verificarAcesso(['Administrador']), async (req,res) => {
  const {nome, matricula, area, email, funcao, status, senha} = req.body;
  try {
      await connectToDb();
      const idDocumento = await criarUsuario(
        nome, matricula, area, email, funcao, status, senha
      );
      res.status(201).json({idDocumento});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar usuario" });
    }
});

app.put('/usuarios/gerenciar/:id',verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador']), async (req,res) => {
  const { id } = req.params; 
  const body = req.body;
  try {      
      const usuarioAtualizado = await editarUsuario(id, body);
      if (!usuarioAtualizado) {
        return res.status(404).json({ error: "Usuario não encontrado ou não foi modificado" });
      }
      res.status(200).json(usuarioAtualizado);
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err.message);
      res.status(500).json({ error: "Erro ao atualizar usuário", details: err.message });
    }
});

app.delete('/usuarios/gerenciar/:id',verificarAutenticacao, verificarAcesso(['Administrador']), async (req, res) => {
  const {id} = req.params;
  try {
      const usuarioDeletado = await deletarUsuario(id);
      if (!usuarioDeletado) {
        return res.status(404).json({ error: "Usuário não encontrado ou não foi deletado" });
      }
      res.status(200).json(usuarioDeletado);
    } catch (err) {
      console.error("Erro ao deletar usuário:", err.message);
      res.status(500).json({ error: "Erro ao deletar usuário", details: err.message });
    }
});

//Middlewares dos agendamentos
app.get('/agendamentos/gerenciar',verificarAutenticacao, async (req,res) => {
  try {
      await connectToDb();
      const agendamentos = await encontrarAgendamento();
      if (!agendamentos) {
        return res.status(200).json(agendamentos || []);
      }
      return res.status(200).json(agendamentos);
    } catch (err) {
      console.error("Erro ao processar a consulta:", err);
      return res.status(500).json({ error: "Erro ao buscar agendamentos.", details: err.message });
    }
});

app.get('/agendamentos/gerenciar/pesquisa/:termo',verificarAutenticacao, async (req,res) => {
try {
    await connectToDb();
    const { termo } = req.params;
    if (!termo) {
      return res.status(400).json({ error: "Termo de pesquisa não fornecido." });
    }
    const agendamentos = await pesquisarAgendamento(termo);
    if (!agendamentos) {
      return res.status(404).json({ error: "Nenhum agendamento encontrada." });
    }
    return res.status(200).json(agendamentos);
  } catch (err) {
    console.error("Erro ao processar a consulta:", err);
    return res.status(500).json({ error: "Erro ao buscar agendamentos.", details: err.message });
  }
});

app.get('/agendamentos/gerenciar/coleta/:id',verificarAutenticacao, async (req,res) => {
try {
    await connectToDb();
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Id de pesquisa não fornecido." });
    }
    const agendamentos = await coletaAgendamento(id);
    if (!agendamentos) {
      return res.status(404).json({ error: "Nenhum agendamento encontrada." });
    }
    return res.status(200).json(agendamentos);
  } catch (err) {
    console.error("Erro ao processar a consulta:", err);
    return res.status(500).json({ error: "Erro ao buscar agendamentos.", details: err.message });
  }
});

app.get('/agendamentos/gerenciar/filtrar', verificarAutenticacao, async (req, res) => {
try {
  await connectToDb();
  const {tecnico, turma} = req.query;
  const agendamentos = await filtrarAgendamento({ tecnico, turma});
  if (!agendamentos || agendamentos.length === 0) {
    return res.status(404).json({ error: "Nenhum agendamento encontrada." });
  }
  return res.status(200).json(agendamentos);
} catch (err) {
  console.error("Erro ao processar a consulta:", err);
  return res.status(500).json({ error: "Erro ao buscar agendamentos.", details: err.message });
}
});

app.post('/agendamentos/gerenciar',verificarAutenticacao, async (req,res) => {
  const {modulo,agendamentos} = req.body;
  try {
      await connectToDb();
      const idDocumento = await criarAgendamento(
         modulo,agendamentos
      );
      res.status(201).json({idDocumento});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar agendamento" });
    }
});

app.put('/agendamentos/gerenciar/:id',verificarAutenticacao, async (req,res) => {
  const { id } = req.params; 
  const { modulo,agendamentos} = req.body;
  try {
      const attAgendamento = { modulo, agendamentos};
      
      const idDocumento = await editarAgendamento(id, attAgendamento);
      if (!idDocumento) {
        return res.status(404).json({ error: "Agendamento não encontrado ou não foi modificado" });
      }
      res.status(200).json({idDocumento});
    } catch (err) {
      console.error("Erro ao atualizar agendamento:", err.message);
      res.status(500).json({ error: "Erro ao atualizar agendamento", details: err.message });
    }
});

app.delete('/agendamentos/gerenciar/:id',verificarAutenticacao, async (req, res) => {
  const {id} = req.params;
  try {
      const idDocumento = await deletarAgendamento(id);
      if (!idDocumento) {
        return res.status(404).json({ error: "Agendamento não encontrado ou não foi deletado" });
      }
      res.status(200).json({idDocumento});
    } catch (err) {
      console.error("Erro ao deletar agendamento:", err.message);
      res.status(500).json({ error: "Erro ao deletar agendamento", details: err.message });
    }
});

//Middlewares dos logs
app.post('/logs/incluir',verificarAutenticacao, async (req,res) => {
  const {idDocumento, usuarioLogado, acao} = req.body;
  try {
      await connectToDb();
      const novoLog = await criarLog(
         idDocumento, usuarioLogado, acao
      );
      res.status(201).json(novoLog);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar log" });
    }
});

app.post('/logs/incluirExclusao',verificarAutenticacao, async (req,res) => {
  const {idDocumento, usuarioLogado, acao, dadosExcluidos} = req.body;
  try {
      await connectToDb();
      const novoLog = await criarLogExclusao(
         idDocumento, usuarioLogado, acao, dadosExcluidos
      );
      res.status(201).json(novoLog);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar log" });
    }
});


//Middleware da conta
app.get('/conta/preencher', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador'], '/index'), async (req, res) => {
  res.json({ usuario: req.usuario });
});


// Rota estática de login
app.get('/',  (req, res) => {
  res.sendFile(path.join(__dirname, 'src', '/login/login.html'));
});

// Rota estática da página inicial
app.get('/index', verificarAutenticacao,  verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador'], '/'), renovarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/calendarios', 'index_calendario.html'));
});

// Rotas estáticas das turmas
app.get('/turmas', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador'], '/turmas'), renovarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/turmas', 'index_turmas.html'));
});

app.get('/turmas/nova', verificarAutenticacao, verificarAcesso(['Administrador', 'Monitor', 'Orientador', 'Facilitador'], '/turmas'), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/turmas', 'nova_turma.html'));
});

app.get('/turmas/editar', verificarAutenticacao, verificarAcesso(['Administrador', 'Monitor', 'Orientador', 'Facilitador'], '/turmas'), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/turmas', 'editar_turma.html'));
});

app.get('/turmas/ver', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador'], '/turmas'), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/turmas', 'ver_turma.html'));
});

// Rotas estáticas dos tecnicos
app.get('/tecnicos', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador'], '/tecnicos'), renovarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/tecnicos', 'index_tecnicos.html'));
});

app.get('/tecnicos/novo', verificarAutenticacao, verificarAcesso(['Administrador', 'Facilitador'], '/tecnicos'), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/tecnicos', 'novo_tecnico.html'));
});

app.get('/tecnicos/editar', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Facilitador'], '/tecnicos'), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/tecnicos', 'editar_tecnico.html'));
});

app.get('/tecnicos/ver', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador'], '/tecnicos'), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/tecnicos', 'ver_tecnico.html'));
});

// Rotas estáticas dos cursos
app.get('/cursos', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador'], '/cursos'),renovarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/cursos', 'index_cursos.html'));
});

app.get('/cursos/novo', verificarAutenticacao, verificarAcesso(['Administrador', 'Monitor', 'Orientador', 'Facilitador'], '/cursos'), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/cursos', 'novo_curso.html'));
});

app.get('/cursos/editar', verificarAutenticacao, verificarAcesso(['Administrador', 'Monitor', 'Orientador', 'Facilitador'], '/cursos'), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/cursos', 'editar_curso.html'));
});

app.get('/cursos/ver', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador'], '/cursos'), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/cursos', 'ver_curso.html'));
});

// Rota estática da conta
app.get('/conta', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador'], '/index'),renovarToken, async (req, res) => {
  res.sendFile(path.join(__dirname, 'src/conta', 'editar_conta.html'));
});

// Rotas estáticas dos usuários
app.get('/usuarios', verificarAutenticacao, verificarAcesso(['Administrador']), renovarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/usuarios', 'index_usuarios.html'));
});

app.get('/usuarios/novo', verificarAutenticacao, verificarAcesso(['Administrador']), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/usuarios', 'novo_usuario.html'));
});

app.get('/usuarios/editar', verificarAutenticacao, verificarAcesso(['Administrador']), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/usuarios', 'editar_usuario.html'));
});

app.get('/usuarios/ver', verificarAutenticacao, verificarAcesso(['Administrador']), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/usuarios', 'ver_usuario.html'));
});

// Rotas estáticas dos agendamentos
app.get('/agendamentos', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador'], '/agendamentos'), renovarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'src/agendamentos', 'index_agendamento.html'));
});

app.get('/agendamentos/novo', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Facilitador'], '/agendamentos'), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/agendamentos', 'novo_agendamento.html'));
});

app.get('/agendamentos/editar', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Facilitador'], '/agendamentos'), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/agendamentos', 'editar_agendamento.html'));
});

app.get('/agendamentos/ver', verificarAutenticacao, verificarAcesso(['Administrador', 'Técnico', 'Monitor', 'Orientador', 'Facilitador'], '/agendamentos'), (req, res) => {
  res.sendFile(path.join(__dirname, 'src/agendamentos', 'ver_agendamento.html'));
});

// Rota para iniciar o servidor 
app.listen(3000, () => { 
    console.log("Servidor iniciado"); 
});