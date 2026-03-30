const weekLabel = document.getElementById('weekLabel');
const eventsElement = document.getElementById('events');
const agendaMensal = document.getElementById("agenda-mensal");
const agendaSemanal = document.getElementById("agenda-semanal");
const controleSemanal = document.querySelector('#controle-semanal');
const controleMensal = document.querySelector('#controle-mensal');
const mesSelecionado = document.querySelector('#mesSelect');
const anoSelect = document.getElementById('anoSelect');
const anoAtual = new Date().getFullYear();
const mesAtual = new Date().getMonth();
const semanalCalendar = document.querySelector('#semanal');
const mensalCalendar = document.querySelector('#mensal');
const userAtual = window.userAtual;

let currentDate = new Date();
let currentWeekStart = getStartOfWeek(currentDate);

var horariosES = [];
var horariosIntervalos = [];
var horariosSobrando = '';
var horariosEntrada = '';
var horariosSaida = '';
var tecnicoEdicao='';
var tecnicoAtual = {};
var cargaAtualRestante = 0;
var ausenciasTec; 
var datasTurma;
var minutosAdc = 0;
var ultimaDataAgendada = "";

window.totalMinutosDoDia = window.totalMinutosDoDia || [];

for (let i = anoAtual - 5; i <= anoAtual + 5; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    if (i === anoAtual) option.selected = true;
    anoSelect.appendChild(option);
}

agendaMensal.addEventListener('click', () => alternarCalendario('mensal'));
agendaSemanal.addEventListener('click', () => alternarCalendario('semanal'));

mesSelecionado.addEventListener('change', () => preencherTabelaMes(mesSelecionado.value, anoSelect.value));
anoSelect.addEventListener('change', () => preencherTabelaMes(mesSelecionado.value, anoSelect.value));


document.querySelector("#horario").addEventListener("click", (e) => {
    const disponivel = e.target.closest(".open");
    if (!disponivel) return;

    const horario = parseInt(disponivel.getAttribute("horario").split(":"), 10);
    const dia = [...disponivel.classList].find(cls =>
        ["segunda", "terca", "quarta", "quinta", "sexta"].includes(cls)
    );
    const dataStr = disponivel.getAttribute("data");
    const dataDate = new Date(dataStr.split('/').reverse().join('-'));
    dataDate.setHours(dataDate.getHours() + 3);

    janelaAgendamento(disponivel.className, dia, dataStr, dataDate, String(horario).padStart(2, '0'));
});

document.getElementById('prevWeek').addEventListener('click', async () => {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  await atualizarSemana();
});

document.getElementById('nextWeek').addEventListener('click', async () => {
  currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  await atualizarSemana();
});

document.addEventListener('editarTec', () =>{
    renderWeek();
    tecnicoEdicao = document.querySelector("#tecnicoEnsino"); 
    carregaHorariosPrevios(tecnicoEdicao.value, 1);
    datasTurma = JSON.parse(localStorage.getItem('turmaAgendamento'));
});

document.addEventListener('novoTec', () =>{
    tecnicoEdicao='';
    renderWeek();
    carregaHorariosPrevios(tecnicoEdicao, 2);
});

async function atualizarSemana() {
    renderWeek();
    await limitaPeriodoTurma();
    await disponibilizaHorarios(tecnicoAtual);
    await disponibilizaAusencias(tecnicoAtual);
    await preencheHorariosAnteriores();
    await preencheHorariosNovos();
}

function emMinutos(horaString){
    const [hora, minuto] = horaString.split(':').map(Number);
    return hora * 60 + minuto;
}

function diaDaSemanaParaString(dia) {
    const dias = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sábado"];
    return dias[dia];
}

function parseDataBR(dataStr) {
    const [dia, mes, ano] = dataStr.split('/');
    return new Date(`${ano}-${mes}-${dia}T00:00:00`);
}

function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day; 
    return new Date(date.setDate(date.getDate() + diff));
}

