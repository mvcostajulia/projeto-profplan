var agendamentoTecnico = [];

function arredondarHorario(horario) {
    let [horas, minutos] = horario.split(':').map(Number);

    let minutosArredondados = Math.round(minutos / 15) * 15;

    if (minutosArredondados === 60) {
        minutosArredondados = 0;
        horas += 1;
    }

    return `${horas.toString().padStart(2, '0')}:${minutosArredondados.toString().padStart(2, '0')}`;
}

function funcaoTecnico(){
    const novoHorario=document.querySelector(".horarios");
    const tabelaHorario=document.querySelector(".calendar");
    const pHorario=document.querySelector(".hora");
    const tipo=document.getElementById("tipoContratacao").value;
    const matricula = document.getElementById("matricula");
    if(tipo==="Intermitente" || tipo==="RPA" || tipo==="Selecione" || tipo==="Mensalista - Horário especial"){
        novoHorario.style.display = 'none';
        tabelaHorario.style.display = 'none';
        pHorario.style.display = 'none';
    }
    else{
        novoHorario.style.display = 'flex';
        tabelaHorario.style.display = 'flex';
        pHorario.style.display = 'flex';
    }
    
    if(tipo==="RPA"){
        matricula.value="";
        matricula.setAttribute("disabled","true");
        matricula.removeAttribute("required");
    }
    else{
        matricula.removeAttribute("disabled");
        matricula.setAttribute("required","true");
    }
}
window.addEventListener("load", funcaoTecnico);
document.getElementById("tipoContratacao").addEventListener("change", funcaoTecnico);

