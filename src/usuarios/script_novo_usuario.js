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

let matriculaExiste = false;

document.getElementById("matricula").addEventListener("input", async function() {
    let matricula = this.value;
    const msg = document.querySelector("#msg1");
    
    if (!matricula) {
        msg.classList.add("hidden");
        matriculaExiste = false;
        return;
    }
    
    this.value = matricula;
    try {
        const response = await fetch(`/usuarios/gerenciar/matricula/${matricula}`);
        const resultados = await response.json();

        if (response.ok && resultados[0].matricula === matricula) {
            msg.classList.remove("hidden");
            matriculaExiste = true;
        } else {
            msg.classList.add("hidden");
            matriculaExiste = false;
        }
    } catch (error) {
        console.error("Erro ao buscar matrícula:", error);
        msg.classList.add("hidden");
        matriculaExiste = false;
    }
});

document.getElementById('novo-usuario').addEventListener('submit', async function(event) {
    event.preventDefault();
    const botaoCadastro = document.getElementById('salvar');
    botaoCadastro.setAttribute('disabled', 'disabled');
    const nome = this.nome.value;
    const matricula = this.matricula.value;
    const area=this.area.value;
    const email=this.email.value;
    const funcao = this.funcao.value;
    const status = this.status.value;
    const senha=this.nsenha1.value;
    const nsenha2=this.nsenha2.value;

    if (matriculaExiste) {
        alert("A matrícula informada já está cadastrada.");
        return;
    }

    if (!nome || !area || !matricula || !email || !funcao || !status) {
        alert("Todos os campos devem ser preenchidos antes de salvar!");
        return;
    }

    if(senha!==nsenha2){
        alert("Senhas não conferem")
        return
    }
    try {
        const response = await fetch('/usuarios/gerenciar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nome, matricula, area, email, funcao, status, senha})
        });
        const data = await response.json();
        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
        const acao = "criação de usuário";
        registrarLog(usuarioLogado, acao, data.idDocumento);
        exibirNotificacao(`Usuário ${matricula} criado com sucesso!`);
            setTimeout(() => {
            window.location.href = '/usuarios';
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


