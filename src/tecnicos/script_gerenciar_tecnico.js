document.addEventListener('DOMContentLoaded', async function() {
    try {
            const response = await fetch('/conta/preencher', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Erro ao obter usuário');
            }

            const data = await response.json();
            const funcaoLogada = data.usuario.funcao;
            if(funcaoLogada !== 'Administrador'){
                document.getElementById('tipoContratacao').setAttribute('disabled','true');
                document.getElementById('matricula').setAttribute('readonly','true');
            }else{
                document.getElementById('tipoContratacao').removeAttribute('disabled');
                document.getElementById('matricula').removeAttribute('readonly');
            }

    } catch (error) {
            console.error(error);
    }
});

document.getElementById('editar-tecnico').addEventListener('submit', async function(event) {
    event.preventDefault();
    const botaoEditar = document.getElementById('editar');
    botaoEditar.setAttribute('disabled', 'disabled');
    const botaoExcluir = document.getElementById('excluir');
    botaoExcluir.setAttribute('disabled', 'disabled');
    const id=this.id.value;
    const nomex = this.nome.value.trim();
    if (!nomex) { 
        alert('É necessário preencher os campos antes de salvar!');
        return; 
    }
    const nome = this.nome.value.toUpperCase();
    const area=this.area.value;
    const matricula=this.matricula.value;
    if (event.submitter.id == 'editar') {
            const turno = this.turno.value;
            const status = this.status.value;
            const tipoContratacao = this.tipoContratacao.value;
            const registroContainers = document.querySelectorAll(".registro");
            const tabelaDias = document.querySelectorAll('.calendar table');
            const horarios = [];
            if(tipoContratacao==='Mensalista - Horário fixo'){
                if(!validarHorariosParaSalvar()){
                    return
                }
            }
            tabelaDias.forEach((tabela) => {
                const td = tabela.querySelector('td');
                const diaSemana = td ? td.getAttribute('dia') : null;
                const tdInicio = tabela.querySelector('.inicio'); 
                const tdFim = tabela.querySelector('.fim'); 
                const tdIntervalos = tabela.querySelectorAll('.intervalo'); 
                if (tdInicio && tdFim) {
                    let horario = {
                        diaSemana: diaSemana,
                        horarioInicial: tdInicio.textContent.trim(),
                        horarioFinal: tdFim.textContent.trim(),
                        intervaloInicial: tdIntervalos[0] ? tdIntervalos[0].textContent.trim() : '',
                        intervaloFim: tdIntervalos[1] ? tdIntervalos[1].textContent.trim() : ''
                    };
                    horarios.push(horario); 
                }
            });
            const ausencias = Array.from(registroContainers).map(tr => {
                const [rotulo, dataInicial, dataFinal, horaAusInicial, horaAusfinal, diasMarcados] = 
                      Array.from(tr.querySelectorAll("td")).map(td => td.textContent.trim());
                return { rotulo, dataInicial, dataFinal, horaAusInicial, horaAusfinal, diasMarcados };
            });

            if(tipoContratacao==='Mensalista - Horário fixo'){
                validarHorariosParaSalvar()
            }
            try {
                const response = await fetch(`/tecnicos/gerenciar/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({nome, matricula, area, tipoContratacao, turno, status, horarios, ausencias})
                });
                const data = await response.json();
                const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
                const acao = "edição de técnico";
                registrarLog(usuarioLogado, acao, id );
                exibirNotificacao(`Técnico ${matricula} atualizado com sucesso!`);
                setTimeout(() => {
                    window.location.href = '/tecnicos';
                }, 1500);
            } catch (error) {
                console.error('Erro:', error);
            }
    }
    else if(event.submitter.id == 'excluir'){
        const confirmarExclusao = window.confirm('Tem certeza de que deseja excluir este técnico? Essa ação não pode ser desfeita.');
        if(confirmarExclusao){
            excluiAgendamentosTecnico(id);
            try {
                const response = await fetch(`/tecnicos/gerenciar/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
                const acao = "exclusão de técnico";
                const dadosExcluidos = {
                    nome, matricula, area
                }
                registrarLogExclusao(usuarioLogado, acao, id, dadosExcluidos);
                exibirNotificacao(`Técnico ${matricula} excluído com sucesso!`);
                setTimeout(() => {
                    window.location.href = '/tecnicos';
                }, 1500);
            } catch (error) {
                console.error('Erro:', error);
            }
        }else{
            window.location.href = '/tecnicos'; 
        }
    }
    
});

function validarHorariosParaSalvar() {
    const diasDaSemana = {
        "2": { id: "#segunda tbody", dia: "segunda" },
        "3": { id: "#terca tbody", dia: "terca"},
        "4": { id: "#quarta tbody", dia: "quarta"},
        "5": { id: "#quinta tbody", dia: "quinta"},
        "6": { id: "#sexta tbody", dia: "sexta"},
    };
    for (const diaNum in diasDaSemana) {
        const dia = diasDaSemana[diaNum];
        const tabela = document.querySelector(dia.id);
        const temHorario = tabela && tabela.rows.length > 0;
        if (temAgendamentoParaDiaSemana(diaNum) && !temHorario) {
            const diaNome = (dia) => ({
                segunda: "Segunda-Feira",
                terca: "Terça-Feira",
                quarta: "Quarta-Feira",
                quinta: "Quinta-Feira",
                sexta: "Sexta-Feira",
                sabado: "Sábado",
                domingo: "Domingo"
            })[dia] || "";
            alert(`Não é possível salvar: Existem agendamentos para ${diaNome(dia.dia)}, mas nenhum horário de trabalho foi cadastrado para este dia. Por favor, adicione um horário.`);
            return false;
        }
    }
    return true;
}

function temAgendamentoParaDiaSemana(diaTabela) {
    agendamentoTecnico = JSON.parse(sessionStorage.getItem('agendamentoTecnico')) || [];
    if (!agendamentoTecnico || agendamentoTecnico.length === 0) {
        return false;
    }
    const diaDateMap = {
        "2": 1, 
        "3": 2, 
        "4": 3, 
        "5": 4, 
        "6": 5, 
    };
    const diaSemanaIndex = diaDateMap[diaTabela];
    for (const cursoObj of agendamentoTecnico) {
        if (!cursoObj.agendamentos) continue;

        for (const agendamento of cursoObj.agendamentos) {
            const dataAg = parseDataAgendamento(agendamento.data);
            if (dataAg.getDay() === diaSemanaIndex) {
                return true;
            }
        }
    }
    return false;
}

async function excluiAgendamentosTecnico(tecnico) {
    var agendamentos=[];
    try{
        const responseAgendamentos = await fetch ('/agendamentos/gerenciar');
        if (responseAgendamentos.ok) {
            agendamentosBD = await responseAgendamentos.json();
        }
    } catch (error){ }
    if(agendamentosBD){
        agendamentosBD.forEach(ag =>{
            if(ag.tecnico.split(" - ")[0] === tecnico){
               agendamentos.push(ag._id); 
            }
        })
    }
    for (const id of agendamentos) {
        try {
            const response = await fetch(`/agendamentos/gerenciar/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
        } catch (error) {
            console.error('Erro:', error);
        }
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