document.getElementById("addHorario").addEventListener("click", function () {
    const diaSemana = document.getElementById("dia-semana").value;
    let horarioInicio = document.getElementById("horario-inicial").value;
    let horarioFim = document.getElementById("horario-final").value;
    let intervaloInicio = document.getElementById("intervalo-inicial").value;
    let intervaloFim = document.getElementById("intervalo-final").value;
    let tipoContratacao = document.getElementById("tipoContratacao").value;
    if (!horarioInicio || !horarioFim) {
        alert("Por favor, preencha ambos os horários corretamente.");
        return;
    }
    horarioInicio = arredondarHorario(horarioInicio);
    horarioFim = arredondarHorario(horarioFim);
    const diferencaHoras = (new Date(`1970-01-01T${horarioFim}:00`) - new Date(`1970-01-01T${horarioInicio}:00`)) / (1000 * 60 * 60);
    const diferencaIntervalo = (new Date(`1970-01-01T${intervaloFim}:00`) - new Date(`1970-01-01T${intervaloInicio}:00`)) / (1000 * 60);
    if (diferencaHoras > 4 && diferencaHoras < 8 && diferencaIntervalo < 15) {
        alert("O intervalo deve ser de no mínimo 15 minutos.");
        return;
    }
    if (diferencaHoras > 4 && diferencaHoras < 8 && !diferencaIntervalo) {
        alert("O intervalo deve ser de no mínimo 15 minutos.");
        return;
    }
    if (diferencaHoras > 4 && diferencaHoras>= 8 && !diferencaIntervalo) {
        alert("O intervalo deve ter entre 1h e 2h.");
        return;
    }
    if (diferencaHoras >= 8 && (diferencaIntervalo < 60 || diferencaIntervalo > 120)) {
        alert("O intervalo deve ter entre 1h e 2h.");
        return;
    }
    if ((intervaloInicio && intervaloFim) && (intervaloInicio<=horarioInicio || intervaloFim>=horarioFim)) {
        alert("O intervalo deve estar dentro horário do trabalho");
        return;
    }
    const tabelas = {
        "2": document.querySelector("#segunda tbody"),
        "3": document.querySelector("#terca tbody"),
        "4": document.querySelector("#quarta tbody"),
        "5": document.querySelector("#quinta tbody"),
        "6": document.querySelector("#sexta tbody"),
    };
    const tabela = tabelas[diaSemana];
    if (tabela instanceof NodeList) {
        for (const tbody of tabela) {
            const horariosExistentes = new Set(
                Array.from(tbody.querySelectorAll("td")).map(td => td.textContent.trim()).filter(text => text !== "")
            );
            if (horariosExistentes.size > 0) {
                alert("Horário já adicionado para este dia!");
                return;
            }
        }
    } else {
        const horariosExistentes = new Set(
            Array.from(tabela.querySelectorAll("td")).map(td => td.textContent.trim()).filter(text => text !== "")
        );
        if (horariosExistentes.size > 0) {
            alert("Horário já adicionado para este dia!");
            return;
        }
    }

    const diaSemanaNum = Number(diaSemana);
    const diaAnterior = diaSemanaNum !== 2 ? tabelas[String(diaSemanaNum - 1)] : null;
    const diaPosterior = diaSemanaNum !== 6 ? tabelas[String(diaSemanaNum + 1)] : null;
    if(diaAnterior && diaAnterior.querySelectorAll('tr').length != 0){
        const fim=diaAnterior.querySelector(".fim").textContent;
        const interjornada = (new Date(`1970-01-02T${horarioInicio}:00`) - new Date(`1970-01-01T${fim}:00`)) / (1000 * 60 * 60);
        if(interjornada<11){
            alert("Atenção: horário não permitido por regra de interjornada!!")
            return
        }
    }
    if(diaPosterior && diaPosterior.querySelectorAll('tr').length != 0){
        const inicio=diaPosterior.querySelector(".inicio").textContent;
        const interjornada = (new Date(`1970-01-02T${inicio}:00`) - new Date(`1970-01-01T${horarioFim}:00`)) / (1000 * 60 * 60);
        if(interjornada<11){
            alert("Atenção: horário não permitido por regra de interjornada!!")
            return
        }
    }
    if(!(tabela instanceof NodeList)){
        const linhaInicio = tabela.insertRow();
            const horarioCelulaInicio = linhaInicio.insertCell(0);
            horarioCelulaInicio.textContent = horarioInicio;
            horarioCelulaInicio.classList.add("selecionado", "inicio");
            horarioCelulaInicio.setAttribute("dia",diaSemana);
            const btnExcluir = document.createElement("button");
            btnExcluir.type = "button";
            btnExcluir.style.all = "unset";
            btnExcluir.style.marginLeft = "4vw";
            btnExcluir.style.cursor = "pointer";
            const imgIcone = document.createElement("img");
            imgIcone.src = "../img/Trash.svg";
            imgIcone.alt = "Excluir"; 
            btnExcluir.appendChild(imgIcone);
            btnExcluir.addEventListener("click", (e) => {
                e.stopPropagation();
                const linhas = Array.from(tabela.rows); 
                linhas.forEach(linha => {
                const celula = linha.cells[0];
                    if (celula && celula.getAttribute("dia") === String(diaSemana)) {
                        linha.remove();
                    }
                });
            });
            horarioCelulaInicio.appendChild(btnExcluir);
            if(intervaloInicio && intervaloFim){
                const linhaIntervInicio = tabela.insertRow();
                const horarioIntervInicio = linhaIntervInicio.insertCell(0);
                const linhaIntervFim = tabela.insertRow();
                const horarioIntervFim = linhaIntervFim.insertCell(0);
                horarioIntervInicio.innerHTML = intervaloInicio;
                horarioIntervFim.innerHTML = intervaloFim;
                horarioIntervInicio.classList.add("intervalo");
                horarioIntervFim.classList.add("intervalo");
                horarioIntervInicio.setAttribute("dia",diaSemana);
                horarioIntervFim.setAttribute("dia",diaSemana);
            }
            const linhaFim = tabela.insertRow();
            const horarioCelulaFim = linhaFim.insertCell(0);
            horarioCelulaFim.textContent = horarioFim;
            horarioCelulaFim.classList.add("selecionado", "fim");
            horarioCelulaFim.setAttribute("dia",diaSemana);
            ultimaAdicao = { linhaInicio, linhaFim };
    }
    
});

document.getElementById("limpar").addEventListener("click", function () {
    const tabelas = {
        "2": document.querySelector("#segunda tbody"),
        "3": document.querySelector("#terca tbody"),
        "4": document.querySelector("#quarta tbody"),
        "5": document.querySelector("#quinta tbody"),
        "6": document.querySelector("#sexta tbody")
    };
    Object.values(tabelas).forEach(tabela => {
        if (tabela) {
            tabela.innerHTML = '';
        }
    });
});

document.getElementById("rotulo").addEventListener("change", function() {
    const divDias = document.querySelector('.dia-semana-atvd');
    const dataInicial=document.getElementById("data-inicial");
    const dataFinal=document.getElementById("data-final");
    const horaAusInicial=document.getElementsByClassName("horarios-atvd");
    const horaAusFinal=document.getElementsByClassName("horarios-atvd");
    if(this.value==="Férias"){
        divDias.setAttribute('hidden','true');
        dataFinal.removeAttribute('disabled');
        for (let i = 0; i < horaAusInicial.length; i++) {
            horaAusInicial[i].setAttribute('hidden', 'true');
        }
        for (let i = 0; i < horaAusFinal.length; i++) {
            horaAusFinal[i].setAttribute('hidden', 'true');
        }
        dataFinal.value = '';
        dataInicial.value = '';
    }
    else if(this.value==="Ausência" || this.value==="Viagem" || this.value==="Reunião" || this.value==="Treinamento"){
        for (let i = 0; i < horaAusInicial.length; i++) {
            horaAusInicial[i].removeAttribute('hidden');
        }
        for (let i = 0; i < horaAusFinal.length; i++) {
            horaAusFinal[i].removeAttribute('hidden');
        }
        divDias.setAttribute('hidden','true');
        dataFinal.removeAttribute('disabled');
        dataFinal.value = '';
        dataInicial.value = '';
    }
    else if(this.value==="Hora-atividade"){
        divDias.removeAttribute('hidden');
        for (let i = 0; i < horaAusInicial.length; i++) {
            horaAusInicial[i].removeAttribute('hidden');
        }
        for (let i = 0; i < horaAusFinal.length; i++) {
            horaAusFinal[i].removeAttribute('hidden');
        }
        dataFinal.value = '';
        dataInicial.value = '';
        dataFinal.value = dataInicial.value;
        dataFinal.removeAttribute('disabled');
    }
});

