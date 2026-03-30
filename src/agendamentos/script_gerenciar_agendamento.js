document.addEventListener('DOMContentLoaded', async () => {
    const agendamentoData = JSON.parse(localStorage.getItem('agendamentoData'));
    if (agendamentoData) {
        document.getElementById('modulo').value = agendamentoData[0].modulo;
        document.getElementById('id').value=agendamentoData[0]._id;
        let cursoId = "";
        let moduloTurma = "";
        const selectTecnicos=document.querySelector("#tecnicoEnsino");
        const option = document.createElement("option");
        option.value = `${agendamentoData[0].agendamentos[0].tecnico}`;
        option.textContent = `${agendamentoData[0].agendamentos[0].tecnico.split(" - ")[1]}`;
        selectTecnicos.appendChild(option);
        const selectTurmas=document.querySelector("#turma");
        const responseTurma = await fetch('/turmas/gerenciar');
        const turmas = await responseTurma.json();
        sessionStorage.setItem('resultadosTurmas', JSON.stringify(turmas));
        turmas.sort((a, b) => a.nome.localeCompare(b.nome));
        turmas.forEach(turma => {
            if(turma._id===agendamentoData[0].agendamentos[0].turma.split(" - ")[0] && (turma.status === "Ativo" ||  turma.status === "Provisório")){
                cursoId = `${turma.curso}`;
                moduloTurma = `${turma.modulo}`;
            }
        });
        const option2 = document.createElement("option");
        option2.value = `${agendamentoData[0].agendamentos[0].turma}`;
        option2.textContent = `${agendamentoData[0].agendamentos[0].turma.split(" - ")[1]}`;
        selectTurmas.appendChild(option2);
        const responseCursos = await fetch('/cursos/gerenciar');
        const cursos = await responseCursos.json();
        cursos.sort((a, b) => a.nome.localeCompare(b.nome));
        sessionStorage.setItem('resultadosCursos', JSON.stringify(cursos));
        const mapCursoAtual = cursos.find(curso => curso._id === cursoId);
        const selectUcs=document.querySelector("#uc");
        const uc = agendamentoData[0].agendamentos[0].uc.split(" - ");
        const option3 = document.createElement("option");
        option3.value = `${uc[0]} - ${uc[1]}`;
        option3.textContent = `${uc[1].toUpperCase()}`;
        selectUcs.appendChild(option3);
        if (mapCursoAtual) {
            mapCursoAtual.ucs.forEach(unidade => {
                if(String(moduloTurma)===unidade.modulo && uc[1].toUpperCase()===unidade.nome.toUpperCase()){
                    option3.setAttribute("carga",unidade.horasAula);
                    window.cargaUcTotal = unidade.horasAula;
                    window.ucAtual = `${uc[0]} - ${uc[1]}`;
                }
            });
        }
        selectTecnicos.style.pointerEvents = 'none';
        selectTurmas.style.pointerEvents = 'none';
        selectUcs.style.pointerEvents = 'none';
        document.dispatchEvent(new Event('editarTec'));
    } else {
        console.error('Dados do agendamento não encontrados no localStorage');
        alert('Dados não encontrados.');
    }
});

if(document.getElementById('editar-agendamento')){
    document.getElementById('editar-agendamento').addEventListener('submit', async function(event) {
        const botaoCadastro = document.getElementById('editar');
        botaoCadastro.setAttribute('disabled', 'disabled');
        const botaoExcluir = document.getElementById('excluir');
        botaoExcluir.setAttribute('disabled', 'disabled');
        event.preventDefault();
        const id = this.id.value;
        const tecnico = this.tecnicoEnsino.value;
        const turma = this.turma.value;
        const modulo = this.modulo.value;
        const uc=this.uc.value;
        if(tecnico==="selecione" || turma==="selecione" || uc==="selecione"){
            exibirNotificacao(`O campo não foi selecionado corretamente!`);
            return
        }
        if(!window.listaHorarios){
            exibirNotificacao(`Os horários precisam estar corretamente selecionados!`);
            return
        }   
        if (event.submitter.id == 'editar') {
            const agendamentos = [];     
            window.listaHorarios.forEach(agendado => {
                if(agendado.tecnico === tecnico && agendado.turma===turma && agendado.uc===uc){
                        agendamentos.push(agendado);
                }
            });
            if(window.listaHorariosNovos){
                window.listaHorariosNovos.forEach(agendado => {
                    agendamentos.push(agendado);
                });
            }
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
                registrarLog(usuarioLogado, acao, id );
                exibirNotificacao(`Agendamento editado com sucesso!`);
                    setTimeout(() => {
                    window.location.href = '/agendamentos';
                }, 2000);
            } catch (error) {
                console.error('Erro:', error);
            }
        }
        else if(event.submitter.id == 'excluir'){
            const confirmarExclusao = window.confirm('Tem certeza de que deseja excluir este agendamento? Essa ação não pode ser desfeita.');
            if(confirmarExclusao){
                try {
                    const response = await fetch(`/agendamentos/gerenciar/${id}`, {
                        method: 'DELETE'
                    });
                    const data = await response.json();
                    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
                    const acao = "exclusão de agendamento";
                    const dadosExcluidos = {
                        id, tecnico, turma, modulo, uc
                    }
                    registrarLogExclusao(usuarioLogado, acao, id, dadosExcluidos);
                    exibirNotificacao(`Agendamento excluído com sucesso!`);
                    setTimeout(() => {
                        window.location.href = '/agendamentos';
                    }, 2000);
                } catch (error) {
                    console.error('Erro:', error);
                }
            }else{
                window.location.href = '/agendamentos'; 
            }
        }
    });
}

function exibirNotificacao(mensagem) {
    const notificacao = document.getElementById('notificacao');
    notificacao.textContent = mensagem;
    notificacao.classList.remove('oculto');
    setTimeout(() => {
        notificacao.classList.add('oculto');
    }, 1500);
}
