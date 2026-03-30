document.addEventListener('DOMContentLoaded', ()=>{
    const copia=JSON.parse(localStorage.getItem('copiaCurso'));
    if(copia){
        document.getElementById('habilitacao').value = copia[0].habilitacao;
        document.getElementById('area').value = copia[0].area;
        if (Array.isArray(copia[0].ucs)) {
            const tabela = document.querySelector("#table-ucs tbody");
            copia[0].ucs.forEach(uc => {
                const registro = tabela.insertRow();
                registro.classList.add("uc");
                const registroNome = registro.insertCell();
                const registroHorasAula = registro.insertCell();
                const registroModulo = registro.insertCell();
                const registroArea = registro.insertCell();
                const registroAcao = registro.insertCell();
                registroNome.textContent = uc.nome;
                registroHorasAula.textContent = uc.horasAula;
                registroModulo.textContent = uc.modulo;
                
                registroArea.innerHTML=uc.areaProf;
                registroArea.classList.add("area-esquerda");
                registroNome.classList.add("area-esquerda");
                const botaoRemover = document.createElement("button");
                botaoRemover.textContent = "Remover";
                botaoRemover.onclick = function () {
                    registro.remove();
                };
                registroAcao.appendChild(botaoRemover);
                registroAcao.classList.add("remove");
            });
        }
    }
    localStorage.setItem('copiaCurso', JSON.stringify(""));
});

document.getElementById('novo-curso').addEventListener('submit', async function(event) {
    event.preventDefault();
    const botaoCadastro = document.getElementById('salvar');
    botaoCadastro.setAttribute('disabled', 'disabled');
    let str;
    const nomex = this.nome.value.trim();
    if (!nomex) { 
    alert('É necessário preencher os campos antes de salvar!');
        return; 
    }
    const nome = this.nome.value.toUpperCase();
    let codigo = this.codigo.value;
    const externo = document.getElementById("externo").checked;
    const carga = this.carga.value;
    const habilitacao=this.habilitacao.value;
    const area = this.area.value;
    const ucContainers = document.querySelectorAll(".uc");
    const ucs = Array.from(ucContainers).map(tr => {
        const [nome, horasAula, modulo, areaProf] = 
                Array.from(tr.querySelectorAll("td")).map(td => td.textContent.trim());
        return { nome, horasAula, modulo, areaProf};
    });
    codigo = codigo.replace(/[.\s]/g, "");
    str = {nome, codigo, externo, carga, habilitacao, area, ucs};
    try {
        const response = await fetch('/cursos/gerenciar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(str)
        });
        const data = await response.json();
        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
        const acao = "criação de curso";
        registrarLog(usuarioLogado, acao, data.idDocumento);
        exibirNotificacao(`Curso ${nome} criado com sucesso!`);
            setTimeout(() => {
            window.location.href = '/cursos';
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


