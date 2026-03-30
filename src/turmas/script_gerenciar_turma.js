document.addEventListener("DOMContentLoaded", async () => {
    const select=document.querySelector("#curso");
    const response = await fetch('/cursos/gerenciar');
    const cursos = await response.json();
    sessionStorage.setItem('resultadosCursos', JSON.stringify(cursos));
    const turmaData = JSON.parse(localStorage.getItem('turmaData'));
    cursos.sort((a, b) => a.nome.localeCompare(b.nome));

    cursos.forEach(curso =>{
        const option = document.createElement("option");
        option.value = `${curso._id}`;
        option.textContent = `${curso.nome} - ${curso.carga}h`;
        if (curso._id === turmaData[0].curso) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
});

document.getElementById('editar-turma').addEventListener('submit', async function(event) {
    event.preventDefault();
    const botaoEditar = document.getElementById('editar');
    botaoEditar.setAttribute('disabled', 'disabled');
    const botaoExcluir = document.getElementById('excluir');
    botaoExcluir.setAttribute('disabled', 'disabled');
    const id=this.id.value;
    const nome = this.nome.value.toUpperCase();
    const nomex = this.nome.value.trim();
    if (!nomex) { 
       alert('É necessário preencher os campos antes de salvar!');
        return; 
    }
    const codigo = this.codigo.value;
    const curso = this.curso.value;
    const modulo = this.modulo.value;
    const origem = this.origem.value;
    const turno = this.turno.value;
    const data_inicio = this.data_inicio.value;
    const data_fim = this.data_fim.value;
    const observacoes = this.observacoes.value;
    const status = this.status.value;
    if (event.submitter.id == 'editar') {
            try {
                const response = await fetch(`/turmas/gerenciar/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({nome, codigo, curso, modulo, origem, turno, data_inicio, data_fim, observacoes, status })
                });
                const data = await response.json();
                const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
                const acao = "edição de turma";
                registrarLog(usuarioLogado, acao, id);
                exibirNotificacao(`Turma atualizada com sucesso!`);
                setTimeout(() => {
                    window.location.href = '/turmas';
                }, 2000);
            } catch (error) {
                console.error('Erro:', error);
            }
    }
    else if(event.submitter.id == 'excluir'){
        const confirmarExclusao = window.confirm('Tem certeza de que deseja excluir esta turma? Essa ação não pode ser desfeita. Todos os agendamentos vinculados à turma também serão excluídos!!');
        if(confirmarExclusao){
            excluiAgendamentosTurma(id);
            try {
                const response = await fetch(`/turmas/gerenciar/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
                const acao = "exclusão de turma";
                const dadosExcluidos = {
                    nome, codigo, curso, modulo, origem, turno, data_inicio, data_fim, observacoes
                }
                registrarLogExclusao(usuarioLogado, acao, id, dadosExcluidos);
                exibirNotificacao(`Turma e agendamentos excluídos com sucesso!`);
                setTimeout(() => {
                    window.location.href = '/turmas';
                }, 2000);
            } catch (error) {
                console.error('Erro:', error);
            }

        }else{
            window.location.href = '/turmas'; 
        }
    }
    
});

async function excluiAgendamentosTurma(turma) {
    var agendamentos=[];
    try{
        const responseAgendamentos = await fetch ('/agendamentos/gerenciar');
        if (responseAgendamentos.ok) {
            agendamentosBD = await responseAgendamentos.json();
        }
    } catch (error){ }
    if(agendamentosBD){
        agendamentosBD.forEach(ag =>{
            if(ag.turma.split(" - ")[0] === turma){
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
