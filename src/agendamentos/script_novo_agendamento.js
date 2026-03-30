document.addEventListener("DOMContentLoaded", async () => {
    const botoesCalendar = document.querySelector('#botoesCalendar');
    const semanalCalendar = document.querySelector('#semanal');
    const mensalCalendar = document.querySelector('#mensal');

    botoesCalendar.style.display='none';
    semanalCalendar.style.display='none';
    mensalCalendar.style.display='none';
    
    const usuarioAtual = await verificaUserAtual();
    const responseAgendamentos = await fetch('/agendamentos/gerenciar');
    const agendamentos = await responseAgendamentos.json();
    sessionStorage.setItem('resultadosAgendamentos', JSON.stringify(agendamentos));

    const selectTurmas=document.querySelector("#turma");
    const responseTurma = await fetch('/turmas/gerenciar');
    const turmas = await responseTurma.json();
    sessionStorage.setItem('resultadosTurmas', JSON.stringify(turmas));

    const responseCursos = await fetch('/cursos/gerenciar');
    const cursos = await responseCursos.json();
    cursos.sort((a, b) => a.nome.localeCompare(b.nome));
    sessionStorage.setItem('resultadosCursos', JSON.stringify(cursos));

    const selectTecnicos=document.querySelector("#tecnicoEnsino");
    const responseTecnicos = await fetch('/tecnicos/gerenciar');
    const tecnicosEnsinos = await responseTecnicos.json();
    sessionStorage.setItem('resultadosTecnicoEnsinos', JSON.stringify(tecnicosEnsinos));
    const tecnicosAtivos = tecnicosEnsinos.filter(tecnico => tecnico.status !== "Inativo");

    const responseUsuarios = await fetch('/usuarios/gerenciar');
    const usuarios = await responseUsuarios.json();
    sessionStorage.setItem('resultadosUsuarios', JSON.stringify(usuarios));

    const selectUcs=document.querySelector("#uc");

    turmas.sort((a, b) => a.nome.localeCompare(b.nome));
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const turmasAtivas = turmas.filter(turma => {
        const dataFim = new Date(turma.data_fim);
        return dataFim >= hoje;
    });
    tecnicosAtivos.sort((a, b) => a.nome.localeCompare(b.nome));
    tecnicosAtivos.forEach(tecnicoEnsino =>{
            const mapUsuarios= usuarios.filter(user =>{
                return user.matricula===tecnicoEnsino.matricula;
            });
            if(mapUsuarios[0]){
                if(mapUsuarios[0].matricula===usuarioAtual[0] || 
                (usuarioAtual[1] ==='Facilitador' && (mapUsuarios[0].area===usuarioAtual[2] || 
                usuarioAtual[2]==="Gestão" || 
                (usuarioAtual[2]==="Metalmecânica" && mapUsuarios[0].area==="Eletroeletrônica"))) || 
                usuarioAtual[1] ==='Administrador'){
                    const option = document.createElement("option");
                    option.value = `${tecnicoEnsino._id} - ${tecnicoEnsino.nome}`;
                    option.textContent = `${mapUsuarios[0].nome}`;
                    selectTecnicos.appendChild(option);
                }
            }else{
                if (usuarioAtual[1] ==='Facilitador' && (tecnicoEnsino.area===usuarioAtual[2] || 
                usuarioAtual[2]==="Gestão" || 
                (usuarioAtual[2]==="Metalmecânica" && tecnicoEnsino.area==="Eletroeletrônica")) || 
                usuarioAtual[1] ==='Administrador'){
                    const option = document.createElement("option");
                    option.value = `${tecnicoEnsino._id} - ${tecnicoEnsino.nome}`;
                    option.textContent = `${tecnicoEnsino.nome}`;
                    selectTecnicos.appendChild(option);
                }
            }
            
    });
        
    turmasAtivas.forEach(turma =>{
        const mapCurso = cursos.filter(curso =>{
            return curso._id===turma.curso;
        });
        const option = document.createElement("option");
        option.value = `${turma._id} - ${turma.nome}`;
        option.textContent = `${turma.nome} - ${mapCurso[0].nome} - MÓDULO: ${turma.modulo}`;
        selectTurmas.appendChild(option);
    });

    selectTurmas.addEventListener('change', function() {
        selectUcs.innerHTML = '';
        const optionSelecione = document.createElement("option");
        optionSelecione.value="selecione";
        optionSelecione.textContent="Selecione";
        selectUcs.appendChild(optionSelecione);
        const turmaSelecionadaId = selectTurmas.value;
        const turmaSelecionada = turmasAtivas.find(turma => turma._id === turmaSelecionadaId.split(" - ")[0]);
        const mapCursoAtual = cursos.find(curso => curso._id === turmaSelecionada.curso);
        const modulo = turmaSelecionada.modulo;
        document.getElementById("modulo").value = modulo;
        if (mapCursoAtual) {
            mapCursoAtual.ucs.forEach(unidade => {
                if(String(turmaSelecionada.modulo)===unidade.modulo){
                    const option = document.createElement("option");
                    option.value = `${mapCursoAtual._id} - ${unidade.nome.toUpperCase()}`;
                    option.setAttribute("carga",unidade.horasAula);
                    option.textContent = `${unidade.nome.toUpperCase()}`;
                    selectUcs.appendChild(option); 
                }
            });
        }
    }); 
    selectUcs.addEventListener('change', function() {
        const selectedOption = selectUcs.options[selectUcs.selectedIndex];
        window.cargaUcTotal = selectedOption.getAttribute("carga");
        window.ucAtual = selectedOption.value;
    });
    
});

