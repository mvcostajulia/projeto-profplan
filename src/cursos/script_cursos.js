async function listar(cursos) {
    const tbody = document.getElementById('cursos').querySelector('tbody');
    tbody.innerHTML = ''; 
    cursos.forEach(curso => {
        const tr = document.createElement('tr');
        let confirmedOpacity;
        let confirmedActions;        
        tr.innerHTML = `
            <td class="buttons">
                            <button title="Editar" onclick="editarCurso('${curso._id.toString()}','${curso.area}')" ${confirmedActions}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" opacity=${confirmedOpacity} xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5ZM1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8Z" fill="var(--cor-primaria)"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4C8.19503 4 8.37225 4.1134 8.45398 4.29047L11.454 10.7905C11.4843 10.8562 11.5 10.9276 11.5 11V13.2C11.5 13.4761 11.2761 13.7 11 13.7C10.7239 13.7 10.5 13.4761 10.5 13.2V11.1098L8 5.69315L5.5 11.1098V13.2C5.5 13.4761 5.27614 13.7 5 13.7C4.72386 13.7 4.5 13.4761 4.5 13.2V11C4.5 10.9276 4.5157 10.8562 4.54602 10.7905L7.54602 4.29047C7.62775 4.1134 7.80497 4 8 4Z" fill="var(--cor-primaria)"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 11C9.23478 11 8.98043 11.1054 8.79289 11.2929C8.60536 11.4804 8.5 11.7348 8.5 12C8.5 12.2761 8.27614 12.5 8 12.5C7.72386 12.5 7.5 12.2761 7.5 12C7.5 11.4696 7.71071 10.9609 8.08579 10.5858C8.46086 10.2107 8.96957 10 9.5 10C10.0304 10 10.5391 10.2107 10.9142 10.5858C11.2893 10.9609 11.5 11.4696 11.5 12C11.5 12.2761 11.2761 12.5 11 12.5C10.7239 12.5 10.5 12.2761 10.5 12C10.5 11.7348 10.3946 11.4804 10.2071 11.2929C10.0196 11.1054 9.76522 11 9.5 11Z" fill="var(--cor-primaria)"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.08579 10.5858C5.46086 10.2107 5.96957 10 6.5 10C7.03043 10 7.53914 10.2107 7.91421 10.5858C8.28929 10.9609 8.5 11.4696 8.5 12V14C8.5 14.2761 8.27614 14.5 8 14.5C7.72386 14.5 7.5 14.2761 7.5 14V12C7.5 11.7348 7.39464 11.4804 7.20711 11.2929C7.01957 11.1054 6.76522 11 6.5 11C6.23478 11 5.98043 11.1054 5.79289 11.2929C5.60536 11.4804 5.5 11.7348 5.5 12C5.5 12.2761 5.27614 12.5 5 12.5C4.72386 12.5 4.5 12.2761 4.5 12C4.5 11.4696 4.71071 10.9609 5.08579 10.5858Z" fill="var(--cor-primaria)"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.88745 8C5.88745 7.72386 6.11131 7.5 6.38745 7.5H9.61245C9.88859 7.5 10.1125 7.72386 10.1125 8C10.1125 8.27614 9.88859 8.5 9.61245 8.5H6.38745C6.11131 8.5 5.88745 8.27614 5.88745 8Z" fill="var(--cor-primaria)"/>
                                </svg>
                            </button>
                            <button title="Criar cópia" onclick="copiarCurso('${curso._id.toString()}')">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 2.5C4 2.22386 4.22386 2 4.5 2H13.5C13.7761 2 14 2.22386 14 2.5V11.5C14 11.7761 13.7761 12 13.5 12C13.2239 12 13 11.7761 13 11.5V3H4.5C4.22386 3 4 2.77614 4 2.5Z" fill="var(--cor-primaria)"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 4.5C2 4.22386 2.22386 4 2.5 4H11.5C11.7761 4 12 4.22386 12 4.5V13.5C12 13.7761 11.7761 14 11.5 14H2.5C2.22386 14 2 13.7761 2 13.5V4.5ZM3 5V13H11V5H3Z" fill="var(--cor-primaria)"/>
                                </svg>
                            </button>
                            <button title="Visualizar" onclick="visualizarCurso('${curso._id.toString()}')">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.27145 5.39645C3.46336 4.20453 5.33371 3 8 3C10.6663 3 12.5366 4.20453 13.7286 5.39645C14.3231 5.99096 14.7518 6.58461 15.0325 7.03047C15.1731 7.25379 15.2773 7.44117 15.3472 7.57464C15.3822 7.64141 15.4086 7.69479 15.4268 7.73255C15.4359 7.75144 15.4429 7.76643 15.4479 7.77725L15.4539 7.79032L15.4558 7.79445L15.4564 7.7959L15.4567 7.79646C15.4568 7.79671 15.4569 7.79693 15 8C15.4569 8.20307 15.4568 8.20329 15.4567 8.20354L15.4564 8.2041L15.4558 8.20555L15.4539 8.20968L15.4479 8.22275C15.4429 8.23357 15.4359 8.24856 15.4268 8.26745C15.4086 8.30521 15.3822 8.35859 15.3472 8.42536C15.2773 8.55883 15.1731 8.74621 15.0325 8.96953C14.7518 9.41539 14.3231 10.009 13.7286 10.6036C12.5366 11.7955 10.6663 13 8 13C5.33371 13 3.46336 11.7955 2.27145 10.6036C1.67693 10.009 1.24824 9.41539 0.967509 8.96953C0.826899 8.74621 0.722698 8.55883 0.652787 8.42536C0.617813 8.35859 0.591364 8.30521 0.573181 8.26745C0.564087 8.24856 0.557055 8.23357 0.552053 8.22275L0.546066 8.20968L0.544205 8.20555L0.543556 8.2041L0.543302 8.20354C0.543194 8.20329 0.543094 8.20307 1 8C0.543094 7.79693 0.543194 7.79671 0.543302 7.79646L0.543556 7.7959L0.544205 7.79445L0.546066 7.79032L0.552053 7.77725C0.557055 7.76643 0.564087 7.75144 0.573181 7.73255C0.591364 7.69479 0.617813 7.64141 0.652787 7.57464C0.722698 7.44117 0.826899 7.25379 0.967509 7.03047C1.24824 6.58461 1.67693 5.99096 2.27145 5.39645ZM1 8L0.543094 7.79693C0.485635 7.92621 0.485635 8.07379 0.543094 8.20307L1 8ZM1.55906 8C1.61788 8.11018 1.70235 8.25981 1.81374 8.43672C2.06426 8.83461 2.44807 9.36596 2.97855 9.89645C4.03664 10.9545 5.66629 12 8 12C10.3337 12 11.9634 10.9545 13.0214 9.89645C13.5519 9.36596 13.9357 8.83461 14.1863 8.43672C14.2976 8.25981 14.3821 8.11018 14.4409 8C14.3821 7.88982 14.2976 7.74019 14.1863 7.56328C13.9357 7.16539 13.5519 6.63404 13.0214 6.10355C11.9634 5.04547 10.3337 4 8 4C5.66629 4 4.03664 5.04547 2.97855 6.10355C2.44807 6.63404 2.06426 7.16539 1.81374 7.56328C1.70235 7.74019 1.61788 7.88982 1.55906 8ZM15 8L15.4569 8.20307C15.5144 8.07379 15.5144 7.92621 15.4569 7.79693L15 8Z" fill="var(--cor-primaria)"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6ZM5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8Z" fill="var(--cor-primaria)"/>
                                </svg>
                            </button>

            </td>
            <td>${curso.nome}</td>
            <td>${curso.codigo}</td>
            <td>${curso.carga}</td>
            <td>${curso.habilitacao}</td>
            <td>${curso.area}</td>
        `;
        tbody.appendChild(tr);
    });
}