var dataInicial2=document.getElementById("data-inicial");
var dataFinal2=document.getElementById("data-final");
dataInicial2.addEventListener("input", function () {
    if (rotulo.value === "Hora-atividade") {
        dataFinal2.value = this.value;
    }
});

function parseDataAgendamento(dateString) {
    const parts = dateString.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

function verificaConflitoAgendamento(dataInicialAus, dataFinalAus, horaAusInicial, horaAusFinal, diasSelecionadosAus) {
    let inicioAus = new Date(dataInicialAus);
    let fimAus = new Date(dataFinalAus);
    inicioAus.setHours(inicioAus.getHours() + 3);
    fimAus.setHours(fimAus.getHours() + 3);
    const diasSemanaMap = {
        "domingo": 0, "segunda": 1, "terca": 2, "quarta": 3, 
        "quinta": 4, "sexta": 5, "sabado": 6
    };
    const diasAusIndices = diasSelecionadosAus.map(dia => diasSemanaMap[dia]);
    for (const cursoObj of agendamentoTecnico || []) {
        for (const agendamento of cursoObj.agendamentos) {
            const dataAg = parseDataAgendamento(agendamento.data);
            if (dataAg >= inicioAus && dataAg <= fimAus) {
                if (diasSelecionadosAus.length > 0) {
                     const diaAgendamento = dataAg.getDay();
                     if (!diasAusIndices.includes(diaAgendamento)) {
                        continue;
                     }
                }
                const horaParaMinutos = (hora) => {
                    const [h, m] = hora.split(':').map(Number);
                    return h * 60 + m;
                };
                const inicioAusMin = horaParaMinutos(horaAusInicial);
                const fimAusMin = horaParaMinutos(horaAusFinal);
                const inicioAgMin = horaParaMinutos(agendamento.horarioInicio);
                const fimAgMin = horaParaMinutos(agendamento.horarioFim);
                if (inicioAusMin < fimAgMin && fimAusMin > inicioAgMin) {
                    return true; 
                }
            }
        }
    }
    return false;
}

document.getElementById("addAusencia").addEventListener("click", function () {
    const dataInicial = document.getElementById("data-inicial").value;
    const dataFinal = document.getElementById("data-final").value;
    const horaAusInicial = document.getElementById("hora-aus-inicial").value;
    const horaAusfinal = document.getElementById("hora-aus-final").value;
    const rotulo = document.getElementById("rotulo").value;
    const diasMarcados = document.querySelectorAll('input[name="dia"]:checked');
    const diasSelecionados = [];
    diasMarcados.forEach(function (checkbox) {
        diasSelecionados.push(checkbox.value);
    });
    const tabelaAus = document.querySelector("#aus tbody");

    if (rotulo === "Férias") {
        if ((!dataInicial || !dataFinal) || (dataFinal < dataInicial)) {
            alert("Por favor, preencha corretamente as datas de início e fim!")
            return
        }if (verificaConflitoAgendamento(dataInicial, dataFinal, "00:00", "23:59", [])) {
             alert(`Conflito com agendamento! Não é possível adicionar férias, pois há um agendamento no período selecionado.`);
             return;
        }
        else {
            let datainicio = new Date(dataInicial);
            let datafim = new Date(dataFinal);
            datainicio.setHours(datainicio.getHours() + 3);
            datafim.setHours(datafim.getHours() + 3);
            const registro = tabelaAus.insertRow();
            registro.classList.add("registro");
            const registroRotulo = registro.insertCell();
            const registroDataInicial = registro.insertCell();
            const registroDataFinal = registro.insertCell();
            const registroHoraInicial = registro.insertCell();
            const registroHoraFinal = registro.insertCell();
            const registroDiaSemana = registro.insertCell();
            const registroAcao = registro.insertCell();
            registroDataInicial.textContent = datainicio.toLocaleDateString("pt-BR");
            registroDataFinal.textContent = datafim.toLocaleDateString("pt-BR");
            registroRotulo.textContent = rotulo;
            const botaoRemover = document.createElement("button");
            botaoRemover.textContent = "Remover";
            botaoRemover.onclick = function () {
                registro.remove();
            };
            registroAcao.appendChild(botaoRemover);
            registroAcao.classList.add("remove");
        }
    } 
    else if (rotulo === "Ausência" || rotulo === "Viagem" || rotulo === "Reunião" || rotulo === "Treinamento") {
        if ((!dataInicial || !dataFinal) || (dataFinal < dataInicial) || (horaAusfinal < horaAusInicial) || (!horaAusInicial && horaAusfinal) || (horaAusInicial && !horaAusfinal)) {
            alert("Por favor, preencha corretamente os dados!")
            return
        } 
        if (verificaConflitoAgendamento(dataInicial, dataFinal, horaAusInicial, horaAusfinal, [])) {
             alert(`Conflito com agendamento! Não é possível adicionar ${rotulo} no período e horário selecionados.`);
             return;
        }
        else {
            let datainicio = new Date(dataInicial);
            let datafim = new Date(dataFinal);
            datainicio.setHours(datainicio.getHours() + 3);
            datafim.setHours(datafim.getHours() + 3);
            const registro = tabelaAus.insertRow();
            registro.classList.add("registro");
            const registroRotulo = registro.insertCell();
            const registroDataInicial = registro.insertCell();
            const registroDataFinal = registro.insertCell();
            const registroHoraInicial = registro.insertCell();
            const registroHoraFinal = registro.insertCell();
            const registroDiaSemana = registro.insertCell();
            const registroAcao = registro.insertCell();
            registroDataInicial.textContent = datainicio.toLocaleDateString("pt-BR");
            registroDataFinal.textContent = datafim.toLocaleDateString("pt-BR");
            registroHoraInicial.textContent = horaAusInicial;
            registroHoraFinal.textContent = horaAusfinal;
            registroRotulo.textContent = rotulo;
            const botaoRemover = document.createElement("button");
            botaoRemover.textContent = "Remover";
            botaoRemover.onclick = function () {
                registro.remove();
            };
            registroAcao.appendChild(botaoRemover);
            registroAcao.classList.add("remove");
        }
    } 
    else if (rotulo === "Hora-atividade") {
        if ((!dataInicial || !dataFinal || (diasSelecionados.length === 0)) || (dataFinal < dataInicial) || (horaAusfinal < horaAusInicial) || (!horaAusInicial && horaAusfinal) || (horaAusInicial && !horaAusfinal)) {
            alert("Por favor, preencha corretamente os dados!")
            return
        }
        if (verificaConflitoAgendamento(dataInicial, dataFinal, horaAusInicial, horaAusfinal, diasSelecionados)) {
            alert(`Conflito com agendamento! Não é possível adicionar ${rotulo} no período, horário e dias selecionados.`);
            return;
        }
        else {
            let datainicio = new Date(dataInicial);
            let datafim = new Date(dataFinal);
            datainicio.setHours(datainicio.getHours() + 3);
            datafim.setHours(datafim.getHours() + 3);

            const registro = tabelaAus.insertRow();
            registro.classList.add("registro");
            const registroRotulo = registro.insertCell();
            const registroDataInicial = registro.insertCell();
            const registroDataFinal = registro.insertCell();
            const registroHoraInicial = registro.insertCell();
            const registroHoraFinal = registro.insertCell();
            const registroDiaSemana = registro.insertCell();
            const registroAcao = registro.insertCell();
            registroDataInicial.textContent = datainicio.toLocaleDateString("pt-BR");
            registroDataFinal.textContent = datafim.toLocaleDateString("pt-BR");
            registroHoraInicial.textContent = horaAusInicial;
            registroHoraFinal.textContent = horaAusfinal;
            registroRotulo.textContent = rotulo;
            let texto = "";
            for (let i = 0; i < diasSelecionados.length; i++) {
                texto += `${diasSelecionados[i]} `;
            }
            registroDiaSemana.innerHTML = texto;
            const botaoRemover = document.createElement("button");

            botaoRemover.textContent = "Remover";
            botaoRemover.onclick = function () {
                registro.remove();
            };
            registroAcao.appendChild(botaoRemover);
            registroAcao.classList.add("remove");
        }
    }
});

function limparAusencias() {
    const linhas = document.querySelectorAll("#aus tbody tr");
    linhas.forEach(linha => {
        const botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover";
        botaoRemover.style.marginLeft = "10px";
        botaoRemover.onclick = function () {
            linha.remove();
        };
        const colunaAcao = document.createElement("td");
        colunaAcao.appendChild(botaoRemover);
        linha.appendChild(colunaAcao);
    });
}