async function verificaUserAtual() {
    try {
        const response = await fetch('/conta/preencher', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Erro ao obter usuário');
        }
        const data = await response.json();
        const responseLoad = await fetch(`/usuarios/gerenciar/matricula/${data.usuario.matricula}`);
        const usuario = await responseLoad.json();
        const resp = [usuario[0].matricula, usuario[0].funcao, usuario[0].area]
        return resp;
    } catch (error) {
        console.error(error);
    }
}

document.getElementById('novo-agendamento').addEventListener('submit', async function(event) {
    event.preventDefault();
    const botaoCadastro = document.getElementById('salvar');
    botaoCadastro.setAttribute('disabled', 'disabled');
    const tecnicoEnsino = this.tecnicoEnsino.value;
    const turma = this.turma.value;
    const modulo = this.modulo.value;
    const uc=this.uc.value;

    if(tecnicoEnsino==="selecione" || turma==="selecione" || uc==="selecione"){
        exibirNotificacao(`O campo não foi selecionado corretamente!`);
        return
    }
    if(!window.listaHorariosNovos){
        exibirNotificacao(`Os horários precisam estar corretamente selecionados!`);
        return
    }         
    const agendamentos = [];
    window.listaHorarios.forEach(agendado => {
        if(agendado.tecnico === tecnicoEnsino && agendado.turma===turma && agendado.uc===uc){
            if(agendado.agendamentos){
                agendado.agendamentos.forEach(agendamento => {
                    agendamentos.push(agendamento);
                });
            }else{
                agendamentos.push(agendado);
            }
            
        }
    });
    window.listaHorariosNovos.forEach(agendado => {
        agendamentos.push(agendado);
    });

    try{
        const responseAgendamentos = await fetch ('/agendamentos/gerenciar');
        if (responseAgendamentos.ok) {
            agendamentosBD = await responseAgendamentos.json();
        }
    } catch (error){ }
    let encontrouAgendamento = false
    if(agendamentosBD){
        agendamentosBD.forEach(agendado => {
            if(agendado.agendamentos[0].tecnico === tecnicoEnsino && agendado.agendamentos[0].turma===turma && agendado.agendamentos[0].uc===uc){
                encontrouAgendamento = true;
                editarAgendamento(agendado._id, modulo, agendamentos);                        
            }
        });   
    }
    if (!encontrouAgendamento) {
        novoAgendamento(modulo, agendamentos);
    }
});

async function novoAgendamento(modulo, agendamentos){
    const botaoConfirmar = document.getElementById('salvar');
    botaoConfirmar.setAttribute('disabled', 'disabled');
    try {
        const response = await fetch('/agendamentos/gerenciar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({modulo, agendamentos})
        });
        const data = await response.json();
        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
        const acao = "criação de agendamento";
        registrarLog(usuarioLogado, acao, data.idDocumento);
        exibirNotificacao(`Agendamento criado com sucesso!`);
            setTimeout(() => {
            window.location.href = '/agendamentos';
        }, 2000);
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function editarAgendamento(id, modulo, agendamentos) {
    const botaoConfirmar = document.getElementById('salvar');
    botaoConfirmar.setAttribute('disabled', 'disabled');
    try {
        const response = await fetch(`/agendamentos/gerenciar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({modulo, agendamentos})
        });
        const data = await response.json();
        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
        const acao = "edição de agendamento";
        registrarLog(usuarioLogado, acao, data.idDocumento );
        exibirNotificacao(`Agendamento incluído com sucesso!`);
            setTimeout(() => {
            window.location.href = '/agendamentos';
        }, 2000);
    } catch (error) {
        console.error('Erro:', error);
    }
}

function exibirNotificacao(mensagem) {
    const notificacao = document.getElementById('notificacao');
    notificacao.textContent = mensagem;
    notificacao.classList.remove('oculto');
    setTimeout(() => {
        notificacao.classList.add('oculto');
    }, 1500);
}