async function listarCursos() {
    const response = await fetch('/cursos/gerenciar');
    const cursos = await response.json();
    cursos.sort((a, b) => a.nome.trim().localeCompare(b.nome.trim()));
    sessionStorage.setItem('resultadosCursos', JSON.stringify(cursos));
    listar(cursos);
}

document.addEventListener("DOMContentLoaded", () => {
    const inputPesquisa = document.getElementById("pesquisa");
    const botaoPesquisa = document.getElementById("pesquisar-btn");
    const tbody = document.getElementById('cursos').querySelector('tbody');
  
    const realizarPesquisa = async () => {
        const termo = inputPesquisa.value.trim(); 
        tbody.innerHTML = '';
        if (!termo) {
            return listarCursos();
        }
        try {
            const response = await fetch(`/cursos/gerenciar/pesquisa/${termo}`);
            if (!response.ok) {
                tbody.innerHTML = '';
            }
            const resultados = await response.json();
            resultados.sort((a, b) => a.nome.localeCompare(b.nome));
            sessionStorage.setItem('resultadosCursos', JSON.stringify(resultados));
            tbody.innerHTML = '';
            listar(resultados);
        } catch (error) {
            console.error("Erro durante a pesquisa:", error);
        }
    };
    botaoPesquisa.addEventListener("click", realizarPesquisa);
    inputPesquisa.addEventListener("input", realizarPesquisa);
});

