async function preencherConta() {
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
    
        document.getElementById('id').value=usuario[0]._id;
        document.getElementById('nome').value = usuario[0].nome;
        document.getElementById('matricula').value = usuario[0].matricula;
        document.getElementById('avatar-usuario').src=usuario[0].avatar;
    } catch (error) {
        console.error(error);
    }
}

document.getElementById("avatares").addEventListener("click", function(event) {
    const janela = document.getElementById('escolha-avatar').querySelector('div');
    let avatarUsuario = document.getElementById('avatar-usuario');
    const outrosItens = document.querySelectorAll('.juntar');
    const corpo=document.querySelector(".corpo-frame");
    janela.classList.toggle("escolha-avatar-div");
    corpo.classList.toggle("naorola");
    outrosItens.forEach(a=>{
        if (a.style.pointerEvents === 'none') {
            a.style.pointerEvents = 'auto';
        } else {
            a.style.pointerEvents = 'none';
        }
    }); 
    const avatares = document.querySelectorAll('.avatares');
    avatares.forEach(avatare => {
        avatare.classList.toggle('hover-active');
    });

    if (janela.innerHTML.trim() !== "") {
        janela.innerHTML = "";
    } else {
        janela.innerHTML = `
            <button id="fecharDiv"><img src="../img/avatares/cancelar.png" /></button>
            <button type="button" id="semfoto.png" class="escolha"><img src="../img/avatares/semfoto.png" /></button>
            <button type="button" id="des-bob.jpg" class="escolha"><img src="../img/avatares/des-bob.jpg" /></button>
            <button type="button" id="des-patrick.jpg" class="escolha"><img src="../img/avatares/des-patrick.jpg" /></button>
            <button type="button" id="des-lula.jpg" class="escolha"><img src="../img/avatares/des-lula.jpg" /></button>
            <button type="button" id="des-plancton.jpg" class="escolha"><img src="../img/avatares/des-plancton.jpg" /></button>
            <button type="button" id="des-garry.jpg" class="escolha"><img src="../img/avatares/des-garry.jpg" /></button>
            <button type="button" id="des-sirigueijo.jpg" class="escolha"><img src="../img/avatares/des-sirigueijo.jpg" /></button>
            <button type="button" id="des-homer.jpg" class="escolha"><img src="../img/avatares/des-homer.jpg" /></button>
            <button type="button" id="des-marge.jpg" class="escolha"><img src="../img/avatares/des-marge.jpg" /></button>
            <button type="button" id="des-lisa.jpg" class="escolha"><img src="../img/avatares/des-lisa.jpg" /></button>
            <button type="button" id="des-bart.jpg" class="escolha"><img src="../img/avatares/des-bart.jpg" /></button>
            <button type="button" id="des-baby.jpg" class="escolha"><img src="../img/avatares/des-baby.jpg" /></button>
            <button type="button" id="des-sanders.jpg" class="escolha"><img src="../img/avatares/des-sanders.jpg" /></button>
            <button type="button" id="des-fred.jpg" class="escolha"><img src="../img/avatares/des-fred.jpg" /></button>
            <button type="button" id="des-wilma.jpg" class="escolha"><img src="../img/avatares/des-wilma.jpg" /></button>
            <button type="button" id="des-barney.jpg" class="escolha"><img src="../img/avatares/des-barney.jpg" /></button>
            <button type="button" id="des-betty.jpg" class="escolha"><img src="../img/avatares/des-betty.jpg" /></button>
            <button type="button" id="des-jerry.jpg" class="escolha"><img src="../img/avatares/des-jerry.jpg" /></button>
            <button type="button" id="des-tom.jpg" class="escolha"><img src="../img/avatares/des-tom.jpg" /></button>
            <button type="button" id="heroi-aranha.jpg" class="escolha"><img src="../img/avatares/heroi-aranha.jpg" /></button>
            <button type="button" id="heroi-batman.jpg" class="escolha"><img src="../img/avatares/heroi-batman.jpg" /></button>
            <button type="button" id="heroi-cap.jpg" class="escolha"><img src="../img/avatares/heroi-cap.jpg" /></button>
            <button type="button" id="heroi-homem.jpg" class="escolha"><img src="../img/avatares/heroi-homem.jpg" /></button>
            <button type="button" id="heroi-hulk.jpg" class="escolha"><img src="../img/avatares/heroi-hulk.jpg" /></button>
            <button type="button" id="heroi-thor.jpg" class="escolha"><img src="../img/avatares/heroi-thor.jpg" /></button>
            <button type="button" id="power-rosa.jpg" class="escolha"><img src="../img/avatares/power-rosa.jpg" /></button>
            <button type="button" id="power-amarelo.jpg" class="escolha"><img src="../img/avatares/power-amarelo.jpg" /></button>
            <button type="button" id="power-verd.jpg" class="escolha"><img src="../img/avatares/power-verd.jpg" /></button>
            <button type="button" id="power-vermelho.jpg" class="escolha"><img src="../img/avatares/power-vermelho.jpg" /></button>
            <button type="button" id="power-preto.jpg" class="escolha"><img src="../img/avatares/power-preto.jpg" /></button>
            <button type="button" id="power-azul.jpg" class="escolha"><img src="../img/avatares/power-azul.jpg" /></button>
            <button type="button" id="scooby.jpg" class="escolha"><img src="../img/avatares/scooby.jpg" /></button>
            <button type="button" id="scooby-dafne.jpg" class="escolha"><img src="../img/avatares/scooby-dafne.jpg" /></button>
            <button type="button" id="scooby-fred.jpg" class="escolha"><img src="../img/avatares/scooby-fred.jpg" /></button>
            <button type="button" id="scooby-velma.jpg" class="escolha"><img src="../img/avatares/scooby-velma.jpg" /></button>
            <button type="button" id="scooby-salsicha.jpg" class="escolha"><img src="../img/avatares/scooby-salsicha.jpg" /></button>
            <button type="button" id="star-darth.jpg" class="escolha"><img src="../img/avatares/star-darth.jpg" /></button>
            <button type="button" id="star-han.jpg" class="escolha"><img src="../img/avatares/star-han.jpg" /></button>
            <button type="button" id="star-leia.jpg" class="escolha"><img src="../img/avatares/star-leia.jpg" /></button>
            <button type="button" id="star-mini-yoda.jpg" class="escolha"><img src="../img/avatares/star-mini-yoda.jpg" /></button>
            <button type="button" id="star-yoda.jpg" class="escolha"><img src="../img/avatares/star-yoda.jpg" /></button>
            <button type="button" id="super-florzinha.jpg" class="escolha"><img src="../img/avatares/super-florzinha.jpg" /></button>
            <button type="button" id="super-lindinha.jpg" class="escolha"><img src="../img/avatares/super-lindinha.jpg" /></button>
            <button type="button" id="super-docinho.jpg" class="escolha"><img src="../img/avatares/super-docinho.jpg" /></button>
            <button type="button" id="super-utonio.jpg" class="escolha"><img src="../img/avatares/super-utonio.jpg" /></button>
            <button type="button" id="toy-buzz.jpg" class="escolha"><img src="../img/avatares/toy-buzz.jpg" /></button>
            <button type="button" id="toy-jessie.jpg" class="escolha"><img src="../img/avatares/toy-jessie.jpg" /></button>
            <button type="button" id="toy-wood.jpg" class="escolha"><img src="../img/avatares/toy-wood.jpg" /></button>
            <button type="button" id="tres-sam.jpg" class="escolha"><img src="../img/avatares/tres-sam.jpg" /></button>
            <button type="button" id="tres-clover.jpg" class="escolha"><img src="../img/avatares/tres-clover.jpg" /></button>
            <button type="button" id="tres-alex.jpg" class="escolha"><img src="../img/avatares/tres-alex.jpg" /></button>

        `;
    }
    document.getElementById("fecharDiv").onclick = function() {
       janela.classList.remove("escolha-avatar-div");
            corpo.classList.remove("naorola");
            outrosItens.forEach(a=>{
                if (a.style.pointerEvents === 'none') {
                    a.style.pointerEvents = 'auto';
                }
            });
            janela.innerHTML = "";
    };
    document.querySelectorAll(".escolha").forEach(button => {
        button.addEventListener("click", function() {
            let id = this.id;
            let novoSrc = `../img/avatares/${id}`;
            avatarUsuario.src=novoSrc;
            janela.classList.remove("escolha-avatar-div");
            corpo.classList.remove("naorola");
            outrosItens.forEach(a=>{
                if (a.style.pointerEvents === 'none') {
                    a.style.pointerEvents = 'auto';
                }
            });
            janela.innerHTML = "";
        });
    });

});

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

document.getElementById('editar-conta').addEventListener('submit', async function(event) {
    const botaoCadastro = document.getElementById('editar');
    botaoCadastro.setAttribute('disabled', 'disabled');
    event.preventDefault();
    if (event.submitter.id == 'editar') {
            const id=this.id.value;            
            const nome = this.nome.value;
            const matricula = this.matricula.value;
            const senha=this.nsenha1.value;
            const nsenha2=this.nsenha2.value;     
            if(senha!==nsenha2){
                alert("Senhas não conferem")
                return
            }
            const avatar = document.getElementById('avatar-usuario').src;
            const body = {
                nome,
                matricula,
                avatar
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
                const data = await response.json();
                exibirNotificacao(`Usuário ${matricula} atualizado com sucesso!`);
                setTimeout(() => {
                    window.location.href = '/index';
                }, 1500);
            } catch (error) {
                console.error('Erro:', error);
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

window.onload = preencherConta();