function renderWeek() {
    const weekDays = Array.from({ length: 5 }, (_, i) => {
        const day = new Date(currentWeekStart);
        day.setDate(currentWeekStart.getDate() + i);
        return day;
        
    });

    const dayNames = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
    dayNames.forEach((dayName, index) => {
        document.getElementById(dayName).innerHTML = `${capitalize(dayName)} <br> ${weekDays[index].toLocaleDateString()}`;
    });

    const tds = document.querySelectorAll("td");
    tds.forEach(td => {
        const dayIndex = dayNames.findIndex(day => td.classList.contains(day));
        if (dayIndex !== -1) {
            td.setAttribute("data", weekDays[dayIndex].toLocaleDateString());
        }
    });

    weekLabel.innerText = `${weekDays[0].toLocaleDateString()} a ${weekDays[4].toLocaleDateString()}`;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDiaSemanaString(diaSemana) {
    const dias = { '2': 'segunda', '3': 'terca', '4': 'quarta', '5': 'quinta', '6': 'sexta' };
    return dias[diaSemana] || '';
}

function hideCalendars(...elements) {
    elements.forEach(element => element.style.display = 'none');
}

function removeIndiceExluido(agendado){
    let valoresAgendado=Object.values(agendado);
    valoresAgendado.splice(9,1)
    window.listaAgendaTurma = window.listaAgendaTurma.filter(item => {
        let valoresItem = Object.values(item);
        valoresItem.splice(9, 1);
        return JSON.stringify(valoresAgendado) !== JSON.stringify(valoresItem);
    });
}

function fecharJanela() {
    const janela = document.getElementById('janelaAgendamento');
    const corpo=document.querySelector('.corpo-frame');
    corpo.classList.remove("blur");
    janela.hidden = true;
    janela.innerHTML = ''; 
}

function alternarCalendario(tipo) {
  const config = {
    semanal: () => {
      semanalCalendar.style.display = 'flex';
      mensalCalendar.style.display = 'none';
      agendaSemanal.style.color = 'var(--cor-base)';
      agendaSemanal.style.backgroundColor = 'var(--cor-primaria)';
      agendaMensal.style.color = 'var(--cor-primaria)';
      agendaMensal.style.backgroundColor = 'var(--cor-base)';
      controleMensal.style.display = 'none';
      controleSemanal.style.display = 'flex';
    },
    mensal: () => {
      semanalCalendar.style.display = 'none';
      mensalCalendar.style.display = 'flex';
      agendaMensal.style.color = 'var(--cor-base)';
      agendaMensal.style.backgroundColor = 'var(--cor-primaria)';
      agendaSemanal.style.color = 'var(--cor-primaria)';
      agendaSemanal.style.backgroundColor = 'var(--cor-base)';
      controleMensal.style.display = 'flex';
      controleSemanal.style.display = 'none';
      preencherTabelaMes(mesAtual, anoAtual);
    }
  };
  config[tipo]();
}

function preencherTabelaMes(mes, ano) {
    mesSelecionado.value=mes;
    const tabela = document.getElementById("mes").getElementsByTagName("tbody")[0];
    [...tabela.rows].forEach(row => [...row.cells].forEach(cell => {
        cell.textContent = "";
        cell.removeAttribute("dia");
        cell.removeAttribute("datatd");
        cell.removeAttribute("ferias");
        cell.removeAttribute("ocupado");
        cell.removeAttribute("livre");
        cell.classList.remove("limite", "open");
    }));
    let dia = 1;
    let semana = 0;
    while (true) {
        const data = new Date(ano, mes, dia);
        if (data.getMonth() !== parseInt(mes)) break;
        const diaSemana = data.getDay();
        if (diaSemana >= 1 && diaSemana <= 5) {
            const linha = tabela.rows[semana];
            const coluna = diaSemana - 1;
            if (linha && linha.cells[coluna]) {
                linha.cells[coluna].textContent = dia;
                linha.cells[coluna].setAttribute("dia", true);
                const diaFormatado = String(dia).padStart(2, '0');
                const mesFormatado = String(parseInt(mes) + 1).padStart(2, '0');
                const dataFormatada = `${diaFormatado}/${mesFormatado}/${ano}`;
                linha.cells[coluna].setAttribute("datatd", dataFormatada);
                const datasArray = window.listaFerias;
                if (datasArray.includes(dataFormatada)) {
                    linha.cells[coluna].setAttribute('ferias', true);
                }
            }
            if (diaSemana === 5) {
                semana++;
            }
        }
        dia++;
    }
    if (typeof datasTurma !== 'undefined') {
        const datas = datasTurma.split(' - ');
        const inicialDate = new Date(datas[0]);
        const finalDate = new Date(datas[1]);
        inicialDate.setHours(inicialDate.getHours() + 3);
        finalDate.setHours(finalDate.getHours() + 3);

        const todasTds = tabela.querySelectorAll("td[dia]");
        todasTds.forEach(td => {
            const atbData = td.getAttribute("datatd").split('/');
            const atbDataDate = new Date(atbData[2], atbData[1] - 1, atbData[0]);
            if (atbDataDate < inicialDate || atbDataDate > finalDate) {
                td.classList.add('limite');
                td.classList.remove('open');
            } else {
                td.classList.add('open');
            }
        });
    }
    preencherDiasMes();
}

async function preencherDiasMes(){
    const horariosTecnico = [
    ...(window.listaHorarios || []),
    ...(window.listaHorariosNovos || [])
    ];
    const datasUnicas = [...new Set(horariosTecnico.map(ht => ht.data))];
    const tabela = document.getElementById("mes").getElementsByTagName("tbody")[0];
    const tds = tabela.querySelectorAll("td.open[datatd]");
    for (let td of tds) {
        td.removeAttribute("ocupado");
        td.removeAttribute("livre");
        const dataTd = td.getAttribute("datatd");
        if (dataTd) {
            td.setAttribute(datasUnicas.includes(dataTd) ? "ocupado" : "livre", true);
        }
    }
    document.getElementById("mes").addEventListener("click", async (event) => {
        const td = event.target.closest("td");
        if (td && td.hasAttribute("dia")) {
        alternarCalendario('semanal');
        const dataClicada = td.getAttribute("datatd");
        const [d, m, y] = dataClicada.split("/").map(Number);
        const dataF = new Date(y, m - 1, d);
        const diff = dataF.getDay() === 0 ? -6 : 1 - dataF.getDay();
        const inicioSemana = new Date(dataF);
        inicioSemana.setDate(dataF.getDate() + diff);
        currentWeekStart = inicioSemana;
        await atualizarSemana();
        }
    });
}



async function disponibilizaHorarios(tecnico){
    const tabelaOpen = document.querySelectorAll("#horario td.open");
    horariosES = [];
    horariosIntervalos = [];
    const botoesCalendar = document.querySelector('#botoesCalendar');

    if (tecnico) {
        const horariosTec = tecnico.horarios;
        botoesCalendar.style.display = 'flex';
        semanalCalendar.style.display = 'flex';
        mensalCalendar.style.display = 'none';
        controleMensal.style.display = 'none';
        if (horariosTec && horariosTec.length>0 && tecnico.tipoContratacao === "Mensalista - Horário fixo") {

            const diasSemanaEsperados = ["2", "3", "4", "5", "6"];
            const diasPresentes = horariosTec.map(h => h.diaSemana);
            const diasFaltantes = diasSemanaEsperados.filter(dia => !diasPresentes.includes(dia));
            horariosTec.forEach(horarioTrabalho => {
                
                const diaSemanaString = getDiaSemanaString(horarioTrabalho.diaSemana);
                const horariosEntradaSaida = [diaSemanaString,
                    horarioTrabalho.horarioInicial,
                    horarioTrabalho.horarioFinal
                ];
                const intervaloInicial = horarioTrabalho.intervaloInicial;
                const intervaloFim = horarioTrabalho.intervaloFim;
                const horariosInter = [diaSemanaString,
                    horarioTrabalho.intervaloInicial,
                    horarioTrabalho.intervaloFim
                ];
                horariosIntervalos.push(horariosInter);
                horariosES.push(horariosEntradaSaida);
                tabelaOpen.forEach(td => {
                    const atbHorario = td.getAttribute("horario");
                    const classeTd = td.classList.value;
                    diasFaltantes.forEach(diaFaltante => {
                        const diaFaltanteStr = getDiaSemanaString(diaFaltante);
                        if (classeTd.includes(diaFaltanteStr)) {
                            td.setAttribute("es", true);
                            td.classList.remove("open");
                        }
                    });
                    if (classeTd.includes(diaSemanaString) && 
                        (emMinutos(atbHorario) > emMinutos(horarioTrabalho.horarioFinal)
                        || emMinutos(atbHorario) < emMinutos(horarioTrabalho.horarioInicial))
                    ) {
                        td.classList.remove("open");
                        td.setAttribute("es",true);
                    }
                    if(classeTd.includes(diaSemanaString) && emMinutos(atbHorario) >= emMinutos(intervaloInicial) && emMinutos(atbHorario)<=(emMinutos(intervaloFim)-30)){
                        td.textContent="Intervalo";
                        td.setAttribute("intervalo",true);
                        td.classList.remove("open");
                    }
                });
            }); 
        } else if(tecnico.tipoContratacao !== "Mensalista - Horário fixo"){
            tabelaOpen.forEach(td => {
                td.style.pointerEvents = '';
                td.style.backgroundColor = '';
                td.classList.add("open");
            });
        } 
        else if (horariosTec.length===0 && tecnico.tipoContratacao === "Mensalista - Horário fixo") {
            hideCalendars(botoesCalendar, semanalCalendar, mensalCalendar);
            alert("Técnico mensalista sem horários cadastrados!");
        }
    }
}

async function disponibilizaAusencias(tecnico){
    const tabela = document.querySelectorAll("#horario td.open, #horario td[intervalo='true']");
    ausenciasTec = tecnico.ausencias;
    guardaDatasFerias(ausenciasTec);
    if(ausenciasTec){

    
    if(ausenciasTec.length>0){
        ausenciasTec.forEach(aus =>{
            tabela.forEach(td => {
                const dataAtb = td.getAttribute("data");
                const dataAtbFormatada=new Date(dataAtb.split('/').reverse().join('-'));
                dataAtbFormatada.setHours(dataAtbFormatada.getHours() + 3);
                const dataInicialFormatada=new Date(aus.dataInicial.split('/').reverse().join('-'));
                dataInicialFormatada.setHours(dataInicialFormatada.getHours() + 3);
                const dataFinalFormatada=new Date(aus.dataFinal.split('/').reverse().join('-'));
                dataFinalFormatada.setHours(dataFinalFormatada.getHours() + 3);
                if(dataAtbFormatada>=dataInicialFormatada && dataAtbFormatada<=dataFinalFormatada){
                    if(aus.rotulo==="Férias"){
                        td.textContent="Férias";
                        td.setAttribute("aus",true);
                        td.classList.add("ferias");   
                        td.classList.remove("open");
                        td.removeAttribute("intervalo");
                    } else if(aus.rotulo==="Hora-atividade" && !td.getAttribute("intervalo")){
                        const diaAtb = dataAtbFormatada.getDay();
                        const diaMarcadoSplit = aus.diasMarcados.split(" ");
                        const horaAtb = td.getAttribute("horario");
                        diaMarcadoSplit.forEach(dia =>{
                            if(diaDaSemanaParaString(diaAtb)===dia && emMinutos(horaAtb)>=emMinutos(aus.horaAusInicial) && emMinutos(horaAtb)<=emMinutos(aus.horaAusfinal) && td.getAttribute("aus")===null){
                                td.textContent="Hora-atividade";
                                td.setAttribute("aus",true);
                                td.classList.remove("open");
                                td.classList.add("hora");
                            }
                        });
                    } else if(aus.rotulo==="Ausência" && !td.getAttribute("intervalo")){
                        const horaAtb = td.getAttribute("horario");
                        if(emMinutos(horaAtb)>=emMinutos(aus.horaAusInicial) && emMinutos(horaAtb)<=emMinutos(aus.horaAusfinal) && td.getAttribute("aus")===null){
                            td.textContent="Ausente";
                            td.setAttribute("aus",true);
                            td.classList.remove("open");
                            td.classList.add("ausente");
                        }  
                    } else if(aus.rotulo==="Viagem" && !td.getAttribute("intervalo")){
                        const horaAtb = td.getAttribute("horario");
                        if(emMinutos(horaAtb)>=emMinutos(aus.horaAusInicial) && emMinutos(horaAtb)<=emMinutos(aus.horaAusfinal) && td.getAttribute("aus")===null){
                            td.textContent="Em viagem";
                            td.setAttribute("aus",true);
                            td.classList.remove("open");
                            td.classList.add("ausente");
                        }  
                    } else if(aus.rotulo==="Reunião" && !td.getAttribute("intervalo")){
                        const horaAtb = td.getAttribute("horario");
                        if(emMinutos(horaAtb)>=emMinutos(aus.horaAusInicial) && emMinutos(horaAtb)<=emMinutos(aus.horaAusfinal) && td.getAttribute("aus")===null){
                            td.textContent="Em reunião";
                            td.setAttribute("aus",true);
                            td.classList.remove("open");
                            td.classList.add("ausente");
                        }  
                    } else if(aus.rotulo==="Treinamento" && !td.getAttribute("intervalo")){
                        const horaAtb = td.getAttribute("horario");
                        if(emMinutos(horaAtb)>=emMinutos(aus.horaAusInicial) && emMinutos(horaAtb)<=emMinutos(aus.horaAusfinal) && td.getAttribute("aus")===null){
                            td.textContent="Em treinamento";
                            td.setAttribute("aus",true);
                            td.classList.remove("open");
                            td.classList.add("ausente");
                        }  
                    }

                }
            });
        });
    }
}
}

function guardaDatasFerias(ausenciasTec){
    window.listaFerias = [];
    window.listaFerias = window.listaFerias || [];           
    if (ausenciasTec) {
        ausenciasTec.forEach(ausencia =>{
            if(ausencia.rotulo==="Férias"){
                const atual = ausencia.dataInicial.split('/');
                const final = ausencia.dataFinal.split('/');
                const atualDate=new Date(atual[2], atual[1] - 1, atual[0]);;
                const finalDate=new Date(final[2], final[1] - 1, final[0]);;
                while (atualDate <= finalDate) {
                    const dataFormatada = atualDate.toLocaleDateString('pt-BR');
                    window.listaFerias.push(dataFormatada);
                    atualDate.setDate(atualDate.getDate() + 1);
                }
            }
        })
    }
}


function janelaAgendamento(classeInicial, dia, dataInicialString, dataInicialDate, horario) {
    const janela = document.getElementById('janelaAgendamento');
    const corpo=document.querySelector('.corpo-frame');
    corpo.classList.add("blur");
    const horaform = horario.toString().padStart(2, '0');
    let horariosJanela = ``;
    const horariosNormais = Array.from({ length: 12 }, (_, i) => i * 5)
    .map(m => `<option value="${horaform}:${String(m).padStart(2, '0')}">${horaform}:${String(m).padStart(2, '0')}</option>`)
    .join('\n');
    let horariosSobrando = '';
    function processaHorarios(listaHorarios) {
        listaHorarios.forEach(agendado => {
            if (agendado.data !== undefined) {
                let horarioFimSplit = agendado.horarioFim.split(":");
                const horaFimAgendamento = parseInt(horarioFimSplit[0], 10);
                const minutoFimAgendamento = parseInt(horarioFimSplit[1], 10);

                if (minutoFimAgendamento <= 55 && minutoFimAgendamento !== 0 && agendado.data === dataInicialString && horaFimAgendamento + 1 === parseInt(horario)) {
                    for (let m = 5; m < 60; m += 5) {
                        if (m >= minutoFimAgendamento) {
                            const minutoFormatado = m.toString().padStart(2, '0');
                            const horaFormatada = horaFimAgendamento.toString().padStart(2, '0');
                            horariosSobrando += `<option value="${horaFormatada}:${minutoFormatado}">${horaFormatada}:${minutoFormatado}</option>\n`;
                        }
                    }
                }
            }
        });
    }

    if (window.listaHorarios) {
        processaHorarios(window.listaHorarios);
    }

    if (window.listaHorariosNovos) {
        processaHorarios(window.listaHorariosNovos);
    }

    if (window.listaAgendaTurma) {
        processaHorarios(window.listaAgendaTurma);
    }
    
    horariosEntrada = '';
    horariosSaida = '';
    horariosES.forEach(horarioES =>{
        const entrada = horarioES[1].split(':');
        const saida = horarioES[2].split(':');
        if(dia===horarioES[0] && parseInt(horario)===parseInt(entrada[0])+1 && entrada[1]!=='00'){
            const minuto = parseInt(entrada[1]);
            for (let m = 5; m < 60; m += 5) {
                if (m >= minuto) {
                    const minutoFormatado = m.toString().padStart(2, '0');
                    const horaFormatada = entrada[0].toString().padStart(2, '0');
                    horariosEntrada += `<option value="${horaFormatada}:${minutoFormatado}">${entrada[0]}:${minutoFormatado}</option>\n`;
                }
            }
        }
        if(dia===horarioES[0] && parseInt(horario)===parseInt(saida[0])){
            const minutoSaida = parseInt(saida[1]);
            for (let m = 0; m <= minutoSaida; m += 5) {
                const minutoFormatado = m.toString().padStart(2, '0');
                const horaFormatada = saida[0].toString().padStart(2, '0');
                horariosSaida += `<option value="${horaFormatada}:${minutoFormatado}">${saida[0]}:${minutoFormatado}</option>\n`;
            }
        }
    });
    horariosIntervalos.forEach(horarioIntervalo => {
        const entrada = horarioIntervalo[1].split(':');
        const saida = horarioIntervalo[2].split(':');
        const horaEntrada = parseInt(entrada[0]);
        const minutoEntrada = parseInt(entrada[1]);
        const horaSaida = parseInt(saida[0]);
        const minutoSaida = parseInt(saida[1]);
        if (dia === horarioIntervalo[0] && parseInt(horario) === horaEntrada) {
            for (let m = 0; m <= minutoEntrada; m += 5) {
                const minutoFormatado = m.toString().padStart(2, '0');
                const horaFormatada = horaEntrada.toString().padStart(2, '0');
                const valor = `${horaFormatada}:${minutoFormatado}`;
                horariosSaida += `<option value="${valor}">${valor}</option>\n`;
            }
        }
        if (dia === horarioIntervalo[0] && parseInt(horario) === horaSaida + 1) {
            for (let m = minutoSaida; m < 60; m += 5) {
                const minutoFormatado = m.toString().padStart(2, '0');
                const horaFormatada = horaSaida.toString().padStart(2, '0');
                const valor = `${horaFormatada}:${minutoFormatado}`;
                horariosEntrada += `<option value="${valor}">${valor}</option>\n`;
            }
        }
    });
    if(horariosEntrada){
        horariosJanela+= horariosSobrando;
        horariosJanela+= horariosEntrada;
        horariosJanela+= horariosNormais;
    } 
    else if(horariosSaida){
        horariosJanela+= horariosSobrando;
        horariosJanela+=horariosSaida;
    }
    else {
        horariosJanela+= horariosSobrando;
        horariosJanela+= horariosNormais;
    }

    janela.innerHTML = `
    <p>O agendamento para turmas provisórias é temporário e não constará no calendário geral definitivo. 
    Caso a turma seja ou já esteja confirmada, o agendamento será incluído diretamente no calendário. </p>
    <p><strong>Data:</strong>  ${dataInicialString}</p>
    <section class="juntar agenda">
        <div class="select-inicio">
            <label for="horario-inicio">Horário inicial</label><br>
            <select id="horario-inicio" name="horario-inicio">
                ${horariosJanela}
            </select>
        </div>
        <div>
            <label for="horario-fim">Horário final da aula</label><br>
            <input id="horario-fim" name="horario-fim" type="time"/>
        </div>
        <div class="select-repeticao">
            <label for="repeticao">Repetição</label><br>
            <select id="repeticao" name="repeticao">
                <option value="Não repetir">Não repetir</option>                                
                <option value="Diariamente">Diariamente</option>
                <option value="Semanalmente">Semanalmente</option>
            </select>
        </div>
    </section>
    <section class="juntar">
    <br>
        <div id="dias-semana" >
            <label>Escolha os dias para repetir:</label><br>
            <input type="checkbox" id="segunda" name="dias" value="segunda-feira">
            <label for="segunda">Segunda-feira</label>
            <input type="checkbox" id="terca" name="dias" value="terça-feira">
            <label for="terca">Terça-feira</label>
            <input type="checkbox" id="quarta" name="dias" value="quarta-feira">
            <label for="quarta">Quarta-feira</label>
            <input type="checkbox" id="quinta" name="dias" value="quinta-feira">
            <label for="quinta">Quinta-feira</label>
            <input type="checkbox" id="sexta" name="dias" value="sexta-feira">
            <label for="sexta">Sexta-feira</label>
        </div>
    </section>
    <section class="juntar">
        <div id="data-final" ><br>
            <label>Escolha a data final da repetição:</label><br>
            <input type="date" id="data-fim" name="data-fim">
        </div>
    </section>
    <div class="btn-container">
        <button class="btn-back" onclick="fecharJanela()">Voltar</button>
        <button class="btn-confirm" id="confirmSched" onclick="confirmarAgendamento('${classeInicial}', '${dia}', '${dataInicialString}', '${dataInicialDate}', '${horario}')">Confirmar</button>
    </div>
    `;   
    const repeticaoSelect = document.getElementById('repeticao');
    const diasSemanaDiv = document.getElementById('dias-semana');
    const dataFinalDiv = document.getElementById('data-final');
    repeticaoSelect.addEventListener('change', function() {
        if(repeticaoSelect.value==="Semanalmente"){
            diasSemanaDiv.style.display="block";
            dataFinalDiv.style.display="block";
            document.getElementById("data-fim").value="";
        }else if(repeticaoSelect.value==="Diariamente"){
            dataFinalDiv.style.display="block";
            diasSemanaDiv.style.display="none";
            const inputsDias = document.querySelectorAll('input[name="dias"]');
            inputsDias.forEach(input => input.checked = false);
        }else{
            diasSemanaDiv.style.display="none";
            dataFinalDiv.style.display="none";
            const inputsDias = document.querySelectorAll('input[name="dias"]');
            inputsDias.forEach(input => input.checked = false);
            document.getElementById("data-fim").value="";
        }
    });
    janela.hidden = false;
}

function verificaTdAus(inicio, fim, data){
    const tds = document.querySelectorAll(`#horario td[aus="true"], #horario td[intervalo="true"]`);
    return Array.from(tds).some(td => {
        const hora = emMinutos(td.getAttribute("horario"));
        return td.getAttribute("data") === data && hora >= inicio && hora < fim;
    });
}

async function confirmarAgendamento(classeInicial, dia, dataInicialString, dataInicialDate, horario){
    const botaoConfirmar = document.getElementById('confirmSched');
    botaoConfirmar.setAttribute('disabled', 'disabled');
    if (dataInicialString !== ultimaDataAgendada) {
        minutosAdc = 0;
        ultimaDataAgendada = dataInicialString;
    }
    
    const horarioInicio = document.getElementById("horario-inicio").value;
    const horarioFim = document.getElementById("horario-fim").value;
    const diasMarcados = document.querySelectorAll('input[name="dias"]:checked');
    const diasSelecionados = [];
    diasMarcados.forEach(function(checkbox) {
        diasSelecionados.push(checkbox.value);
    });
    const dataFim = document.getElementById("data-fim").value;
    const repeticao = document.getElementById('repeticao').value;
    
    let classeAtual = classeInicial.split(" ");
    let horarioInicioMinutos = emMinutos(horarioInicio); 
    let horarioFimMinutos = emMinutos(horarioFim);
    
    if(horarioInicioMinutos > horarioFimMinutos){
        alert("O horário inicial não pode ser menor que o horário final");
        return
    }

    let day = new Date(dataInicialDate);
    day.setHours(day.getHours() + 3);
    const diaAnterior = new Date(day);
    diaAnterior.setDate(day.getDate() - 1);
    const diaPosterior = new Date(day);
    diaPosterior.setDate(day.getDate() + 1);
    if (window.listaHorarios) {
        let somaIntervalos = 0;
        for (const agendado of window.listaHorarios) {
            
            if (agendado.data === diaAnterior.toLocaleDateString('pt-BR')) {
                const inicioAtual = new Date(`1970-01-02T${horarioInicio}:00`);
                const fimAgendado = new Date(`1970-01-01T${agendado.horarioFim}:00`);
                const diffHoras = (inicioAtual - fimAgendado) / (1000 * 60 * 60);
                if (diffHoras < 11) {
                    alert("Atenção: a interjornada deve ser de, no mínimo, 11 horas!");
                    return;
                }
            }
            else if (agendado.data === diaPosterior.toLocaleDateString('pt-BR')) {
                const fimAtual = new Date(`1970-01-01T${horarioFim}:00`);
                const inicioAgendado = new Date(`1970-01-02T${agendado.horarioInicio}:00`);
                const diffHoras = (inicioAgendado - fimAtual) / (1000 * 60 * 60);
                if (diffHoras < 11) {
                    alert("Atenção: a interjornada deve ser de, no mínimo, 11 horas!");
                    return;
                }
            }
            if(dataInicialString === agendado.data){
                const inicio = emMinutos(agendado.horarioInicio);
                const fim = emMinutos(agendado.horarioFim);
                if (fim > inicio) {
                    somaIntervalos += fim - inicio;
                }
            } 
            
        }
        window.totalMinutosDoDia = somaIntervalos;

    }
    if (window.listaHorariosNovos && Array.isArray(window.listaHorariosNovos)) {
        minutosAdc = 0;
        for (const novo of window.listaHorariosNovos) {
            if (novo.data === dataInicialString) {
                const inicio = emMinutos(novo.horarioInicio);
                const fim = emMinutos(novo.horarioFim);
                if (fim > inicio) {
                    minutosAdc += fim - inicio;
                }
            }
        }
        minutosAdc += horarioFimMinutos - horarioInicioMinutos;
    } else {
        minutosAdc = 0;
        minutosAdc += horarioFimMinutos - horarioInicioMinutos;
    }
    if(window.totalMinutosDoDia + minutosAdc>600 ){
        alert("O turno não deve exceder 10 horas de trabalho");
        return
    }
    else{
        window.totalMinutosDoDia = window.totalMinutosDoDia + minutosAdc;
    }

    if(horarioFimMinutos-horarioInicioMinutos>600){
        alert("O turno não deve exceder 10 horas de trabalho");
        return
    }

    let ultrapassa = false;
    horariosES.forEach(hes =>{
        if(hes[0]===dia && horarioFimMinutos>emMinutos(hes[2])){
            alert("O horário final não pode ser maior que o horário de saída do técnico!");
            ultrapassa = true;
            return
        }
    });    
    if(dataFim){
        var dataFimDate = new Date(dataFim);
        dataFimDate.setHours(dataFimDate.getHours()+3);
        if(new Date(dataInicialDate)>= dataFimDate){
            alert("A data final não pode ser igual ou anterior à data inicial");
            return
        }
    }
    else{
        var dataFimDate="";
    }
    let conflito = false ;
    if(window.listaHorarios){
        window.listaHorarios.forEach(agendado => {
            if (agendado.data === dataInicialString && agendado.horarioInicio>=horarioInicio && horarioFim > agendado.horarioInicio ) {
                conflito = true;
            }
        });
        conflito === true ? alert("ATENÇÃO! Conflito de horários") : "";
    }

    if(!horarioInicio || !horarioFim || (repeticao==="Diariamente" && !dataFim) || (repeticao==="Semanalmente" && diasSelecionados.length===0 && !dataFim) || conflito===true || ultrapassa===true){
        alert("Por favor, preencha corretamente todos os campos!")
        return
    }else{
        let conflitoES = false;
        let datasAgendadas = [];
        if (repeticao === "Não repetir" ) {
            const verificaAusencia = verificaTdAus(horarioInicioMinutos, horarioFimMinutos, dataInicialString);
            if(verificaAusencia){
                conflitoES = true;
            }
            if(window.listaAgendaTurma){
                window.listaAgendaTurma.forEach(agendado =>{
                    if(agendado.data===dataInicialString && ((agendado.horarioInicio>=horarioInicio && agendado.horarioInicio<horarioFim) || (horarioInicio>=agendado.horarioInicio && horarioInicio<agendado.horarioFim))){
                        conflitoES = true;
                    }
                });
            }
            if(conflitoES===false){
                datasAgendadas.push(dataInicialString);
            }else{
                alert("ATENÇÃO! Conflito de agendamento com horários de entrada/saída do técnico ou com agendamentos prévios!");
                return
            }
            conflitoES=false;
        } 
        else if (repeticao === "Diariamente") {
            let dataAtual = new Date(dataInicialDate);
            let dataFimDate = new Date (dataFim);
            dataFimDate.setHours(dataFimDate.getHours()+3);
            while (dataAtual <= dataFimDate) {
                if (dataAtual.getDay() !== 0 && dataAtual.getDay() !== 6) {
                    const verificaAusencia = verificaTdAus(horarioInicioMinutos, horarioFimMinutos, dataAtual.toLocaleDateString("pt-BR"));
                    if(verificaAusencia){
                        conflitoES = true;
                    }
                    if(horariosES.length!==0){
                        horariosES.forEach(h =>{
                            const diaDataAtual = diaDaSemanaParaString(dataAtual.getDay());
                            if(diaDataAtual===h[0] && (emMinutos(horarioInicio)<emMinutos(h[1]) || emMinutos(horarioFim)>emMinutos(h[2]))){
                                conflitoES = true;
                            }
                        });
                    }
                    if(window.listaHorarios){
                        window.listaHorarios.forEach(agendado => {
                            const diaDataAtual = diaDaSemanaParaString(dataAtual.getDay());
                            if (agendado.data === dataAtual.toLocaleDateString('pt-BR') && agendado.dia === diaDataAtual && ((agendado.horarioInicio>=horarioInicio && agendado.horarioInicio<horarioFim) || (horarioInicio>=agendado.horarioInicio && horarioInicio<agendado.horarioFim))) {
                                conflitoES = true;
                            }
                        });
                    }
                    if(window.listaHorariosNovos){
                        window.listaHorariosNovos.forEach(agendado => {
                            const diaDataAtual = diaDaSemanaParaString(dataAtual.getDay());
                            if (agendado.data === dataAtual.toLocaleDateString('pt-BR') && agendado.dia === diaDataAtual && ((agendado.horarioInicio>=horarioInicio && agendado.horarioInicio<horarioFim) || (horarioInicio>=agendado.horarioInicio && horarioInicio<agendado.horarioFim))) {
                                conflitoES = true;
                            }
                        });
                    }
                    if(window.listaAgendaTurma){
                        window.listaAgendaTurma.forEach(agendado =>{
                            if(agendado.data===dataAtual.toLocaleDateString('pt-BR') && ((agendado.horarioInicio>=horarioInicio && agendado.horarioInicio<horarioFim) || (horarioInicio>=agendado.horarioInicio && horarioInicio<agendado.horarioFim))){
                                conflitoES = true;
                            }
                        });
                    }
                    if(conflitoES===false){
                        datasAgendadas.push(dataAtual.toLocaleDateString('pt-BR'));  
                    }else{
                        alert("ATENÇÃO! Conflito de agendamento com horários de entrada/saída do técnico ou com agendamentos prévios!");
                        return
                    }
                }
                dataAtual.setDate(dataAtual.getDate() + 1);
            }
            conflitoES=false;
        } else if (repeticao === "Semanalmente") {
            let dataAtual = new Date(dataInicialDate);
            let dataFimDate = new Date (dataFim);
            dataFimDate.setHours(dataFimDate.getHours()+3);
            while (dataAtual <= dataFimDate) {
                if (dataAtual.getDay() !== 0 && dataAtual.getDay() !== 6 && diasSelecionados.includes(dataAtual.toLocaleString('pt-BR', { weekday: 'long' }))) {
                    const verificaAusencia = verificaTdAus(horarioInicioMinutos, horarioFimMinutos, dataAtual.toLocaleDateString("pt-BR"));
                    if(verificaAusencia){
                        conflitoES = true;
                    }
                    if(horariosES.length!==0){
                        horariosES.forEach(h =>{
                            const diaDataAtual = diaDaSemanaParaString(dataAtual.getDay());
                            if(diaDataAtual===h[0] && (emMinutos(horarioInicio)<emMinutos(h[1]) || emMinutos(horarioFim)>emMinutos(h[2]))){
                                conflitoES = true;
                            }
                        });
                    }
                    if(window.listaHorarios){
                        window.listaHorarios.forEach(agendado => {
                            const diaDataAtual = diaDaSemanaParaString(dataAtual.getDay());
                            if (agendado.dia === diaDataAtual && agendado.data===dataAtual.toLocaleDateString() && ((agendado.horarioInicio>=horarioInicio && agendado.horarioInicio<horarioFim) || (horarioInicio>=agendado.horarioInicio && horarioInicio<agendado.horarioFim))) {
                                conflitoES = true;
                            }
                        });
                    }
                    if(window.listaHorariosNovos){
                        window.listaHorariosNovos.forEach(agendado => {
                            const diaDataAtual = diaDaSemanaParaString(dataAtual.getDay());
                            if (agendado.data === dataAtual.toLocaleDateString('pt-BR') && agendado.dia === diaDataAtual && ((agendado.horarioInicio>=horarioInicio && agendado.horarioInicio<horarioFim) || (horarioInicio>=agendado.horarioInicio && horarioInicio<agendado.horarioFim))) {
                                conflitoES = true;
                            }
                        });
                    }
                    if(window.listaAgendaTurma){
                        window.listaAgendaTurma.forEach(agendado =>{
                            if(agendado.data===dataAtual.toLocaleDateString('pt-BR') && ((agendado.horarioInicio>=horarioInicio && agendado.horarioInicio<horarioFim) || (horarioInicio>=agendado.horarioInicio && horarioInicio<agendado.horarioFim))){
                                conflitoES = true;
                            }
                        });
                    }
                    if(conflitoES===false){
                        datasAgendadas.push(dataAtual.toLocaleDateString('pt-BR'));  
                    }else{
                        alert("ATENÇÃO! Conflito de agendamento com horários de entrada/saída do técnico ou com agendamentos prévios!");
                        return
                    }
                }
                dataAtual.setDate(dataAtual.getDate() + 1);
            }
            conflitoES=false;
        }
        if (dataFimDate!=='') dataFimDate=dataFimDate.toLocaleDateString('pt-BR');
        datasAgendadas = datasAgendadas.filter(d => !window.listaFerias.includes(d));
        let cargaAgendada = 0;
        const inicioMinutos=emMinutos(horarioInicio);
        const fimMinutos=emMinutos(horarioFim);
        cargaAgendada=(fimMinutos-inicioMinutos)*datasAgendadas.length;
        const horasRestantes = document.querySelector("#cargaHorariaDisponivel").value;
        if(cargaAgendada<=parseFloat(horasRestantes)*60){
            let tecnico = document.querySelector("#tecnicoEnsino").value;
            let turma = document.querySelector("#turma").value;
            let uc = document.querySelector("#uc").value;
            const inputCarga= document.querySelector("#cargaHorariaDisponivel");
            inputCarga.value=Math.round(((parseFloat(horasRestantes)*60)-cargaAgendada)/60);
            for (const dataAgendada of datasAgendadas) {
                let diaClasse;
                let dataAgendadaFormatada = dataAgendada.split('/'); 
                diaClasse = new Date(dataAgendadaFormatada[2], dataAgendadaFormatada[1] - 1, dataAgendadaFormatada[0]);
                diaClasse.setHours(diaClasse.getHours()+3);
                diaClasse.getDay()===1 ? classeAtual[1] = 'segunda' :
                diaClasse.getDay()===2 ? classeAtual[1] = 'terca' :
                diaClasse.getDay()===3 ? classeAtual[1] = 'quarta' :
                diaClasse.getDay()===4 ? classeAtual[1] = 'quinta' : 
                diaClasse.getDay()===5 ? classeAtual[1] = 'sexta' : ''
                const novoHorario = {
                    turma: turma,
                    uc:uc,
                    tecnico: tecnico,
                    data: dataAgendada,
                    horarioInicio: horarioInicio,
                    horarioFim: horarioFim,
                    horario: horario,
                    dia: classeAtual[1],
                    repeticao: repeticao,
                    dataFim: dataFimDate,
                    diasSelecionados: diasSelecionados,
                    usuario: userAtual
                };
                window.listaHorariosNovos = window.listaHorariosNovos || [];
                window.listaHorariosNovos.push(novoHorario);
            };
        }else{
            alert("ATENÇÃO! Carga horária agendada maior que a carga da UC!");
            return
        }
        fecharJanela();
        preencheHorariosNovos();
    }
}

async function preencheHorariosNovos() {
    const tabelaOpen = document.querySelectorAll("#horario td.open");
    if (window.listaHorariosNovos) {
        tabelaOpen.forEach(td => {
            const atbHorario = parseInt(td.getAttribute("horario"));
            const classeTd= td.classList.value;        
            const atbData = td.getAttribute("data");
            window.listaHorariosNovos.forEach((agendado, index) => {
                const condicaoBase = agendado.data === atbData && classeTd.includes(agendado.dia);
                if (condicaoBase) {
                    const horarioInicio = parseInt(agendado.horario);
                    const horarioFim = parseInt(agendado.horarioFim);
                    if (atbHorario >= parseInt(agendado.horario) && atbHorario <= parseInt(agendado.horarioFim)) {
                        td.classList.remove("open", "visualizacao");
                        td.classList.add("agendado");
                        td.setAttribute("novo", true);
                    } if (String(atbHorario).padStart(2, '0') === agendado.horario) {
                        td.textContent = ""; 
                        const textoHora = document.createElement("span");
                        textoHora.textContent=`${agendado.horarioInicio} às ${agendado.horarioFim}`;
                        const btnExcluir = document.createElement("button");
                        btnExcluir.type = "button";
                        btnExcluir.style.all = "unset";
                        btnExcluir.style.marginLeft = "2vw";
                        btnExcluir.style.cursor = "pointer";
                        const imgIcone = document.createElement("img");
                        imgIcone.src = "../img/Trash-white.svg";
                        imgIcone.alt = "Excluir";
                        btnExcluir.appendChild(imgIcone);
                        btnExcluir.addEventListener("click", (e) => {
                            e.stopPropagation();
                            const todasTds = document.querySelectorAll("#horario td[horario]");
                            todasTds.forEach(tdItem => {
                                const horarioTd = parseInt(tdItem.getAttribute("horario"));
                                const dataAtb = tdItem.getAttribute("data");
                                if (horarioTd >= horarioInicio && horarioTd <= horarioFim && dataAtb===atbData) {
                                    if (tdItem.classList.contains("agendado")) {
                                        tdItem.classList.remove("visualizacao", "agendado");
                                        tdItem.classList.add("open");
                                        tdItem.textContent = "";
                                    }
                                }
                            });
                            window.listaHorariosNovos.splice(index, 1);
                            const inicioMinutos = emMinutos(agendado.horarioInicio); 
                            const fimMinutos = emMinutos(agendado.horarioFim);
                            const totalMinutos = fimMinutos - inicioMinutos;
                            minutosAdc -= totalMinutos;
                            let inputCargaRestante = document.querySelector("#cargaHorariaDisponivel");
                            let cargaAtual = inputCargaRestante.value;
                            cargaAtualRestante = ((cargaAtual*60) + totalMinutos)/60;
                            inputCargaRestante.value = Math.round(cargaAtualRestante);
                            preencheHorariosNovos(); 
                        });
                        td.appendChild(textoHora);
                        td.appendChild(btnExcluir);
                    }
                }
            });
            if(td.getAttribute('novo') && td.getAttribute('aus') !== "true" && !td.className.includes("agendado")) {
                td.classList.add("open");
                if(td.textContent!=="Hora-atividade" && td.textContent!=="Férias" && td.textContent!=="Ausente" && td.textContent!=="Intervalo"){
                    td.textContent = ""; 
                }               
            }
        });
    }
}

async function preencheHorariosAnteriores() {
    const tabelaOpen = document.querySelectorAll("#horario td.open");
    if (window.listaHorarios) {
        const formVer = !!document.querySelector("#ver-agendamento");

        tabelaOpen.forEach(td => {
            const atbHorario = parseInt(td.getAttribute("horario"));
            const classeTd = td.classList.value;
            const atbData = td.getAttribute("data");
            
            window.listaHorarios.forEach((agendado, index) => {
                const turmaAgendado = document.querySelector("#turma").value;
                const ucAgendado = document.querySelector("#uc").value;

                const condicaoBase = agendado.data === atbData && classeTd.includes(agendado.dia);
                const condicaoUsuario = agendado.usuario === userAtual && !formVer;
                const condicaoTurmaUc =  agendado.turma === turmaAgendado && agendado.uc === ucAgendado;

                if (condicaoBase && condicaoUsuario) {
                    
                    const horarioAtual = parseInt(atbHorario);
                    const horarioInicio = parseInt(agendado.horario);
                    const horarioFim = parseInt(agendado.horarioFim);
                    if (horarioAtual >= horarioInicio && horarioAtual <= horarioFim) {
                        td.classList.remove("open", "visualizacao");
                        td.classList.add("agendado");
                    }
                    if (String(horarioAtual).padStart(2, '0') === agendado.horario) {
                        
                        td.textContent = "";
                        const textoHora = document.createElement("span");
                        textoHora.textContent = `${agendado.horarioInicio} às ${agendado.horarioFim}`;
                        td.appendChild(textoHora);
                        if(condicaoTurmaUc){
                            const btnExcluir = document.createElement("button");
                            btnExcluir.type = "button";
                            btnExcluir.style.all = "unset";
                            btnExcluir.style.marginLeft = "2vw";
                            btnExcluir.style.cursor = "pointer";
                            const imgIcone = document.createElement("img");
                            imgIcone.src = "../img/Trash-white.svg";
                            imgIcone.alt = "Excluir";
                            btnExcluir.appendChild(imgIcone);
                            btnExcluir.addEventListener("click", async (e) => {
                                e.stopPropagation();
                                removeIndiceExluido(agendado);
                                if (window.listaAgendaTurma) {
                                    window.listaAgendaTurma = window.listaAgendaTurma.filter(item => {
                                        return !(item.data === agendado.data &&
                                                item.horarioInicio === agendado.horarioInicio &&
                                                item.horarioFim === agendado.horarioFim);
                                    });
                                }
                                const todasTds = document.querySelectorAll("#horario td[horario]");
                                todasTds.forEach(tdItem => {
                                    const horarioTd = parseInt(tdItem.getAttribute("horario"));
                                    const dataAtb = tdItem.getAttribute("data");
                                    if (horarioTd >= horarioInicio && horarioTd <= horarioFim && dataAtb===atbData) {
                                        if (tdItem.classList.contains("agendado")) {
                                            tdItem.classList.remove("visualizacao", "agendado");
                                            tdItem.classList.add("open");
                                            tdItem.textContent = "";
                                        }
                                    }
                                });
                                window.listaHorarios.splice(index, 1);
                                const inicioMinutos = emMinutos(agendado.horarioInicio);
                                const fimMinutos = emMinutos(agendado.horarioFim);
                                const totalMinutos = fimMinutos - inicioMinutos;
                                minutosAdc -= totalMinutos;
                                const inputCargaRestante = document.querySelector("#cargaHorariaDisponivel");
                                const cargaAtual = inputCargaRestante.value;
                                cargaAtualRestante = ((cargaAtual * 60) + totalMinutos) / 60;
                                inputCargaRestante.value = Math.round(cargaAtualRestante);
                                await preencheHorariosAnteriores();
                                await preencheHorariosNovos();
                            });

                            td.appendChild(btnExcluir);
                        }
                    }
                }
                else if (condicaoBase) {
                    if (atbHorario >= parseInt(agendado.horario) && atbHorario <= parseInt(agendado.horarioFim)) {
                        td.classList.remove("open", "visualizacao");
                    }
                    if (String(atbHorario).padStart(2, '0') === agendado.horario) {
                        td.textContent = "";
                        const textoHora = document.createElement("span");
                        textoHora.textContent = `${agendado.horarioInicio} às ${agendado.horarioFim}`;
                        td.appendChild(textoHora);
                    }
                }
            });
            if (!formVer && td.getAttribute('aus') !== "true" && !td.className.includes("agendado")) {
                td.classList.add("open");
                td.classList.remove("visualizacao");
                if (!["Hora-atividade", "Férias", "Ausente", "Intervalo", "Em reunião", "Em treinamento", "Em viagem"].includes(td.textContent)) {
                    td.textContent = "";
                }
            } else if (formVer && !td.classList.contains('open')) {
                td.classList.add("agendado");
            } else if (formVer && td.classList.contains('open')) {
                td.classList.remove("open");
                td.classList.add("visualizacao");
            }
        });
    }

    if (window.listaAgendaTurma) {
        const tabelaOpen2 = document.querySelectorAll("#horario td.open");
        window.listaAgendaTurma.forEach(li => {
            const horarioInicioM = emMinutos(li.horarioInicio);
            const horarioFimM = emMinutos(li.horarioFim);
            tabelaOpen2.forEach(td => {
                const atbData = td.getAttribute("data");
                const atbHorario = td.getAttribute("horario");
                const atbHorarioMinutos = emMinutos(atbHorario);
                const atbAus = td.getAttribute("aus");
                const margemMinutos = 30;
                if (atbData === li.data &&
                    atbHorarioMinutos >= (horarioInicioM - margemMinutos)  &&
                    atbHorarioMinutos <= horarioFimM &&
                    !atbAus) {
                    td.classList.add("turma-agendada");
                    td.textContent = "Turma agendada";
                    td.classList.remove("open");
                }
            });
        });
    }
}



async function carregaHorariosPrevios(tecnicoEdicao, origem){
    if(origem===1){
        const responseTecnicos = await fetch('/tecnicos/gerenciar');
        const tecnicoEnsinos = await responseTecnicos.json();
        tecnicoAtual = tecnicoEnsinos.find(tec => tecnicoEdicao.split(" - ")[0] === tec._id);
        renderWeek();
        await limitaPeriodoTurma();
        await disponibilizaHorarios(tecnicoAtual);
        await disponibilizaAusencias(tecnicoAtual);
        window.listaHorarios = [];
        window.listaAgendamentos = [];
        const responseAgendamentos = await fetch ('/agendamentos/gerenciar');
        const agendamentosBD = await responseAgendamentos.json();
        let turma = document.querySelector("#turma").value;
        let uc = document.querySelector("#uc").value;
        if(agendamentosBD){
            await carregarAgendamentosBD(agendamentosBD, tecnicoAtual, turma, uc);  
            await preencheHorariosAnteriores(); 
        }
    }else if(origem === 2){
        let tecnico = document.querySelector("#tecnicoEnsino");
        let turma = document.querySelector("#turma");
        let uc = document.querySelector("#uc");
        tecnico.addEventListener("change", () => carregaHorariosPreviosChange(tecnico.value, turma.value, uc.value));
        turma.addEventListener("change", () => carregaHorariosPreviosChange(tecnico.value, turma.value, uc.value));
        uc.addEventListener("change", () => carregaHorariosPreviosChange(tecnico.value, turma.value, uc.value));
    }
}


async function carregaHorariosPreviosChange(tecnico, turma, uc) {
    if (tecnico!=="selecione" && turma !== "selecione" && uc !== "selecione"){
        const responseTecnicos = await fetch('/tecnicos/gerenciar');
        const tecnicoEnsinos = await responseTecnicos.json();
        tecnicoAtual = tecnicoEnsinos.find(tec => tecnico.split(" - ")[0] === tec._id);
        const responseTurma = await fetch('/turmas/gerenciar');
        const turmas = await responseTurma.json();
        const mapTurma = turmas.filter(t =>{
            return t._id===turma.split(' - ')[0];
        });
        const datas = `${mapTurma[0].data_inicio} - ${mapTurma[0].data_fim}`; 
        localStorage.setItem('turmaAgendamento', JSON.stringify(datas));
        datasTurma = JSON.parse(localStorage.getItem('turmaAgendamento'));
        window.listaHorarios = [];
        window.listaAgendamentos = [];
        await limitaPeriodoTurma();
        await disponibilizaHorarios(tecnicoAtual);
        await disponibilizaAusencias(tecnicoAtual);
        try{
            const responseAgendamentos = await fetch ('/agendamentos/gerenciar');
            if (responseAgendamentos.ok) {
                agendamentosBD = await responseAgendamentos.json();
            }
        } catch (error){ }
        if(agendamentosBD){
            
            await carregarAgendamentosBD(agendamentosBD, tecnicoAtual, turma, uc);
            await preencheHorariosAnteriores();
        }        
    } else{
        botoesCalendar.style.display='none';
        semanal.style.display='none';
        mensal.style.display='none';
    }
}

async function carregarAgendamentosBD(agendamentosBD, tecnicoAtual, turma, uc) {
    const cargaTotalEmMinutos = parseFloat(window.cargaUcTotal)*60;
    let totalMinutos = 0;
    for (const agendado of agendamentosBD) {
        if(agendado.agendamentos[0].turma === turma){
            await verificaAgendaTurma(agendado);
        }
        if(agendado.agendamentos[0].tecnico.split(" - ")[0] === tecnicoAtual._id){
            window.listaAgendamentos = window.listaAgendamentos || [];
            window.listaAgendamentos.push(agendado);
            
            agendado.agendamentos.forEach(agendamento => {
                const horarioPrevio = {
                    turma: agendado.agendamentos[0].turma,
                    uc:agendado.agendamentos[0].uc,
                    tecnico: `${tecnicoAtual._id} - ${tecnicoAtual.nome}`,
                    data: agendamento.data,
                    horarioInicio: agendamento.horarioInicio,
                    horarioFim: agendamento.horarioFim,
                    horario: agendamento.horario,
                    dia: agendamento.dia,
                    repeticao: agendamento.repeticao,
                    dataFim: agendamento.dataFimFormatada,
                    diasSelecionados: agendamento.diasSelecionados,
                    usuario: agendamento.usuario
                };
                window.listaHorarios = window.listaHorarios || [];
                window.listaHorarios.push(horarioPrevio); 
            });
        }
        if (agendado.agendamentos[0].turma === turma && agendado.agendamentos[0].uc.split(' - ')[1].trim() === uc.split(' - ')[1].trim()) {
            agendado.agendamentos.forEach(agendamento=>{
                const inicioMinutos = emMinutos(agendamento.horarioInicio);
                const fimMinutos = emMinutos(agendamento.horarioFim);
                totalMinutos += fimMinutos - inicioMinutos;
            })
        }
    };
    cargaAtualRestante = (cargaTotalEmMinutos - totalMinutos)/60;
    let inputCargaRestante = document.querySelector("#cargaHorariaDisponivel");
    inputCargaRestante.value = Math.round(cargaAtualRestante);
}

async function verificaAgendaTurma(agendado){
    agendado.agendamentos.forEach(a =>{
        const agenda = a;
        window.listaAgendaTurma = window.listaAgendaTurma || [];
        window.listaAgendaTurma.push(agenda); 
    });
}

async function limitaPeriodoTurma(){
    const tabela = document.querySelectorAll("#horario td:not(.n)");
    tabela.forEach(td => td.textContent="");
    tabela.forEach(td => td.removeAttribute("aus"));
    tabela.forEach(td => td.removeAttribute("es"));
    tabela.forEach(td => td.removeAttribute('intervalo'));
    tabela.forEach(td => td.classList.remove("visualizacao"));
    tabela.forEach(td => td.classList.remove("turma-agendada"));
    tabela.forEach(td => td.classList.remove("limite"));
    tabela.forEach(td => td.classList.remove("open"));
    tabela.forEach(td => td.classList.remove("hora"));
    tabela.forEach(td => td.classList.remove("ferias"));
    tabela.forEach(td => td.classList.remove("ausente"));
    tabela.forEach(td => td.classList.remove("agendado"));
    const datas = datasTurma.split(' - ');
    const inicialDate=new Date(datas[0]);
    const finalDate=new Date(datas[1]);
    inicialDate.setHours(inicialDate.getHours() + 3);
    finalDate.setHours(finalDate.getHours() + 3);
    tabela.forEach(td=>{
        const atbData = td.getAttribute("data").split('/'); 
        const atbDataDate=new Date(atbData[2], atbData[1] - 1, atbData[0]);
        if(atbDataDate<inicialDate || atbDataDate>finalDate){
            td.classList.add('limite');
            td.classList.remove('open');
        }
        else{
            td.classList.add('open');
        }  
    });
}