document.addEventListener("DOMContentLoaded", () => {
    const botaoFiltros = document.getElementById("filtros-btn");
    const filtrarDiv = document.getElementById('filtrar');
    function abrirFiltros(){
        filtrarDiv.innerHTML = `
        <div class="filtragem">
            <form id="form-filtrar">
                <div class="bloco">
                    <label for="area">Área</label>
                    <select id="area" name="area">   
                        <option value="">Selecione</option>                             
                        <option value="Automotiva">Automotiva</option>
                        <option value="Automação Industrial">Automação Industrial</option>
                        <option value="Construção Civil">Construção Civil</option>
                        <option value="Eletroeletrônica">Eletroeletrônica</option>
                        <option value="Gestão">Gestão</option>       
                        <option value="Metalmecânica">Metalmecânica</option> 
                        <option value="Segurança do Trabalho">Segurança do Trabalho</option>  
                        <option value="Tecnologia da Informação">Tecnologia da Informação</option>
                        <option value="Vestuário">Vestuário</option>
                        </select>
                </div>
                <div class="bloco">
                    <label for="habilitacao">Habilitação</label>
                    <select id="habilitacao" name="habilitacao"> 
                        <option value="">Selecione</option>   
                        <option value="Iniciação">Iniciação</option>
                        <option value="Qualificação">Qualificação</option>
                        <option value="Aprendizagem">Aprendizagem</option>
                        <option value="Aperfeiçoamento/Especialização">Aperfeiçoamento/Especialização</option>
                        <option value="Técnica">Técnica</option>
                        <option value="Graduação">Graduação</option>
                        <option value="Extensão">Extensão</option>
                    </select>
                </div>
                <div class="btn-container">
                    <button class="btn-filtra" type="submit">Filtrar</button>
                </div>
            </form>
        </div>
        `;
        filtrarDiv.hidden = false;
        const svgAntigo = botaoFiltros.querySelector("svg");
        if (svgAntigo) {
            svgAntigo.remove();
        }
        const novoSVG = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 3.125C6.20304 3.125 3.125 6.20304 3.125 10C3.125 13.797 6.20304 16.875 10 16.875C13.797 16.875 16.875 13.797 16.875 10C16.875 6.20304 13.797 3.125 10 3.125ZM1.875 10C1.875 5.51269 5.51269 1.875 10 1.875C14.4873 1.875 18.125 5.51269 18.125 10C18.125 14.4873 14.4873 18.125 10 18.125C5.51269 18.125 1.875 14.4873 1.875 10Z" fill="var(--cor-primaria)"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9419 7.05806C13.186 7.30214 13.186 7.69786 12.9419 7.94194L7.94194 12.9419C7.69786 13.186 7.30214 13.186 7.05806 12.9419C6.81398 12.6979 6.81398 12.3021 7.05806 12.0581L12.0581 7.05806C12.3021 6.81398 12.6979 6.81398 12.9419 7.05806Z" fill="var(--cor-primaria)"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.05806 7.05806C7.30214 6.81398 7.69786 6.81398 7.94194 7.05806L12.9419 12.0581C13.186 12.3021 13.186 12.6979 12.9419 12.9419C12.6979 13.186 12.3021 13.186 12.0581 12.9419L7.05806 7.94194C6.81398 7.69786 6.81398 7.30214 7.05806 7.05806Z" fill="var(--cor-primaria)"/>
        </svg>
        `;
        botaoFiltros.innerHTML = `Fechar ${novoSVG}`;
        const botaoFiltrar = document.getElementById("form-filtrar");

        botaoFiltrar.addEventListener("submit", async function(event) {
            event.preventDefault();
        
            const area= document.getElementById("area")?.value.trim();
            const habilitacao= document.getElementById("habilitacao")?.value.trim();

            const params = new URLSearchParams();
            if (area) params.append('area', area);
            if (habilitacao) params.append('habilitacao', habilitacao);

            const tbody = document.getElementById('cursos').querySelector('tbody');
            tbody.innerHTML = '';
            try {
                const response = await fetch(`/cursos/gerenciar/filtrar?${params.toString()}`);
                if (!response.ok) {
                    tbody.innerHTML = '';
                }
                const resultados = await response.json();
                resultados.sort((a, b) => a.nome.localeCompare(b.nome));
                sessionStorage.setItem('resultadosCursos', JSON.stringify(resultados));
                tbody.innerHTML = '';
                listar(resultados);
            } catch (error) {
                console.error("Erro durante a pesquisa:", error);
            }
            fecharFiltros();
        });
    }

    function fecharFiltros() {
        filtrarDiv.innerHTML = ""; 
        filtrarDiv.hidden = true;
        const svgAntigo = botaoFiltros.querySelector("svg");
        if (svgAntigo) {
            svgAntigo.remove();
        }
        const novoSVG = `<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path  fill-rule="evenodd" clip-rule="evenodd" d="M3.78911 3.125C3.78904 3.125 3.78917 3.125 3.78911 3.125H17.211C17.4534 3.12508 17.6909 3.19567 17.8939 3.32818C18.097 3.46068 18.2571 3.64938 18.3548 3.87129C18.4525 4.0932 18.4836 4.33873 18.4442 4.57798C18.4049 4.81676 18.2971 5.039 18.134 5.21771C18.1337 5.21806 18.1334 5.2184 18.1331 5.21875L13 10.8674V15.2867C13.0014 15.4946 12.9505 15.6995 12.8521 15.8827C12.7539 16.0655 12.6114 16.2209 12.4376 16.3344L9.94011 17.9968L9.93758 17.9985C9.75002 18.122 9.53265 18.1928 9.30831 18.2032C9.08397 18.2137 8.86095 18.1636 8.6627 18.058C8.46445 17.9525 8.29829 17.7955 8.18169 17.6036C8.06509 17.4117 8.00235 17.1918 8.00008 16.9673L8.00001 16.9609L8.00005 10.8674L7.99839 10.8657L2.86704 5.21875C2.86676 5.21844 2.86648 5.21814 2.8662 5.21783C2.703 5.0391 2.5952 4.81682 2.5559 4.57798C2.51653 4.33873 2.54758 4.0932 2.64529 3.87129C2.74299 3.64938 2.90313 3.46068 3.10618 3.32818C3.3091 3.19576 3.54613 3.12517 3.78843 3.125M17.2108 4.375H3.78931L3.79072 4.37655L8.92114 10.0223C9.13453 10.2527 9.25216 10.5556 9.25005 10.8696V16.9546L11.75 15.2905L11.75 15.2891L11.75 10.8696C11.7479 10.5556 11.8656 10.2527 12.079 10.0223L17.2094 4.37655L17.2108 4.375Z" fill="var(--cor-primaria)"/>
        </svg>`;
        botaoFiltros.innerHTML = `Filtros ${novoSVG}`;
    }

    document.addEventListener("click", async (event) => {
        const clicouNoBotao = botaoFiltros.contains(event.target);
        const clicouFora = !filtrarDiv.hidden && !filtrarDiv.contains(event.target) && !clicouNoBotao;
        if (clicouNoBotao) {
            if (filtrarDiv.hidden) {
                await abrirFiltros();
            } else {
                fecharFiltros();
            }
        } else if (clicouFora) {
            fecharFiltros();
        }
    });
});

async function editarCurso(id, area) {
    try {
        const response = await fetch('/conta/preencher', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Erro ao obter usuário');
        }

        const data = await response.json();
        const funcaoLogada = data.usuario.funcao;
        const areaLogada = data.usuario.area;
        if(funcaoLogada==="Administrador" || funcaoLogada==="Monitor" || (areaLogada===area && funcaoLogada==="Facilitador")){
            const url = `/cursos/gerenciar/pesquisa/${id}`;
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Falha ao buscar cursos');
                    }
                    return response.json();
                    
                })
                .then(data => {
                    localStorage.setItem('cursoData', JSON.stringify(data));
                    window.location.href='/cursos/editar'
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Ocorreu um erro ao buscar os cursos');
            });
        }else{
            exibirNotificacao("Você não possui permissão de edição para este curso");
        }
    } catch (error) {
        console.error(error);
    }
}

function copiarCurso(id) {
    const url = `/cursos/gerenciar/pesquisa/${id}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar cursos');
            }
            return response.json();
            
        })
        .then(data => {
            localStorage.setItem('copiaCurso', JSON.stringify(data));
            window.location.href='/cursos/novo'
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao buscar os cursos');
    });
}

