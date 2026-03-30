document.getElementById('editar-curso').addEventListener('submit', async function(event) {
    event.preventDefault();
    let str;
    const botaoEditar = document.getElementById('editar');
    botaoEditar.setAttribute('disabled', 'disabled');
    const botaoExcluir = document.getElementById('excluir');
    botaoExcluir.setAttribute('disabled', 'disabled');
    const nome = this.nome.value.toUpperCase();
    const id=this.id.value;
    const codigo = this.codigo.value;
    if (event.submitter.id == 'editar') {
            const nomex = this.nome.value.trim();
            if (!nomex) { 
            alert('É necessário preencher os campos antes de salvar!');
                return; 
            }
            const carga = this.carga.value;
            const externo = document.getElementById("externo").checked;
            const habilitacao=this.habilitacao.value;
            const area = this.area.value;
            const ucContainers = document.querySelectorAll(".uc");
            const ucs = Array.from(ucContainers).map(tr => {
                const [nome, horasAula, modulo, areaProf] = 
                      Array.from(tr.querySelectorAll("td")).map(td => td.textContent.trim());
                return { nome, horasAula, modulo, areaProf};
            });
            str = {nome, codigo, externo, carga, habilitacao, area, ucs};
            try {
                const response = await fetch(`/cursos/gerenciar/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(str)
                });
                const data = await response.json();
                const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
                const acao = "edição de curso";
                registrarLog(usuarioLogado, acao, id );
                exibirNotificacao(`Curso ${nome} atualizado com sucesso!`);
                setTimeout(() => {
                    window.location.href = '/cursos';
                }, 1500);
            } catch (error) {
                console.error('Erro:', error);
            }
    }
    else if(event.submitter.id == 'excluir'){
        const confirmarExclusao = window.confirm('Tem certeza de que deseja excluir este curso? Essa ação não pode ser desfeita.');
        if(confirmarExclusao){
            try {
                const response = await fetch(`/cursos/gerenciar/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
                const acao = "exclusão de curso";
                const dadosExcluidos = {
                    nome, codigo
                }
                registrarLogExclusao(usuarioLogado, acao, id, dadosExcluidos);
                exibirNotificacao(`Curso ${nome} excluído com sucesso!`);
                setTimeout(() => {
                    window.location.href = '/cursos';
                }, 1500);
            } catch (error) {
                console.error('Erro:', error);
            }
        }else{
            window.location.href = '/cursos'; 
        }
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
