document.getElementById("nsenha2").addEventListener("input", function(event) {
    const senha = document.getElementById("nsenha1").value;
    const nsenha2 = this.value;
    const msg=document.querySelector('#msg2');
    if(senha!==nsenha2){
        msg.classList.remove('hidden');
        return
    }else{
        msg.classList.add('hidden');
    }
});

document.getElementById('editar-usuario').addEventListener('submit', async function(event) {
    event.preventDefault();
    const botaoEditar = document.getElementById('editar');
    botaoEditar.setAttribute('disabled', 'disabled');
    const botaoExcluir = document.getElementById('excluir');
    botaoExcluir.setAttribute('disabled', 'disabled');
    const id=this.id.value;
    const nome = this.nome.value.toUpperCase();
    const matricula = this.matricula.value;
    const area=this.area.value;
    const email=this.email.value;
    const funcao = this.funcao.value;
    const status = this.status.value
    if (event.submitter.id == 'editar') {
            const senha=this.nsenha1.value;
            const nsenha2=this.nsenha2.value;
            if(senha!==nsenha2){
                alert("Senhas não conferem")
                return
            }
            const body = {
                nome,
                matricula,
                area,
                email,
                funcao,
                status
            };
            if (senha !== "" && nsenha2 !== "") {
                body.senha = senha;
            }
            try {
                const response = await fetch(`/usuarios/gerenciar/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });
                if(funcao==="Técnico" || funcao==="Facilitador"){
                    await atualizarStatusTecnico(matricula, status);
                }
                const data = await response.json();
                const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
                const acao = "edição de usuário";
                registrarLog(usuarioLogado, acao, id);
                exibirNotificacao(`Usuário ${matricula} atualizado com sucesso!`);
                setTimeout(() => {
                   window.location.href = '/usuarios';
                }, 1500);
            } catch (error) {
                console.error('Erro:', error);
            }
    }
    else if(event.submitter.id == 'excluir'){
        const id = this.id.value;
        const confirmarExclusao = window.confirm('Tem certeza de que deseja excluir este usuário? Essa ação não pode ser desfeita.');
        if(confirmarExclusao){
            try {
                const response = await fetch(`/usuarios/gerenciar/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
                const acao = "exclusão de usuário";
                const dadosExcluidos = {
                    nome, matricula, area, email, funcao
                }
                registrarLogExclusao(usuarioLogado, acao, id, dadosExcluidos);
                exibirNotificacao(`Usuário ${this.matricula.value} excluído com sucesso!`);
                setTimeout(() => {
                    window.location.href = '/usuarios';
                }, 1500);
            } catch (error) {
                console.error('Erro:', error);
            }
        }else{
            window.location.href = '/usuarios'; 
        }
    }
    
});

async function atualizarStatusTecnico(matricula, status) {
    try {
        
        const listaResponse = await fetch('/tecnicos/gerenciar');
        if (!listaResponse.ok) {
            console.error("Erro ao buscar lista de técnicos.");
            return false;
        }
        const tecnicos = await listaResponse.json();
        const tecnico = tecnicos.find(t => t.matricula === matricula);
        if (!tecnico) {
            console.error("Técnico com a matrícula especificada não encontrado.");
            return false;
        }
        const idTec = tecnico._id; 
        const response = await fetch(`/tecnicos/gerenciar/status/${idTec}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro ao atualizar status do técnico:", errorData);
            return false;
        }

        console.log("Status do técnico atualizado com sucesso.");
        return true;
    } catch (error) {
        console.error("Erro na requisição de status do técnico:", error);
        return false;
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