function visualizarCurso(id) {
    const url = `/cursos/gerenciar/pesquisa/${id}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar cursos');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('cursoData', JSON.stringify(data));
            window.location.href='/cursos/ver'
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao buscar os cursos');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const botaoDownload = document.getElementById("download");
    botaoDownload.addEventListener("click", async function(event) {
        const cursos = JSON.parse(sessionStorage.getItem('resultadosCursos'));
        let csvContent = "Nome,Código,Carga,Habilitação,Área,UCs\n";

        cursos.forEach(curso => {
            const ucsFormatadas = (curso.ucs || [])
                .map(uc => `${uc.nome} (${uc.horasAula}h)`)
                .join(" | ");
            const linha = [
                curso.nome || '',
                curso.codigo || '',
                curso.carga || '',
                curso.habilitacao || '',
                curso.area || '',
                `"${ucsFormatadas}"`
            ].join(",");
            csvContent += linha + "\n";
        });

        const bom = '\uFEFF';
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "cursos.csv");
            link.style.visibility = 'hidden';
                       link.click();
            document.body.removeChild(link);
        }
    });
});

function exibirNotificacao(mensagem) {
    const notificacao = document.getElementById('notificacao');
    notificacao.textContent = mensagem;
    notificacao.classList.remove('oculto');

    setTimeout(() => {
        notificacao.classList.add('oculto');
    }, 1500);
}


listarCursos();
