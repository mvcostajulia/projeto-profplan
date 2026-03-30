document.addEventListener("DOMContentLoaded", async () => {
    const select=document.querySelector("#curso");
    const response = await fetch('/cursos/gerenciar');
    const cursos = await response.json();
    sessionStorage.setItem('resultadosCursos', JSON.stringify(cursos));

    cursos.sort((a, b) => a.nome.localeCompare(b.nome));

    cursos.forEach(curso =>{
        const option = document.createElement("option");
        option.value = `${curso._id}`;
        option.textContent = `${curso.nome} - ${curso.carga}h`;
        select.appendChild(option);
    });
});

document.getElementById('nova-turma').addEventListener('submit', async function(event) {
    event.preventDefault();
    const botaoCadastro = document.getElementById('salvar');
    botaoCadastro.setAttribute('disabled', 'disabled');
    const nomex = this.nome.value.trim();
    if (!nomex) { 
       alert('É necessário preencher os campos antes de salvar!');
        return; 
    }
    const nome = this.nome.value;
    const curso = this.curso.value;
    const modulo = this.modulo.value;
    const origem = this.origem.value;
    const turno = this.turno.value;
    const data_inicio = this.data_inicio.value;
    const data_fim = this.data_fim.value;
    const observacoes = this.observacoes.value;
    try {
        const response = await fetch('/turmas/gerenciar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nome, curso, modulo, origem, turno, data_inicio, data_fim, observacoes })
        });
        const data = await response.json();
        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
        const acao = "criação de turma";
        registrarLog(usuarioLogado, acao, data.idDocumento);
        exibirNotificacao(`Turma ${nome} criada com sucesso!`);
            setTimeout(() => {
            window.location.href = '/turmas';
        }, 2000);
    } catch (error) {
        console.error('Erro:', error);
    }
});

function exibirNotificacao(mensagem) {
    const notificacao = document.getElementById('notificacao');
    notificacao.textContent = mensagem;
    notificacao.classList.remove('oculto');
    setTimeout(() => {
        notificacao.classList.add('oculto');
    }, 1500);
}


