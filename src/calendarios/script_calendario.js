
const mesSelecionado = document.querySelector('#mesSelect');
const anoSelect = document.getElementById('anoSelect');
const anoAtual = new Date().getFullYear();
const mesAtual = new Date().getMonth() + 1;
const limpar = document.getElementById("limpar");
const largura = window.innerWidth;
const currentDate = new Date();
let currentWeekStart = getStartOfWeek(currentDate);
const pdfButton = document.querySelector("#pdf");
const csvButton = document.querySelector("#csv");
const semanalCalendar = document.querySelector('#semanal');
const mensalCalendar = document.querySelector('#vis-mensal');
const botaoMensal = document.getElementById("visual-mensal");
const botaoSemanal = document.getElementById("visual-semanal");
const controleSemanal = document.getElementById("controle-semanal");
const tituloMes = document.getElementById("title-mes");
let carregando = false;
const selectTurmas = document.querySelector("#turma");
const selectTecnicos = document.querySelector("#tecnicoEnsino");
const selectArea = document.querySelector("#area");

const coresTecnicos = {};
const listaCores = ["um", "dois", "tres", "quatro", "cinco", "seis"];
const listaCoresCalendario = ["um", "dois", "tres", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"];
let corIndex = 0;


mesSelecionado.value=mesAtual;

for (let i = anoAtual - 5; i <= anoAtual + 5; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    if (i === anoAtual) option.selected = true;
    anoSelect.appendChild(option);
}

function emMinutos(horaString){
    const [hora, minuto] = horaString.split(':').map(Number);
    return hora * 60 + minuto;
}

function getStartOfWeek(date) {
    const day = date.getDay();
   const diff = day === 0 ? -6 : 1 - day; 
    return new Date(date.setDate(date.getDate() + diff));
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function buscaAreaTecnico(id){
    const responseTecnicos = await fetch('/tecnicos/gerenciar');
    const tec = await responseTecnicos.json();
    const mapTec = tec.filter(t =>{
        return t._id===id;
    });
    return mapTec[0].area;
}

function getDiaSemanaString(diaSemana) {
    const dias = { '2': 'segunda', '3': 'terca', '4': 'quarta', '5': 'quinta', '6': 'sexta' };
    return dias[diaSemana] || '';
}

function primeiroDiaUtil(mes, ano) {
  const data = new Date(ano, mes - 1, 1);
  while (data.getDay() !== 1) {
    data.setDate(data.getDate() + 1);
  }
  return data;
}

function alternarCalendario(tipo) {
  const config = {
    mensal: () => {
        tituloMes.textContent = currentWeekStart.toLocaleString("pt-BR", { month: "long" }).toUpperCase();
        semanalCalendar.style.display = 'none';
        mensalCalendar.style.display = 'flex';
        controleSemanal.style.display = 'flex';
        botaoSemanal.style.color = 'var(--cor-base)';
        botaoSemanal.style.backgroundColor = 'var(--cor-primaria)';
        botaoMensal.style.color = 'var(--cor-primaria)';
        botaoMensal.style.backgroundColor = 'var(--cor-base)';
    },
    semanal: () => {
        tituloMes.textContent = currentWeekStart.toLocaleString("pt-BR", { month: "long" }).toUpperCase();
        renderWeek();
        semanalCalendar.style.display = 'flex';
        mensalCalendar.style.display = 'none';
        controleSemanal.style.display = 'flex';
        botaoMensal.style.color = 'var(--cor-base)';
        botaoMensal.style.backgroundColor = 'var(--cor-primaria)';
        botaoSemanal.style.color = 'var(--cor-primaria)';
        botaoSemanal.style.backgroundColor = 'var(--cor-base)';
    }
  };
  config[tipo]();
}

function preencherTabelaMes(mes, ano) {
    const tabelas = [
        "vis-mes-geral",
        "vis-mes-manha",
        "vis-mes-tarde",
        "vis-mes-noite"
    ];
    tabelas.forEach(id => {
        const t = document.getElementById(id).getElementsByTagName("tbody")[0];
        const tds = t.getElementsByTagName("td");
        for (let i = 0; i < tds.length; i++) {
            tds[i].style.border = '0.1vw solid #e9e9e9';
            tds[i].style.outline = 'none';
        }
    });
    mesSelecionado.value = mes;
    tabelas.forEach(idTabela => {
        const tabela = document.getElementById(idTabela).getElementsByTagName("tbody")[0];
        for (let i = 0; i < tabela.rows.length; i++) {
            for (let j = 0; j < tabela.rows[i].cells.length; j++) {
                const cell = tabela.rows[i].cells[j];
                cell.textContent = "";
                cell.removeAttribute("dia");
                cell.removeAttribute("datatd");
                cell.style.backgroundColor = "";
                cell.style.border = "0.1vw solid #e9e9e9";
            }
        }
        let dia = 1;
        let semana = 0;
        while (true) {
            const data = new Date(ano, mes - 1, dia);
            if (data.getMonth() !== mes - 1) break;

            const diaSemana = data.getDay();
            if (diaSemana >= 1 && diaSemana <= 5) {
                const linha = tabela.rows[semana];
                const coluna = diaSemana - 1;
                if (linha && linha.cells[coluna]) {
                    linha.cells[coluna].style.backgroundColor = 'var(--cor-base)';
                    linha.cells[coluna].textContent = dia;
                    linha.cells[coluna].setAttribute("dia", true);
                    const diaFormatado = String(dia).padStart(2, '0');
                    const mesFormatado = String(mes).padStart(2, '0');
                    const dataFormatada = `${diaFormatado}/${mesFormatado}/${ano}`;
                    linha.cells[coluna].setAttribute("datatd", dataFormatada);
                    const hoje = new Date();
                    const hojeFormatado = hoje.toLocaleDateString('pt-BR');
                    const currentWeekStartFormatado = currentWeekStart.toLocaleDateString('pt-BR');
                    if (dataFormatada === hojeFormatado && 
                        hoje >= currentWeekStart && 
                        hoje <= new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + 4)) {
                    } else if (dataFormatada === currentWeekStartFormatado) {
                        linha.cells[coluna].style.border = "0.1vw solid #000000ff";
                        linha.cells[coluna].style.outlineOffset = "-2px";
                    }
                }
                if (diaSemana === 5) semana++;
            }
            dia++;
        }
    });
    preencherDiasMes()
}

let listenerAdicionado = false;
async function preencherDiasMes() {
    const tabelas = [
        "vis-mes-geral",
        "vis-mes-manha",
        "vis-mes-tarde",
        "vis-mes-noite"
    ];
    if (!listenerAdicionado) {
        tabelas.forEach(idTabela => {
            const tabela = document.getElementById(idTabela).getElementsByTagName("tbody")[0];
            tabela.addEventListener("click", async (event) => {
                const td = event.target.closest("td");
                if (td && td.hasAttribute("dia")) {
                    tabelas.forEach(id => {
                        const t = document.getElementById(id).getElementsByTagName("tbody")[0];
                        const tds = t.getElementsByTagName("td");
                        for (let i = 0; i < tds.length; i++) {
                            tds[i].style.border = '0.1vw solid #e9e9e9';
                            tds[i].style.outline = 'none';
                        }
                    });
                    const dataClicada = td.getAttribute("datatd");
                    const [dia, mes, ano] = dataClicada.split("/").map(Number);
                    const dataF = new Date(ano, mes - 1, dia);
                    tabelas.forEach(id => {
                        const t = document.getElementById(id).getElementsByTagName("tbody")[0];
                        const tds = t.getElementsByTagName("td");
                        for (let i = 0; i < tds.length; i++) {
                            const tdi = tds[i];
                            if (tdi.getAttribute("datatd") === dataClicada) {
                                tdi.style.outline = "2px solid #000000ff";
                                tdi.style.outlineOffset = "-2px";
                            }
                        }
                    });
                    const diaSemana = dataF.getDay();
                    const diferenca = diaSemana === 0 ? -6 : 1 - diaSemana;
                    const inicioSemana = new Date(dataF);
                    inicioSemana.setDate(dataF.getDate() + diferenca);
                    currentWeekStart = inicioSemana;
                    renderWeek();
                    carregarAgendamentosBD();
                }
            });
        });
        listenerAdicionado = true;
    }
}



function renderWeek() {
    const weekDays = Array.from({ length: 5 }, (_, i) => {
        const day = new Date(currentWeekStart);
        day.setDate(currentWeekStart.getDate() + i);
        return day;
        
    });
    const dayNames = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
    dayNames.forEach((dayName, index) => {
        document.getElementById(dayName).innerHTML = `${capitalize(dayName)} <br><span> ${weekDays[index].toLocaleDateString()}</span>`;
    });
    const divs = document.querySelectorAll(".day");
    divs.forEach(div => {
        const dayIndex = dayNames.findIndex(day => div.classList.contains(day));
        if (dayIndex !== -1) {
            div.setAttribute("data", weekDays[dayIndex].toLocaleDateString());
        }
    });   
     weekLabel.innerHTML = `${weekDays[0].toLocaleDateString()} - ${weekDays[4].toLocaleDateString()}`; 
}

async function carregarAgendamentosBD() {
    if (carregando) return;
    carregando = true;
    window.listaCalendario = [];
    try{
        const responseAgendamentos = await fetch ('/agendamentos/gerenciar');
        if (responseAgendamentos.ok) {
            agendamentosBD = await responseAgendamentos.json();
        }
    } catch (error){ }
    if(agendamentosBD){
        agendamentosBD.forEach(agendado => {
            window.listaCalendario = window.listaCalendario || [];
            window.listaCalendario.push(agendado);
        });
    }
    const lista = window.listaCalendario;

    function verificarFiltros() {
        const turmaSelecionada = selectTurmas.value;
        const tecnicoSelecionado = selectTecnicos.value;
        const areaSelecionada = selectArea.value;
        const geral = document.querySelector("#geral");
        const turmaDiv = document.querySelector("#turmaFiltro");
        const tecnicoDiv = document.querySelector("#tecnicoFiltro");;

        if ( turmaSelecionada === 'selecione' &&
            tecnicoSelecionado === 'selecione' &&
            areaSelecionada === 'selecione') {
            
            const divHorarios = document.getElementById('horarios');
            divHorarios.style.display='none';
            csvButton.style.display = 'none';
            pdfButton.style.display = 'none';
            botaoMensal.setAttribute("disabled", "disabled");
            botaoMensal.style.opacity = "0.5"; 
            selectTurmas.removeAttribute("disabled");
            selectTecnicos.removeAttribute("disabled");
            selectArea.removeAttribute("disabled");
            geral.style.display="grid";
            turmaDiv.style.display="none";
            tecnicoDiv.style.display="none";

            const divs = geral.querySelectorAll("div");    
            divs.forEach(div => {
                div.innerHTML = "";
                const atbData = div.getAttribute("data");
                let agendamentosDoDia = [];
                lista.forEach(calendario => {
                    if (Array.isArray(calendario.agendamentos)) {
                        calendario.agendamentos.forEach(agendamento => {
                            if (agendamento.data === atbData) {
                                agendamentosDoDia.push(agendamento);
                            }
                        });
                    }
                });
                agendamentosDoDia.sort((a, b) => emMinutos(a.horarioInicio) - emMinutos(b.horarioInicio));
                agendamentosDoDia.forEach(agendamento => {
                    if (!coresTecnicos[agendamento.tecnico]) {
                        corIndex = corIndex >= listaCores.length ? 0 : corIndex;
                        coresTecnicos[agendamento.tecnico] = listaCores[corIndex];
                        corIndex++;
                    }
                    const cor = coresTecnicos[agendamento.tecnico];
                    div.innerHTML += `<div class='square ${cor}'></div>`;
                    const newdiv = div.lastElementChild;
                    const nome = agendamento.tecnico.split(" - ");
                    const turma = agendamento.turma.split(" - ");
                    const novoNome = nome[1].split(" ");
                    const primeiro = novoNome[0];
                    const ultimo = novoNome[novoNome.length - 1];
                    newdiv.innerHTML = `<b id="nome_tec">${primeiro} ${ultimo}</b> <br> Turma ${turma[1]} <br> ${agendamento.horarioInicio} ${agendamento.horarioFim}`;
                });
            });
            verificarScroll(geral);
        }else if(turmaSelecionada !== 'selecione'){
            carregaTurma(geral, turmaDiv, tecnicoDiv, selectTecnicos, selectArea, selectTurmas, lista);
        }else if(tecnicoSelecionado !== 'selecione'){
            carregaTecnico(geral, turmaDiv, tecnicoDiv, selectTecnicos, selectArea, selectTurmas, lista)             
        }else if(areaSelecionada !== 'selecione'){
            carregaArea(geral, turmaDiv, tecnicoDiv, selectTecnicos, selectArea, selectTurmas, lista);
        }
    }
    verificarFiltros();
    carregando = false;
}

function carregaTecnico(geral, turmaDiv, tecnicoDiv, selectTecnicos, selectArea, selectTurmas, lista){
    let agendaNaTela = [];
    let horasNaTela = [];
    const divHorarios = document.getElementById('horarios');
    divHorarios.style.display='flex';
    botaoMensal.removeAttribute("disabled");
    botaoMensal.style.opacity = "1";
    csvButton.style.display = 'flex';
    pdfButton.style.display = 'none';
    selectTurmas.setAttribute("disabled", "disabled");
    selectArea.setAttribute("disabled", "disabled");
    geral.style.display="none";
    turmaDiv.style.display="none";
    tecnicoDiv.style.display="grid";
    const divs = tecnicoDiv.querySelectorAll("#tecnico-um, #tecnico-dois, #tecnico-tres, #tecnico-quatro, #tecnico-cinco"); 
    const tecnicoFiltro = selectTecnicos.value;
    const infosTecs=JSON.parse(sessionStorage.getItem('resultadosTecnicoEnsinos'));
    const mapTecInfo = infosTecs.filter(info =>{
        return info._id===tecnicoFiltro;
    });
    let feriasTec = [];
    let ausTec = [];
    let horaTec = [];
    let ausNoDia = [];
    let horaNoDia = [];
    if(mapTecInfo[0].ausencias){
        mapTecInfo[0].ausencias.forEach(aus => {
            if(aus.rotulo==="Hora-atividade"){
                const diasSemana = {
                    "domingo": 0,
                    "segunda": 1,
                    "terca": 2,
                    "quarta": 3,
                    "quinta": 4,
                    "sexta": 5,
                    "sabado": 6
                };
                const diaSemanaAlvo = diasSemana[aus.diasMarcados.toLowerCase()];
                const atual = aus.dataInicial.split('/');
                const final = aus.dataFinal.split('/');
                const atualDate = new Date(atual[2], atual[1] - 1, atual[0]);
                const finalDate = new Date(final[2], final[1] - 1, final[0]);

                while (atualDate <= finalDate) {
                    if (atualDate.getDay() === diaSemanaAlvo) {
                        const dataFormatada = atualDate.toLocaleDateString('pt-BR');
                        horaTec.push(`${dataFormatada} - ${aus.horaAusInicial} - ${aus.horaAusfinal}`);
                    }
                    atualDate.setDate(atualDate.getDate() + 1);
                }
            }if(aus.rotulo==="Férias"){
                const atual = aus.dataInicial.split('/');
                const final = aus.dataFinal.split('/');
                const atualDate=new Date(atual[2], atual[1] - 1, atual[0]);
                const finalDate=new Date(final[2], final[1] - 1, final[0]);
                while (atualDate <= finalDate) {
                    const dataFormatada = atualDate.toLocaleDateString('pt-BR');
                    feriasTec.push(dataFormatada);
                    atualDate.setDate(atualDate.getDate() + 1);
                }
            }if(aus.rotulo==="Ausência" || aus.rotulo==="Reunião" || aus.rotulo==="Treinamento" || aus.rotulo==="Viagem"){
                const dataAus = aus.dataInicial;
                const horaIni = aus.horaAusInicial;
                const horaFi = aus.horaAusfinal;
                ausTec.push(`${aus.rotulo} - ${dataAus} - ${horaIni} - ${horaFi}`);
            }
        }); 
    }
    const periodosAtivos = {manha: false, tarde: false, noite: false};

    divs.forEach(div => {
        const atbData = div.getAttribute("data");
        let agendamentosDoDia = [];
        ausNoDia = [];
        horaNoDia = [];

        const todasAusenciasDoDia = [...ausTec, ...horaTec].filter(f => f.split(" - ")[0] === atbData);

        if(feriasTec.includes(atbData)){
            periodosAtivos.manha = true;
            periodosAtivos.tarde = true;
            periodosAtivos.noite = true;
        }
        lista.forEach(calendario => {
            if (Array.isArray(calendario.agendamentos)) {
                calendario.agendamentos.forEach(agendamento => {
                    const tecAgenda = agendamento.tecnico;
                    const idTecAgenda = tecAgenda.split(" - ")[0];
                    if (agendamento.data === atbData && tecnicoFiltro === idTecAgenda) {
                        agendamentosDoDia.push(agendamento);
                    }
                });
            }
        });
        const todosInicios = [
            ...agendamentosDoDia.map(a => emMinutos(a.horarioInicio)),
            ...todasAusenciasDoDia.map(a => emMinutos(a.split(" - ")[1]))
        ];
        const temManha = todosInicios.some(min => min >= emMinutos("07:00") && min < emMinutos("12:00"));
        const temTarde = todosInicios.some(min => min >= emMinutos("12:00") && min < emMinutos("18:00"));
        const temNoite = todosInicios.some(min => min >= emMinutos("18:00") && min < emMinutos("23:00"));

        if (temManha) periodosAtivos.manha = true;
        if (temTarde) periodosAtivos.tarde = true;
        if (temNoite) periodosAtivos.noite = true;
    });

    const horasParaCriar = [];
    if (periodosAtivos.manha) {
        for (let h = 7; h < 12; h++) horasParaCriar.push(h);
    }
    if (periodosAtivos.tarde) {
        for (let h = 12; h < 18; h++) horasParaCriar.push(h);
    }
    if (periodosAtivos.noite) {
        for (let h = 18; h < 23; h++) horasParaCriar.push(h);
    }
    
    const colunaHora = tecnicoDiv.querySelector('.hora');
    if (colunaHora) {
        colunaHora.innerHTML = '';
        horasParaCriar.sort((a, b) => a - b).forEach(h => {
            const divHora = document.createElement("div");
            divHora.classList.add("square");
            divHora.setAttribute("h", h);
            divHora.textContent = `${h.toString().padStart(2, '0')}h00`;
            colunaHora.appendChild(divHora);
        });
    }
    divs.forEach(div => {
        ausNoDia = [];
        horaNoDia = [];
        div.classList.remove("ferias", "ausente", "es", "horaatividade");
        div.innerHTML = "";
        const atbData = div.getAttribute("data");
        horasParaCriar.forEach(h => {
            const div2 = document.createElement("div");
            div2.classList.add("square");
            div2.setAttribute("h", h);
            div.appendChild(div2);
        });
        
        ausTec.forEach(f => {
            if (f.split(" - ")[1] === atbData) {
                ausNoDia.push(f);
            }
        });
        horaTec.forEach(f => {
            if (f.split(" - ")[0] === atbData) {
                horaNoDia.push(f);
            }
        });

        if(feriasTec.includes(atbData)){
            horasNaTela.push({rotulo:'Férias', 
                    data:atbData});
            div.classList.add("ferias");
            div.textContent="Férias";
        }
        let agendamentosDoDia = [];
        lista.forEach(calendario => {
            if (Array.isArray(calendario.agendamentos)) {
                calendario.agendamentos.forEach(agendamento => {
                    const tecAgenda = agendamento.tecnico;
                    const idTecAgenda = tecAgenda.split(" - ")[0];
                    if (agendamento.data === atbData && tecnicoFiltro === idTecAgenda) {
                        agendamentosDoDia.push(agendamento);
                        agendaNaTela.push(agendamento);
                    }
                });
            }
        });
        agendamentosDoDia.sort((a, b) => emMinutos(a.horarioInicio) - emMinutos(b.horarioInicio));
        agendamentosDoDia.forEach(agendamento => {
            const cor = listaCores[0];
            const turma = agendamento.turma.split(" - ")[1];
            const horaInicio = parseInt(agendamento.horarioInicio.split(":")[0]);
            const minInicio = parseInt(agendamento.horarioInicio.split(":")[1]);
            const horaFim = parseInt(agendamento.horarioFim.split(":")[0]);
            const minFim = parseInt(agendamento.horarioFim.split(":")[1]);
            let hInicioCalculado = horaInicio;
            if (minInicio > 30) {
                hInicioCalculado = horaInicio + 1;
            }
            let hFim = horaFim;
            if (minFim < 30) {
                hFim = horaFim - 1;
            }
            let blocos = hFim - hInicioCalculado + 1;
            if (blocos < 1) {
                blocos = 1;
            }
            for (let i = 0; i < blocos; i++) {
                var h = hInicioCalculado + i;
                const bloco = div.querySelector(`div.square[h="${h}"]`);
                if (bloco) {
                    bloco.classList.add(cor);
                    if (i === 0) {
                        bloco.innerHTML = `Turma ${turma}<br>${agendamento.horarioInicio} - ${agendamento.horarioFim}`;
                    }
                }
            }
        });
        ausNoDia.forEach(ause => {
            horasNaTela.push({
                rotulo: ause.split(" - ")[0],
                data: ause.split(" - ")[1],
                horaInicio: ause.split(" - ")[2],
                horaFim: ause.split(" - ")[3]
            });
            const cor = listaCores[3];

            const horaInicio = parseInt(ause.split(" - ")[2].split(":")[0]);
            const minInicio = parseInt(ause.split(" - ")[2].split(":")[1]);
            const horaFim = parseInt(ause.split(" - ")[3].split(":")[0]);
            const minFim = parseInt(ause.split(" - ")[3].split(":")[1]);

            let hInicioCalculado = horaInicio;
            if (minInicio > 30) {
                hInicioCalculado = horaInicio + 1;
            }

            let hFim = horaFim;
            if (minFim < 30) {
                hFim = horaFim - 1;
            }

            let blocos = hFim - hInicioCalculado + 1;
            if (blocos < 1) {
                blocos = 1;
            }

            div.classList.add("ausente");
            for (let i = 0; i < blocos; i++) {
                var h = hInicioCalculado + i;
                const bloco = div.querySelector(`div.square[h="${h}"]`);
                if (bloco) {
                    bloco.classList.add(cor);
                    if (i === 0) {
                        bloco.innerHTML = `${ause.split(" - ")[0]}<br>${ause.split(" - ")[2]} - ${ause.split(" - ")[3]}`;
                    }
                }
            }
        });
        horaNoDia.forEach(horati => {
            horasNaTela.push({
                rotulo: 'Hora-atividade',
                data: horati.split(" - ")[0],
                horaInicio: horati.split(" - ")[1],
                horaFim: horati.split(" - ")[2]
            });
            const cor = listaCores[5];

            const horaInicio = parseInt(horati.split(" - ")[1].split(":")[0]);
            const minInicio = parseInt(horati.split(" - ")[1].split(":")[1]);
            const horaFim = parseInt(horati.split(" - ")[2].split(":")[0]);
            const minFim = parseInt(horati.split(" - ")[2].split(":")[1]);

            let hInicioCalculado = horaInicio;
            if (minInicio > 30) {
                hInicioCalculado = horaInicio + 1;
            }

            let hFim = horaFim;
            if (minFim < 30) {
                hFim = horaFim - 1;
            }

            let blocos = hFim - hInicioCalculado + 1;
            if (blocos < 1) {
                blocos = 1;
            }

            div.classList.add("horaatividade");
            for (let i = 0; i < blocos; i++) {
                var h = hInicioCalculado + i;
                const bloco = div.querySelector(`div.square[h="${h}"]`);
                if (bloco) {
                    bloco.classList.add(cor);
                    if (i === 0) {
                        bloco.innerHTML = `Hora-atividade<br>${horati.split(" - ")[1]} - ${horati.split(" - ")[2]}`;
                    }
                }
            }
        });  
    });
    const elemento = document.getElementById('tecnicoFiltro');
    verificarScroll(elemento);
    if(horasNaTela.length===0 && agendaNaTela.length===0){
        tecnicoDiv.style.display='none';
    }else{
        tecnicoDiv.style.display='grid';
    }
    sessionStorage.setItem('calendarioSemanal', JSON.stringify(agendaNaTela));
    sessionStorage.setItem('horaNaTela', JSON.stringify(horasNaTela)); 
}

function carregaTurma(geral, turmaDiv, tecnicoDiv, selectTecnicos, selectArea, selectTurmas, lista){
    let agendaNaTela = [];
    csvButton.style.display = 'flex';
    pdfButton.style.display = 'none';
    botaoMensal.removeAttribute("disabled");
    botaoMensal.style.opacity = "1";
    selectTecnicos.setAttribute("disabled", "disabled");
    selectArea.setAttribute("disabled", "disabled");
    geral.style.display="none";
    turmaDiv.style.display="grid";
    tecnicoDiv.style.display="none";
    const divHorarios = document.getElementById('horarios');
    divHorarios.style.display='flex';
    const divs = turmaDiv.querySelectorAll("#turma-um, #turma-dois, #turma-tres, #turma-quatro, #turma-cinco"); 
    const turmaFiltro = selectTurmas.value;
    const periodosAtivos = {manha: false, tarde: false, noite: false};

    divs.forEach(div => {
        const atbData = div.getAttribute("data");
        let agendamentosDoDia = [];
        
        lista.forEach(calendario => {
            if (Array.isArray(calendario.agendamentos)) {
                calendario.agendamentos.forEach(async agendamento => {
                    const turmaAgenda = agendamento.turma;
                    const idturmaAgenda = turmaAgenda.split(" - ")[0];
                    if (agendamento.data === atbData && idturmaAgenda === turmaFiltro) {
                        agendamentosDoDia.push(agendamento);
                        agendaNaTela.push(agendamento);
                    }
                });
            }
        });
        const todosInicios = [
            ...agendamentosDoDia.map(a => emMinutos(a.horarioInicio))
        ];
        const temManha = todosInicios.some(min => min >= emMinutos("07:00") && min < emMinutos("12:00"));
        const temTarde = todosInicios.some(min => min >= emMinutos("12:00") && min < emMinutos("18:00"));
        const temNoite = todosInicios.some(min => min >= emMinutos("18:00") && min < emMinutos("23:00"));

        if (temManha) periodosAtivos.manha = true;
        if (temTarde) periodosAtivos.tarde = true;
        if (temNoite) periodosAtivos.noite = true;
    });

    const horasParaCriar = [];
    if (periodosAtivos.manha) {
        for (let h = 7; h < 12; h++) horasParaCriar.push(h);
    }
    if (periodosAtivos.tarde) {
        for (let h = 12; h < 18; h++) horasParaCriar.push(h);
    }
    if (periodosAtivos.noite) {
        for (let h = 18; h < 23; h++) horasParaCriar.push(h);
    }
    
    const colunaHora = turmaDiv.querySelector('.hora');
    if (colunaHora) {
        colunaHora.innerHTML = '';
        horasParaCriar.sort((a, b) => a - b).forEach(h => {
            const divHora = document.createElement("div");
            divHora.classList.add("square");
            divHora.setAttribute("h", h);
            divHora.textContent = `${h.toString().padStart(2, '0')}h00`;
            colunaHora.appendChild(divHora);
        });
    }

    divs.forEach(async div => {
        div.innerHTML = "";
        horasParaCriar.forEach(h => {
            const div2 = document.createElement("div");
            div2.classList.add("square");
            div2.setAttribute("h", h);
            div.appendChild(div2);
        });
        
        const atbData = div.getAttribute("data");
        let agendamentosDoDia = [];
        lista.forEach(calendario => {
            if (Array.isArray(calendario.agendamentos)) {
                calendario.agendamentos.forEach(async agendamento => {
                    const turmaAgenda = agendamento.turma;
                    const idturmaAgenda = turmaAgenda.split(" - ")[0];
                    if (agendamento.data === atbData && idturmaAgenda === turmaFiltro) {
                        agendamentosDoDia.push(agendamento);
                        agendaNaTela.push(agendamento);
                    }
                });
            }
        });
        agendamentosDoDia.sort((a, b) => emMinutos(a.horarioInicio) - emMinutos(b.horarioInicio));
        agendamentosDoDia.forEach(async agendamento => {
            const cor = listaCores[0];
            const nome = agendamento.tecnico.split(" - ")[1];

            const inicioMin = emMinutos(agendamento.horarioInicio);
            const fimMin = emMinutos(agendamento.horarioFim);

            const duracaoMin = fimMin - inicioMin;
            let blocos = Math.floor(duracaoMin / 60);
            if (duracaoMin % 60 > 30) {
                blocos += 1;
            }

            const horaInicio = parseInt(agendamento.horarioInicio.split(":")[0]);
            const minInicio = parseInt(agendamento.horarioInicio.split(":")[1]);
            
            for (let i = 0; i < blocos; i++) {
                var h=0;
                if(minInicio>30){
                    h = horaInicio + i +1;
                }else{
                    h = horaInicio + i;
                }
                const bloco = div.querySelector(`div.square[h="${h}"]`);
                if (bloco) {
                    bloco.classList.add(cor);
                    if (i === 0) {
                        const novoNome = nome.split(" ");
                        const primeiro = novoNome[0];
                        const ultimo = novoNome[novoNome.length - 1];
                        bloco.innerHTML = `<b id="nome_tec">${primeiro} ${ultimo}</b><br>${agendamento.horarioInicio} - ${agendamento.horarioFim}`;
                    }
                }
            }
        });
    });
    const elemento = document.getElementById('turmaFiltro');
    verificarScroll(elemento);
    sessionStorage.setItem('calendarioSemanal', JSON.stringify(agendaNaTela));
}

function carregaArea(geral, turmaDiv, tecnicoDiv, selectTecnicos, selectArea, selectTurmas, lista){
    let agendaNaTela = [];
    const divHorarios = document.getElementById('horarios');
    divHorarios.style.display='none';
    sessionStorage.setItem('horaNaTela', JSON.stringify(''));
    csvButton.style.display = 'flex';
    pdfButton.style.display = 'none';
    botaoMensal.setAttribute("disabled", "disabled");
    botaoMensal.style.opacity = "0.5"; 
    selectTurmas.setAttribute("disabled","disabled");
    selectTecnicos.setAttribute("disabled","disabled");
    selectArea.removeAttribute("disabled");
    geral.style.display="grid";
    turmaDiv.style.display="none";
    tecnicoDiv.style.display="none";
    
    const areaFiltro = selectArea.value;
    const infosTecs=JSON.parse(sessionStorage.getItem('resultadosTecnicoEnsinos'));
    const mapAreaInfo = infosTecs.filter(info =>{
        return info.area===areaFiltro;
    });
    
    let ids = [];
    mapAreaInfo.forEach(tec => ids.push(tec._id));
    const divs = geral.querySelectorAll("div");    
    divs.forEach(div => {
        div.innerHTML = "";
        const atbData = div.getAttribute("data");
        let agendamentosDoDia = [];
        lista.forEach(calendario => {
            if (Array.isArray(calendario.agendamentos)) {
                calendario.agendamentos.forEach(agendamento => {
                    let tec = agendamento.tecnico.split(" - ");
                    if (agendamento.data === atbData && ids.includes(tec[0])) {
                        agendamentosDoDia.push(agendamento);
                        agendaNaTela.push(agendamento);
                    }
                });
            }
        });
        agendamentosDoDia.sort((a, b) => emMinutos(a.horarioInicio) - emMinutos(b.horarioInicio));
        agendamentosDoDia.forEach(agendamento => {
            if (!coresTecnicos[agendamento.tecnico]) {
                corIndex = corIndex >= listaCores.length ? 0 : corIndex;
                coresTecnicos[agendamento.tecnico] = listaCores[corIndex];
                corIndex++;
            }
            const cor = coresTecnicos[agendamento.tecnico];
            div.innerHTML += `<div class='square ${cor}'></div>`;
            const newdiv = div.lastElementChild;
            const nome = agendamento.tecnico.split(" - ");
            const turma = agendamento.turma.split(" - ");
            const novoNome = nome[1].split(" ");
            const primeiro = novoNome[0];
            const ultimo = novoNome[novoNome.length - 1];
            newdiv.innerHTML = `<b id="nome_tec">${primeiro} ${ultimo}</b> <br> Turma ${turma[1]} <br> ${agendamento.horarioInicio} ${agendamento.horarioFim}`;
        });
    });
    const elemento = document.getElementById('geral');
    verificarScroll(elemento);
    sessionStorage.setItem('calendarioSemanal', JSON.stringify(agendaNaTela));
}

function registrarFiltros() {
    const selects = [
        document.querySelector("#tecnicoEnsino"),
        document.querySelector("#turma"),
        document.querySelector("#area")
    ];

    selects.forEach(select => {
        select.addEventListener("change", async () => {
            await carregarAgendamentosBD();
            coletaAgendamentos();
        });
    });
}

function verificarScroll(elemento) {
    const temScroll = elemento.scrollHeight > elemento.clientHeight;
    if (!temScroll) {
        elemento.classList.add('sem-scroll');
    } else {
        elemento.classList.remove('sem-scroll');
    }
}

function coletaAgendamentos(){
    const selectTurmas = document.querySelector("#turma");
    const selectTecnicos = document.querySelector("#tecnicoEnsino");
    const calendarioTotal = window.listaCalendario;
    if(selectTecnicos.value!=='selecione'){
        const novoArray = calendarioTotal.filter(agenda => {
            return agenda.agendamentos[0].tecnico.split(" - ")[0] === selectTecnicos.value;
        });
        preencheCalendarioMensalTecnico(novoArray);
    } else if(selectTurmas.value!=='selecione'){
        const novoArray = calendarioTotal.filter(agenda => {
            return agenda.agendamentos[0].turma.split(" - ")[0] === selectTurmas.value;
        });
        preencheCalendarioMensalTurma(novoArray);
    }
}

function preencheCalendarioMensalTecnico(agendamentos) {
    const legenda = document.getElementById('legenda-periodos');
    legenda.innerHTML = "";
    const blocoGeral = document.querySelector(".bloco-geral");
    const blocoPeriodos = document.querySelector(".bloco-periodos");
    blocoPeriodos.style.display = 'flex';
    blocoGeral.style.display = 'none';

    const tabelas = {
        manha: document.getElementById("vis-mes-manha"),
        tarde: document.getElementById("vis-mes-tarde"),
        noite: document.getElementById("vis-mes-noite")
    };
    const periodos = {
        manha: { nome: "manha", inicio: 7, fim: 12 },
        tarde: { nome: "tarde", inicio: 13, fim: 18 },
        noite: { nome: "noite", inicio: 19, fim: 23 }
    };

    const tdsManha = tabelas.manha.querySelectorAll("td");
    const dataTdArray = Array.from(tdsManha)
        .map(td => td.getAttribute("datatd"))
        .filter(value => value !== null);
    const novoArray = agendamentos.map(agenda => agenda.agendamentos).flat();
    
    const agendaMes = novoArray.filter(agenda => dataTdArray.includes(agenda.data)).map(agenda => {
        const hora = parseInt(agenda.horarioInicio.split(":")[0]);
        let periodoNome = "";
        if (hora >= periodos.manha.inicio && hora < periodos.manha.fim) {
            periodoNome = "manha";
        } else if (hora >= periodos.tarde.inicio && hora < periodos.tarde.fim) {
            periodoNome = "tarde";
        } else if (hora >= periodos.noite.inicio && hora < periodos.noite.fim) {
            periodoNome = "noite";
        }
        return { ...agenda, periodoNome };
    });

    sessionStorage.setItem('calendarioMensal', JSON.stringify(agendaMes));

    const ucsPorDiaEPeriodo = {};
    const gruposMultiUc = new Map();
    let grupoIdCounter = 0;
    const ucsQueAparecemSozinhas = new Set();

    agendaMes.forEach(agenda => {
        const chaveDiaEPeriodo = `${agenda.data}-${agenda.periodoNome}-${agenda.turma}`;
        if (!ucsPorDiaEPeriodo[chaveDiaEPeriodo]) {
            ucsPorDiaEPeriodo[chaveDiaEPeriodo] = new Set();
        }
        ucsPorDiaEPeriodo[chaveDiaEPeriodo].add(agenda.uc);
    });

    agendaMes.forEach(agenda => {
        const chaveDiaEPeriodo = `${agenda.data}-${agenda.periodoNome}-${agenda.turma}`;
        const conjuntoUcs = Array.from(ucsPorDiaEPeriodo[chaveDiaEPeriodo]).sort();
        const chaveCor = `${agenda.uc}-${agenda.turma}`;
        
        if (!coresTecnicos[chaveCor]) {
            corIndex = corIndex >= listaCoresCalendario.length ? 0 : corIndex;
            coresTecnicos[chaveCor] = listaCoresCalendario[corIndex];
            corIndex++;
        }
        
        if (conjuntoUcs.length > 1) {
            const chaveGrupo = conjuntoUcs.join('|') + `-${agenda.turma}`; 
            if (!gruposMultiUc.has(chaveGrupo)) {
                gruposMultiUc.set(chaveGrupo, `GRUPO_UC_${grupoIdCounter++}`);
            }
            const grupoId = gruposMultiUc.get(chaveGrupo);
            if (!coresTecnicos[grupoId]) {
                corIndex = corIndex >= listaCoresCalendario.length ? 0 : corIndex;
                coresTecnicos[grupoId] = listaCoresCalendario[corIndex];
                corIndex++;
            }
        } else {
            ucsQueAparecemSozinhas.add(chaveCor);
        }
    });

    const agendaComGrupoCor = agendaMes.map(agenda => {
        const chaveDiaEPeriodo = `${agenda.data}-${agenda.periodoNome}-${agenda.turma}`;
        const conjuntoUcs = Array.from(ucsPorDiaEPeriodo[chaveDiaEPeriodo]).sort();
        let grupoCor;
        if (conjuntoUcs.length > 1) {
            const chaveGrupo = conjuntoUcs.join('|') + `-${agenda.turma}`;
            grupoCor = gruposMultiUc.get(chaveGrupo);
        } else {
            grupoCor = `${agenda.uc}-${agenda.turma}`;
        }
        return { ...agenda, grupoCor };
    });
    
    const legendasUnicas = new Set();

    const adicionarItemLegenda = (ucId, corClasse, turma) => {
        const ucNome = ucId.split(' - ')[1] || "Sem disciplina";
        const chaveUnica = `${ucId}-${corClasse}-${turma}`;
        if (legendasUnicas.has(chaveUnica)) return;
        const item = document.createElement("div");
        item.classList.add('item');
        const quadrado = document.createElement("div");
        quadrado.classList.add('legenda', corClasse);
        const texto = document.createElement("span");
        texto.innerHTML = `${ucNome.toLowerCase().split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')} - ${turma}`;
        item.appendChild(quadrado);
        item.appendChild(texto);
        legenda.appendChild(item);
        legendasUnicas.add(chaveUnica);
    };

    agendaComGrupoCor.forEach(agenda => {
        const chaveCor = `${agenda.uc}-${agenda.turma}`;
        const turma = agenda.turma.split(' - ') || "Sem turma";
        const ehGrupo = agenda.grupoCor.startsWith('GRUPO_UC_');
        if (ehGrupo) {
            const corGrupoClasse = coresTecnicos[agenda.grupoCor];
            const corBaseClasse = coresTecnicos[chaveCor];
            if (corGrupoClasse !== corBaseClasse) {
                adicionarItemLegenda(agenda.uc, corGrupoClasse, turma.slice(1).join(' - '));
            }
        }
        if (ucsQueAparecemSozinhas.has(chaveCor)) {
            const corBaseClasse = coresTecnicos[chaveCor];
            adicionarItemLegenda(agenda.uc, corBaseClasse, turma.slice(1).join(' - '));
        }
    });

    Object.entries(tabelas).forEach(([periodoNome, tabela]) => {
        tabela.querySelectorAll("td").forEach(td => td.classList.remove(...listaCoresCalendario));
        tabela.querySelectorAll("td").forEach(td => {
            const dataTd = td.getAttribute("datatd");
            if (!dataTd) return;
            const agendasDoDiaEPeriodo = agendaComGrupoCor.filter(a => a.data === dataTd && a.periodoNome === periodoNome);
            if (agendasDoDiaEPeriodo.length > 0) {
                const grupoCor = agendasDoDiaEPeriodo[0].grupoCor;
                const cor = coresTecnicos[grupoCor];
                if (cor) td.classList.add(cor);
            }
        });
    });
}

function preencheCalendarioMensalTurma(agendamentos){  
    const legenda = document.getElementById('legenda-geral');
    legenda.innerHTML = "";

    const table = document.getElementById('vis-mes-geral');
    const blocoGeral = document.querySelector(".bloco-geral");
    const blocoPeriodos = document.querySelector(".bloco-periodos");

    blocoPeriodos.style.display = 'none';
    blocoGeral.style.display = 'flex';

    const tds = table.querySelectorAll('td');

    const dataTdArray = Array.from(tds)
        .map(td => td.getAttribute('datatd'))
        .filter(value => value !== null);

    const novoArray = agendamentos.map(agenda => agenda.agendamentos).flat();
    const agendaMes = novoArray.filter(agenda => dataTdArray.includes(agenda.data));

    sessionStorage.setItem('calendarioMensal', JSON.stringify(agendaMes));

    const tecnicoUcPorDia = {};
    const gruposMultiTecnicoUc = new Map();
    let grupoIdCounter = 0;

    agendaMes.forEach(agenda => {
        const chaveTecnicoUc = `${agenda.tecnico.split(' - ')[1]} - ${agenda.uc.split(' - ')[1] || "Sem disciplina"}`;
        const data = agenda.data;

        if (!tecnicoUcPorDia[data]) {
            tecnicoUcPorDia[data] = new Set();
        }

        tecnicoUcPorDia[data].add(chaveTecnicoUc);
    });

    const agendaComGrupoCor = agendaMes.map(agenda => {
        const data = agenda.data;
        const conjuntoTecnicoUcs = Array.from(tecnicoUcPorDia[data]).sort();
        const chaveTecnicoUcUnica = `${agenda.tecnico.split(' - ')[0]} - ${agenda.uc.split(' - ')[0]}`;
        let grupoCor;

        if (conjuntoTecnicoUcs.length > 1) {
            const chaveGrupo = conjuntoTecnicoUcs.join('|');

            if (!gruposMultiTecnicoUc.has(chaveGrupo)) {
                gruposMultiTecnicoUc.set(chaveGrupo, `GRUPO_TURMA_${grupoIdCounter++}`);
            }

            grupoCor = gruposMultiTecnicoUc.get(chaveGrupo);
        } else {
            grupoCor = chaveTecnicoUcUnica;
        }

        return { ...agenda, grupoCor };
    });

    const legendaPorGrupo = new Map();

    agendaComGrupoCor.forEach(agenda => {
        const grupo = agenda.grupoCor;

        if (!coresTecnicos[grupo]) {
            corIndex = corIndex >= listaCoresCalendario.length ? 0 : corIndex;
            coresTecnicos[grupo] = listaCoresCalendario[corIndex];
            corIndex++;
        }

        if (!legendaPorGrupo.has(grupo)) {
            legendaPorGrupo.set(grupo, {
                cor: coresTecnicos[grupo],
                itens: new Set()
            });
        }

        const tecnico = agenda.tecnico.split(' - ')[1];
        const ucNome = agenda.uc.split(' - ')[1] || "Sem disciplina";

        legendaPorGrupo.get(grupo).itens.add(
            `${tecnico} - ${ucNome}`
        );
    });

    legenda.innerHTML = "";
    legendaPorGrupo.forEach((dadosGrupo) => {
        const item = document.createElement("div");
        item.classList.add("item");

        const quadrado = document.createElement("div");
        quadrado.classList.add("legenda", dadosGrupo.cor);

        const texto = document.createElement("span");
        texto.innerHTML = Array.from(dadosGrupo.itens)
            .map(texto =>
                texto
                    .toLowerCase()
                    .split(' ')
                    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
                    .join(' ')
            )
            .join("<br>");

        item.appendChild(quadrado);
        item.appendChild(texto);
        legenda.appendChild(item);
    });

    tds.forEach(td => {
        td.classList.remove(...listaCoresCalendario);

        const dataTd = td.getAttribute('datatd');
        if (!dataTd) return;

        const agendasDoDia = agendaComGrupoCor.filter(a => a.data === dataTd);

        if (agendasDoDia.length > 0) {
            const grupoCor = agendasDoDia[0].grupoCor;
            const cor = coresTecnicos[grupoCor];

            if (cor) {
                td.classList.add(cor);
            }
        }
    });
}


function escolhaCSV() {
    const escolhaDiv = document.getElementById('escolhaCSV');
    escolhaDiv.classList.toggle('showEscolha'); 
    const botaoCSV = document.querySelector('#csv');
    botaoCSV.classList.toggle('abertoCSV');
}

async function verificaUserLogado() {
    try {
        const response = await fetch('/conta/preencher', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Erro ao obter usuário');
        }
        const data = await response.json();
        sessionStorage.setItem('usuarioLogado', JSON.stringify(data.usuario.matricula));
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('click', function(event) {
    const escolhaDiv = document.getElementById('escolhaCSV');
    const botaoCSV = document.getElementById('csv');
    if (escolhaDiv.classList.contains('showEscolha')) {
        const isClickInsideMenu = escolhaDiv.contains(event.target);
        const isClickOnButton = botaoCSV.contains(event.target);
        if (!isClickInsideMenu && !isClickOnButton) {
            escolhaDiv.classList.remove('showEscolha');
            botaoCSV.classList.remove('abertoCSV');
        }
    }
});

function exportarCSV(chaveCalendario){
    const calendarioRaw = JSON.parse(sessionStorage.getItem(chaveCalendario));
    let csvContent = "Turma,UC,Técnico,Data,Horário de Início,Horário de Fim \n";
    calendarioRaw.forEach(agendamento =>{
        const nomeTecnico = agendamento.tecnico.split(" - ")[1];
        const nomeTurma = agendamento.turma.split(" - ")[1];
        const nomeUC = agendamento.uc.split(" - ")[1];
        const data = agendamento.data;
        const horaInicio = agendamento.horarioInicio;
        const horaFim = agendamento.horarioFim;
        const linha = [
            nomeTurma,
            nomeUC,
            nomeTecnico,
            data,
            horaInicio,
            horaFim
        ].join(",");
        csvContent += linha + "\n";
    });
    const bom = '\uFEFF';
    const blob = new Blob([bom+csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "agendamentos.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Em construção

async function exportarPDF(){
    /*
    const calendarioRaw = JSON.parse(sessionStorage.getItem('calendarioSemanal'));
    const horarios = JSON.parse(sessionStorage.getItem('horaNaTela'));
    console.log(calendarioRaw);
    console.log(horarios);
    let data = calendarioRaw;
    if(horarios.length>0){
        horarios.forEach(hr =>{
            data.push(hr);
        });
    }
    const mes = parseInt(mesSelecionado.value)+1;
    const ano = anoSelect.value;

    const response = await fetch('/gerar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `calendario_${data.mes}_${data.ano}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        } else {
        alert('Erro ao gerar PDF');
    }*/
     const calendarioRaw = JSON.parse(sessionStorage.getItem('calendarioSemanal')) || [];
  const horarios = JSON.parse(sessionStorage.getItem('horaNaTela')) || [];

  const response = await fetch('/gerar-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ calendarioRaw, horarios })
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendario.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  } else {
    alert('Erro ao gerar PDF.');
  }
}

limpar.addEventListener("click", async ()=>{
    const selectTurmas = document.querySelector("#turma");
    const selectTecnicos = document.querySelector("#tecnicoEnsino");
    const selectArea = document.querySelector("#area");
    selectTurmas.value="selecione";
    selectTecnicos.value="selecione";
    selectArea.value="selecione";
    selectTurmas.removeAttribute("disabled");
    selectTecnicos.removeAttribute("disabled");
    selectArea.removeAttribute("disabled");
    alternarCalendario('semanal');
    await carregarAgendamentosBD();
    coletaAgendamentos();
});

document.getElementById('infoicon-um').addEventListener('mouseover', () =>{
    const divInfoUm = document.getElementById('info-um');
    divInfoUm.removeAttribute('hidden');
});

document.getElementById('infoicon-um').addEventListener('mouseout', () =>{
    const divInfoUm = document.getElementById('info-um');
    divInfoUm.setAttribute('hidden','hidden');
});

document.getElementById('infoicon-dois').addEventListener('mouseover', () =>{
    const divInfoDois = document.getElementById('info-dois');
    divInfoDois.removeAttribute('hidden');
});

document.getElementById('infoicon-dois').addEventListener('mouseout', () =>{
    const divInfoDois = document.getElementById('info-dois');
    divInfoDois.setAttribute('hidden','hidden');
});


document.getElementById('prevWeek').addEventListener('click', async () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeek();
    await carregarAgendamentosBD();
    const mesCurrent = currentWeekStart.getMonth() + 1; 
    const anoCurrent = currentWeekStart.getFullYear();
    preencherTabelaMes(mesCurrent, anoCurrent); 
    tituloMes.textContent = currentWeekStart.toLocaleString("pt-BR", { month: "long" }).toUpperCase();
    coletaAgendamentos();
});

document.getElementById('nextWeek').addEventListener('click', async () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeek();
    await carregarAgendamentosBD();
    const mesCurrent = currentWeekStart.getMonth() + 1; 
    const anoCurrent = currentWeekStart.getFullYear();
    preencherTabelaMes(mesCurrent, anoCurrent); 
    tituloMes.textContent = currentWeekStart.toLocaleString("pt-BR", { month: "long" }).toUpperCase();
    coletaAgendamentos();
});

document.addEventListener('DOMContentLoaded', async ()=>{
    verificaUserLogado();
    preencherTabelaMes(mesAtual, anoAtual); 
    tituloMes.textContent = currentWeekStart.toLocaleString("pt-BR", { month: "long" }).toUpperCase();
    mesSelecionado.addEventListener('change', async function() {
        preencherTabelaMes(mesSelecionado.value, anoSelect.value); 
        currentWeekStart = primeiroDiaUtil(mesSelecionado.value, anoSelect.value);
        renderWeek();
        await carregarAgendamentosBD();
        tituloMes.textContent = currentWeekStart.toLocaleString("pt-BR", { month: "long" }).toUpperCase();
        coletaAgendamentos();
    });
    anoSelect.addEventListener('change', async function () {
        preencherTabelaMes(mesSelecionado.value, anoSelect.value); 
        currentWeekStart = primeiroDiaUtil(mesSelecionado.value, anoSelect.value);
        renderWeek();
        await carregarAgendamentosBD();
        tituloMes.textContent =currentWeekStart.toLocaleString("pt-BR", { month: "long" }).toUpperCase();
        coletaAgendamentos();
    });
    registrarFiltros();
    const responseAgendamentos = await fetch('/agendamentos/gerenciar');
    const agendamentos = await responseAgendamentos.json();
    sessionStorage.setItem('resultadosAgendamentos', JSON.stringify(agendamentos));
    const responseTurma = await fetch('/turmas/gerenciar');
    const turmas = await responseTurma.json();
    sessionStorage.setItem('resultadosTurmas', JSON.stringify(turmas));
    const responseCursos = await fetch('/cursos/gerenciar');
    const cursos = await responseCursos.json();
    cursos.sort((a, b) => a.nome.localeCompare(b.nome));
    sessionStorage.setItem('resultadosCursos', JSON.stringify(cursos));
    const responseTecnicos = await fetch('/tecnicos/gerenciar');
    const tecnicosEnsinos = await responseTecnicos.json();
    sessionStorage.setItem('resultadosTecnicoEnsinos', JSON.stringify(tecnicosEnsinos));
    const tecnicosAtivos = tecnicosEnsinos.filter(tecnico => tecnico.status !== "Inativo");
    turmas.sort((a, b) => a.nome.localeCompare(b.nome));
    tecnicosAtivos.sort((a, b) => a.nome.localeCompare(b.nome));
    tecnicosAtivos.forEach(tecnicoEnsino =>{
            const option = document.createElement("option");
            option.value = `${tecnicoEnsino._id}`;
            option.textContent = `${tecnicoEnsino.nome}`;
            selectTecnicos.appendChild(option);
    });
    turmas.forEach(turma =>{
        if (turma.status === "Concluído" || turma.status === "Cancelado") return;
        const mapCurso = cursos.filter(curso =>{
            return curso._id===turma.curso;
        });
        const option = document.createElement("option");
        option.value = `${turma._id}`;
        option.textContent = `${turma.nome} - ${mapCurso[0].nome} - MÓDULO: ${turma.modulo}`;
        selectTurmas.appendChild(option);
    });
    renderWeek();
    await carregarAgendamentosBD();
    alternarCalendario('semanal');
    botaoMensal.addEventListener('click', () => alternarCalendario('mensal'));
    botaoSemanal.addEventListener('click', () => alternarCalendario('semanal'));
    document.querySelector(".dot-spinner").style.display = "none"; 
    document.querySelector(".corpo-frame").style.display = "block"; 
    const geral = document.querySelector("#geral");
    verificarScroll(geral);
});



