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
        const response = await fetch(`/tecnicos/gerenciar/matricula/${matricula}`);
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

document.getElementById('novo-tecnico').addEventListener('submit', async function(event) {
    event.preventDefault();
    const botaoCadastro = document.getElementById('salvar');
    botaoCadastro.setAttribute('disabled', 'disabled');
    const nomex = this.nome.value.trim();
    if (!nomex) { 
       alert('É necessário preencher os campos antes de salvar!');
        return; 
    }
    const nome = this.nome.value;
    const matricula=this.matricula.value;
    const area=this.area.value;
    const tipoContratacao=this.tipoContratacao.value;
    const turno = this.turno.value;
    const status = this.status.value;
    const registroContainers = document.querySelectorAll(".registro");
    const tabelaDias = document.querySelectorAll('.calendar table');
    const horarios = [];

    if (matriculaExiste) {
        alert("A matrícula informada já está cadastrada.");
        return;
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

    try {
        const response = await fetch('/tecnicos/gerenciar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nome, matricula, tipoContratacao, area, turno, status, horarios, ausencias})
        });
        const data = await response.json();
        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
        const acao = "criação de técnico";
        registrarLog(usuarioLogado, acao, data.idDocumento);
        exibirNotificacao(`Técnico ${nome} criado com sucesso!`);
            setTimeout(() => {
            window.location.href = '/tecnicos';
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


