const itensPorPagina = 40;
window.paginaAtual = 1;
window.totalPaginas = 1;

async function listar(turmas){
    const response2 = await fetch('/cursos/gerenciar');
    const cursos = await response2.json();
    cursos.sort((a, b) => a.nome.localeCompare(b.nome));
    sessionStorage.setItem('resultadosCursos', JSON.stringify(cursos));
    const tbody = document.getElementById('turmas').querySelector('tbody');
    tbody.innerHTML = ''; 
    const userArea = await verificaUserAtual();
    turmas.forEach(turma => {
        const tr = document.createElement('tr');
        let datainicio=new Date(turma.data_inicio);
        let datafim=new Date(turma.data_fim);
        datainicio.setHours(datainicio.getHours()+3);
        datafim.setHours(datafim.getHours()+3);
        let gerenciarOpacity;
        let gerenciarIcon;
        let edicaoOpacity;
        let edicaoIcons;
        let turmaStatus;
        const mapCurso = cursos.filter(curso =>{
            return curso._id===turma.curso;
        });
        if(turma.codigo==='Indefinido'){
            if(mapCurso[0].area === userArea[0] || userArea[1]==='Orientador' || userArea[1]==='Monitor'){
                gerenciarOpacity=0.2;
                gerenciarIcon="disabled";
                edicaoOpacity=1;
                edicaoIcons="";
            }else{
                gerenciarOpacity=0.2;
                gerenciarIcon="disabled";
                edicaoOpacity=0.2;
                edicaoIcons="disabled";
            }
        }else{
            if(userArea[1]==='Orientador' || userArea[1]==='Monitor' || (userArea[1]==='Facilitador' && mapCurso[0].area === userArea[0])){
                gerenciarOpacity=1;
                gerenciarIcon="";
                edicaoOpacity=0.2;
                edicaoIcons="disabled";
            }else{
                gerenciarOpacity=0.2;
                gerenciarIcon="disabled";
                edicaoOpacity=0.2;
                edicaoIcons="disabled";
            }
        }
        if(turma.status==="Cancelado" || turma.status==="Concluído"){
            gerenciarOpacity=0.2;
            gerenciarIcon="disabled";
            edicaoOpacity=0.2;
            edicaoIcons="disabled";
        }
        if(userArea[1]==='Administrador'){
            gerenciarOpacity=1;
            gerenciarIcon="";
            edicaoOpacity=1;
            edicaoIcons="";
        }
        if(turma.status==="Ativo"){
            turmaStatus="<td><div class='status' id='ativo'>Ativo</div> </td>";
        }
        else if(turma.status==="Concluído"){
            turmaStatus="<td> <div class='status' id='concluido'>Concluído</div> </td>";
        }
        else if(turma.status==="Cancelado"){
            turmaStatus="<td> <div class='status' id='cancelado'>Cancelado</div> </td>";
        }else{
            turmaStatus="<td> <div class='status' id='provisorio'>Provisório</div> </td>";
        }
        tr.innerHTML = `
            <td class="buttons">
                            <button title="Editar" onclick="editarTurma('${turma._id.toString()}')" ${edicaoIcons}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" opacity=${edicaoOpacity} xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5ZM1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8Z" fill="var(--cor-primaria)"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4C8.19503 4 8.37225 4.1134 8.45398 4.29047L11.454 10.7905C11.4843 10.8562 11.5 10.9276 11.5 11V13.2C11.5 13.4761 11.2761 13.7 11 13.7C10.7239 13.7 10.5 13.4761 10.5 13.2V11.1098L8 5.69315L5.5 11.1098V13.2C5.5 13.4761 5.27614 13.7 5 13.7C4.72386 13.7 4.5 13.4761 4.5 13.2V11C4.5 10.9276 4.5157 10.8562 4.54602 10.7905L7.54602 4.29047C7.62775 4.1134 7.80497 4 8 4Z" fill="var(--cor-primaria)"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 11C9.23478 11 8.98043 11.1054 8.79289 11.2929C8.60536 11.4804 8.5 11.7348 8.5 12C8.5 12.2761 8.27614 12.5 8 12.5C7.72386 12.5 7.5 12.2761 7.5 12C7.5 11.4696 7.71071 10.9609 8.08579 10.5858C8.46086 10.2107 8.96957 10 9.5 10C10.0304 10 10.5391 10.2107 10.9142 10.5858C11.2893 10.9609 11.5 11.4696 11.5 12C11.5 12.2761 11.2761 12.5 11 12.5C10.7239 12.5 10.5 12.2761 10.5 12C10.5 11.7348 10.3946 11.4804 10.2071 11.2929C10.0196 11.1054 9.76522 11 9.5 11Z" fill="var(--cor-primaria)"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.08579 10.5858C5.46086 10.2107 5.96957 10 6.5 10C7.03043 10 7.53914 10.2107 7.91421 10.5858C8.28929 10.9609 8.5 11.4696 8.5 12V14C8.5 14.2761 8.27614 14.5 8 14.5C7.72386 14.5 7.5 14.2761 7.5 14V12C7.5 11.7348 7.39464 11.4804 7.20711 11.2929C7.01957 11.1054 6.76522 11 6.5 11C6.23478 11 5.98043 11.1054 5.79289 11.2929C5.60536 11.4804 5.5 11.7348 5.5 12C5.5 12.2761 5.27614 12.5 5 12.5C4.72386 12.5 4.5 12.2761 4.5 12C4.5 11.4696 4.71071 10.9609 5.08579 10.5858Z" fill="var(--cor-primaria)"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.88745 8C5.88745 7.72386 6.11131 7.5 6.38745 7.5H9.61245C9.88859 7.5 10.1125 7.72386 10.1125 8C10.1125 8.27614 9.88859 8.5 9.61245 8.5H6.38745C6.11131 8.5 5.88745 8.27614 5.88745 8Z" fill="var(--cor-primaria)"/>
                                </svg>
                            </button>
                            <button title="Codificar" onclick="codificarTurma('${turma._id.toString()}','${turma.nome}','${datainicio.toLocaleDateString("pt-BR")}')" ${edicaoIcons}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" opacity=${edicaoOpacity} xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.7804 2.07686C10.0044 1.92252 9.20017 2.00173 8.46927 2.30448C7.73836 2.60723 7.11365 3.11992 6.67412 3.77772C6.2346 4.43552 6 5.20888 6 6V6.00188H6C5.99808 6.51074 6.09593 7.01505 6.28801 7.48627C6.36396 7.67259 6.32083 7.88628 6.17855 8.02856L2.5 11.7071V13.5H4V12.5C4 12.2239 4.22386 12 4.5 12H5.5V11C5.5 10.7239 5.72386 10.5 6 10.5H7.29289L7.97145 9.82145L8.325 10.175L8.51373 9.71199C8.98495 9.90407 9.48926 10.0019 9.99812 10L10 10C10.7911 10 11.5645 9.76541 12.2223 9.32588C12.8801 8.88636 13.3928 8.26164 13.6955 7.53074C13.9983 6.79983 14.0775 5.99557 13.9231 5.21964C13.7688 4.44372 13.3878 3.73099 12.8284 3.17158C12.269 2.61216 11.5563 2.2312 10.7804 2.07686ZM8.45267 10.7544L7.85355 11.3536C7.75979 11.4473 7.63261 11.5 7.5 11.5H6.5V12.5C6.5 12.7761 6.27614 13 6 13H5V14C5 14.2761 4.77614 14.5 4.5 14.5H2C1.72386 14.5 1.5 14.2761 1.5 14V11.5C1.5 11.3674 1.55268 11.2402 1.64645 11.1464L5.24556 7.54734C5.08127 7.04849 4.99812 6.52573 5 5.99908C5.00018 5.01049 5.29342 4.04414 5.84265 3.22215C6.39206 2.39991 7.17295 1.75904 8.08658 1.3806C9.00021 1.00217 10.0055 0.90315 10.9755 1.09608C11.9454 1.289 12.8363 1.76521 13.5355 2.46447C14.2348 3.16373 14.711 4.05465 14.9039 5.02455C15.0969 5.99446 14.9978 6.99979 14.6194 7.91342C14.241 8.82705 13.6001 9.60794 12.7779 10.1574C11.9559 10.7066 10.9895 10.9998 10.0009 11C10.0006 11 10.0003 11 10 11V10.5L10.0019 11C10.0016 11 10.0013 11 10.0009 11C9.47428 11.0019 8.95151 10.9187 8.45267 10.7544Z" fill="var(--cor-primaria)"/>
                                    <path d="M11.25 5.5C11.6642 5.5 12 5.16421 12 4.75C12 4.33579 11.6642 4 11.25 4C10.8358 4 10.5 4.33579 10.5 4.75C10.5 5.16421 10.8358 5.5 11.25 5.5Z" fill="var(--cor-primaria)"/>
                                </svg>      
                            </button>
                            <button title="Gerenciar" onclick="gerenciarTurma('${turma._id.toString()}','${turma.nome}', '${turma.codigo}')" ${gerenciarIcon}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" opacity="${gerenciarOpacity}" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 5.5C6.61929 5.5 5.5 6.61929 5.5 8C5.5 9.38071 6.61929 10.5 8 10.5C9.38071 10.5 10.5 9.38071 10.5 8C10.5 6.61929 9.38071 5.5 8 5.5ZM4.5 8C4.5 6.067 6.067 4.5 8 4.5C9.933 4.5 11.5 6.067 11.5 8C11.5 9.933 9.933 11.5 8 11.5C6.067 11.5 4.5 9.933 4.5 8Z" fill="var(--cor-primaria)"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.85892 1.33042C5.99624 1.28609 6.14603 1.30326 6.26977 1.3775L7.73132 2.25443C7.91047 2.24643 8.08989 2.24643 8.26904 2.25445L9.72452 1.38345C9.84724 1.31001 9.99553 1.29264 10.1319 1.33572C11.087 1.63749 11.9652 2.14323 12.7056 2.81794C12.8117 2.91466 12.8711 3.05234 12.8687 3.19591L12.8401 4.89481C12.9388 5.04637 13.0294 5.20308 13.1114 5.36426L14.593 6.188C14.7177 
                                6.25736 14.8069 6.37673 14.838 6.51604C15.056 7.49234 15.0583 8.50445 14.8447 9.48173C14.814 9.62223 14.7243 9.74271 14.5985 9.81239L13.1112 10.6361C13.0292 10.7972 12.9387 10.9537 12.8401 11.1052L12.8687 12.8041C12.8711 12.9477 12.8117 13.0853 12.7055 13.1821C11.9667 13.8553 11.0923 14.3625 10.1411 14.6696C10.0038 14.7139 9.85401 14.6967 9.73027 14.6225L8.26872 13.7456C8.08957 13.7536 7.91015 13.7536 7.731 13.7455L6.27552 14.6165C6.1528 14.69 6.00451 14.7074 5.86814 14.6643C4.91299 14.3625 4.03484 13.8568 3.29448 13.1821C3.18834 13.0853 3.12891 12.9476 3.13134 12.8041L3.15997 11.109C3.06186 10.9559 2.97139 10.798 2.8889 10.6359L1.40705 9.81199C1.2823 9.74263 1.19314 9.62326 1.16203 9.48395C0.944054 8.50765 0.941754 7.49554 1.15529 6.51826C1.18599 6.37776 1.27571 6.25728 1.40152 6.1876L2.88884 5.36385C2.97083 5.20281 3.06133 5.04624 3.15994 4.89481L3.13134 3.19591C3.12892 3.05233 3.18835 2.91464 3.29449 2.81792C4.0333 2.14469 4.90771 1.63748 5.85892 1.33042ZM4.13509 3.41041L4.16245 5.03533C4.16422 5.1406 4.13272 5.24374 4.07243 5.33006C3.93832 5.52206 3.8209 5.72521 3.72148 5.93726C3.67678 6.03259 3.60312 6.11138 3.51102 6.16239L2.08886 6.95005C1.96446 7.64456 1.96619 8.35583 2.09396 9.04973L3.51173 9.838C3.60314 9.88882 3.67631 9.96703 3.72095 10.0616C3.82256 10.2769 3.94107 10.4839 4.07537 10.6804C4.13377 10.7659 4.1642 10.8674 4.16245 10.9709L4.13511 12.5895C4.67554 13.0461 5.29356 13.4019 5.95972 13.6401L7.34952 12.8085C7.43754 12.7558 7.53963 12.7315 7.64194 12.7388C7.88035 12.7558 8.11968 12.7558 8.35809 12.7388C8.46061 12.7314 8.56289 12.7559 8.65102 12.8088L10.0453 13.6453C10.7093 13.4033 11.3253 13.0459 11.8649 12.5896L11.8376 10.9647C11.8358 10.8594 11.8673 10.7562 11.9276 10.6699C12.0617 10.4779 12.1791 10.2748 12.2786 10.0627C12.3233 9.9674 12.3969 9.88861 12.489 9.8376L13.9112 9.04994C14.0356 8.35543 14.0338 7.64416 13.9061 6.95026L12.4883 6.16199C12.3965 6.11097 12.3231 6.03234 12.2786 5.93726C12.1791 5.72521 12.0617 5.52206 11.9276 5.33006C11.8673 5.24374 11.8358 5.1406 11.8376 5.03533L11.8649 3.41048C11.3245 2.95393 10.7065 2.59807 10.0403 2.35985L8.65052 3.19154C8.5625 3.24421 8.46041 3.26854 8.35809 3.26122C8.11968 3.24417 7.88035 3.24417 7.64194 3.26122C7.53943 3.26855 7.43715 3.24412 7.34902 3.19124L5.95474 2.35468C5.29076 2.59667 4.67473 2.95409 4.13509 3.41041Z" fill="var(--cor-primaria)"/>
                                </svg>
                            </button>
                            <button title="Visualizar" onclick="visualizarTurma('${turma._id.toString()}')">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.27145 5.39645C3.46336 4.20453 5.33371 3 8 3C10.6663 3 12.5366 4.20453 13.7286 5.39645C14.3231 5.99096 14.7518 6.58461 15.0325 7.03047C15.1731 7.25379 15.2773 7.44117 15.3472 7.57464C15.3822 7.64141 15.4086 7.69479 15.4268 7.73255C15.4359 7.75144 15.4429 7.76643 15.4479 7.77725L15.4539 7.79032L15.4558 7.79445L15.4564 7.7959L15.4567 7.79646C15.4568 7.79671 15.4569 7.79693 15 8C15.4569 8.20307 15.4568 8.20329 15.4567 8.20354L15.4564 8.2041L15.4558 8.20555L15.4539 8.20968L15.4479 8.22275C15.4429 8.23357 15.4359 8.24856 15.4268 8.26745C15.4086 8.30521 15.3822 8.35859 15.3472 8.42536C15.2773 8.55883 15.1731 8.74621 15.0325 8.96953C14.7518 9.41539 14.3231 10.009 13.7286 10.6036C12.5366 11.7955 10.6663 13 8 13C5.33371 13 3.46336 11.7955 2.27145 10.6036C1.67693 10.009 1.24824 9.41539 0.967509 8.96953C0.826899 8.74621 0.722698 8.55883 0.652787 8.42536C0.617813 8.35859 0.591364 8.30521 0.573181 8.26745C0.564087 8.24856 0.557055 8.23357 0.552053 8.22275L0.546066 8.20968L0.544205 8.20555L0.543556 8.2041L0.543302 8.20354C0.543194 8.20329 0.543094 8.20307 1 8C0.543094 7.79693 0.543194 7.79671 0.543302 7.79646L0.543556 7.7959L0.544205 7.79445L0.546066 7.79032L0.552053 7.77725C0.557055 7.76643 0.564087 7.75144 0.573181 7.73255C0.591364 7.69479 0.617813 7.64141 0.652787 7.57464C0.722698 7.44117 0.826899 7.25379 0.967509 7.03047C1.24824 6.58461 1.67693 5.99096 2.27145 5.39645ZM1 8L0.543094 7.79693C0.485635 7.92621 0.485635 8.07379 0.543094 8.20307L1 8ZM1.55906 8C1.61788 8.11018 1.70235 8.25981 1.81374 8.43672C2.06426 8.83461 2.44807 9.36596 2.97855 9.89645C4.03664 10.9545 5.66629 12 8 12C10.3337 12 11.9634 10.9545 13.0214 9.89645C13.5519 9.36596 13.9357 8.83461 14.1863 8.43672C14.2976 8.25981 14.3821 8.11018 14.4409 8C14.3821 7.88982 14.2976 7.74019 14.1863 7.56328C13.9357 7.16539 13.5519 6.63404 13.0214 6.10355C11.9634 5.04547 10.3337 4 8 4C5.66629 4 4.03664 5.04547 2.97855 6.10355C2.44807 6.63404 2.06426 7.16539 1.81374 7.56328C1.70235 7.74019 1.61788 7.88982 1.55906 8ZM15 8L15.4569 8.20307C15.5144 8.07379 15.5144 7.92621 15.4569 7.79693L15 8Z" fill="var(--cor-primaria)"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6ZM5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8Z" fill="var(--cor-primaria)"/>
                                </svg>
                            </button>

            </td>
            <td>${turma.nome}</td>
            <td>${turma.codigo}</td>
            <td>${mapCurso[0].nome}</td>
            <td>${turma.modulo}</td>
            <td>${datainicio.toLocaleDateString("pt-BR")}</td>
            <td>${datafim.toLocaleDateString("pt-BR")}</td>
            ${turmaStatus}
        `;
        tbody.appendChild(tr);
    });
}

async function verificaUserAtual() {
    try {
        const response = await fetch('/conta/preencher', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Erro ao obter usuário');
        }
        const data = await response.json();
        const areaUserAtual = data.usuario.area;
        const funcaoUserAtual = data.usuario.funcao;
        return [areaUserAtual, funcaoUserAtual];
    }catch (error) {
        console.error(error);
    }
}

async function listarTurmas() {
    const response = await fetch('/turmas/gerenciar');
    const turmas = await response.json();
    turmas.sort((a, b) => a.nome.trim().localeCompare(b.nome.trim()));
    sessionStorage.setItem('resultadosTurmas', JSON.stringify(turmas));
    window.totalPaginas = Math.ceil(turmas.length / itensPorPagina);
    renderizarPagina(1);
}

document.addEventListener("DOMContentLoaded", () => {
    const inputPesquisa = document.getElementById("pesquisa");
    const botaoPesquisa = document.getElementById("pesquisar-btn");
    const tbody = document.getElementById('turmas').querySelector('tbody');
  
    const realizarPesquisa = async () => {
        const termo = inputPesquisa.value.trim(); 
        tbody.innerHTML = '';
        if (!termo) {
            return listarTurmas();
        }
        try {
            const response = await fetch(`/turmas/gerenciar/pesquisa/${termo}`);
            if (!response.ok) {
                tbody.innerHTML = '';
            }
            const resultados = await response.json();
            resultados.sort((a, b) => a.nome.localeCompare(b.nome));
            sessionStorage.setItem('resultadosTurmas', JSON.stringify(resultados));
            tbody.innerHTML = '';
            window.totalPaginas = Math.ceil(resultados.length / itensPorPagina);
            renderizarPagina(1);
        } catch (error) {
            console.error("Erro durante a pesquisa:", error);
        }
    };
    botaoPesquisa.addEventListener("click", realizarPesquisa);
    inputPesquisa.addEventListener("input", realizarPesquisa);
});

document.addEventListener("DOMContentLoaded", async () => {
    const botaoFiltros = document.getElementById("filtros-btn");
    const filtrarDiv = document.getElementById('filtrar');
    async function abrirFiltros(){
        filtrarDiv.innerHTML = `
        <div class="filtragem">
            <form id="form-filtrar">
                <div class="bloco">
                    <label for="datainicial">Data inicial:</label>
                    <input type="date" id="datainicial" placeholder=""/>
                </div>
                <div class="bloco">
                    <label for="datafinal">Data final:</label>
                    <input type="date" id="datafinal" placeholder=""/>
                </div>
                <div class="bloco">
                    <label for="status">Status:</label>
                    <select id="status">
                        <option value="">Selecione</option>  
                        <option value="Ativo">Ativo</option>
                        <option value="Provisório">Provisório</option>
                        <option value="Cancelado">Cancelado</option>
                        <option value="Concluído">Concluído</option>
                    </select>
                </div>
                <div class="bloco">
                    <label for="turno">Turno</label>
                    <select id="turno" name="turno">   
                        <option value="">Selecione</option>                             
                        <option value="Matutino">Matutino</option>
                        <option value="Vespertino">Vespertino</option>
                        <option value="Noturno">Noturno</option>
                        <option value="Integral">Integral</option>
                        <option value="EAD">100% EAD</option>
                    </select>
                </div>
                <div class="bloco">
                    <label for="curso">Curso</label>
                    <select id="curso" name="curso">   
                        <option value="">Selecione</option>                             
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
        const selectCursos=document.querySelector("#curso");
        const responseCursos = await fetch('/cursos/gerenciar');
        const cursos = await responseCursos.json();
        cursos.sort((a, b) => a.nome.localeCompare(b.nome));
        cursos.forEach(curso =>{
            const option = document.createElement("option");
            option.value = `${curso._id}`;
            option.textContent = `${curso.nome}`;
            selectCursos.appendChild(option);
        });
        botaoFiltrar.addEventListener("submit", async function(event) {
            event.preventDefault();
            
            const datainicial= document.getElementById("datainicial")?.value.trim();
            const datafinal= document.getElementById("datafinal")?.value.trim();
            const status= document.getElementById("status")?.value.trim();
            const turno= document.getElementById("turno")?.value.trim();
            const curso= document.getElementById("curso")?.value.trim();

            const params = new URLSearchParams();
            if (datainicial) params.append('datainicial', datainicial);
            if (datafinal) params.append('datafinal', datafinal);
            if (status) params.append('status', status);
            if (turno) params.append('turno', turno);
            if (curso) params.append('curso', curso);

            const tbody = document.getElementById('turmas').querySelector('tbody');

            tbody.innerHTML = '';
            if(curso==="" && status==="" && turno==="" && datafinal==="" && datainicial===""){
                return listarTurmas();
            }else{
                try {
                    const response = await fetch(`/turmas/gerenciar/filtrar?${params.toString()}`);
                    if (!response.ok) {
                        tbody.innerHTML = 'Nenhuma turma encontrada';
                    }
                    const resultados = await response.json();
                    resultados.sort((a, b) => a.nome.localeCompare(b.nome));
                    sessionStorage.setItem('resultadosTurmas', JSON.stringify(resultados));
                    tbody.innerHTML = '';
                    window.totalPaginas = Math.ceil(resultados.length / itensPorPagina);
                    renderizarPagina(1);
                } catch (error) {
                    console.error("Erro durante a pesquisa:", error);
                }
                fecharFiltros();
            }
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

function editarTurma(id) {
    const url = `/turmas/gerenciar/pesquisa/${id}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar turmas');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('turmaData', JSON.stringify(data));
            window.location.href='/turmas/editar'
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao buscar as turmas');
    });
}

function visualizarTurma(id) {
    const url = `/turmas/gerenciar/pesquisa/${id}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar turmas');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('turmaData', JSON.stringify(data));
            window.location.href='/turmas/ver'
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao buscar as turmas');
    });
}

function codificarTurma(id, nomeTurma, dataInicio) {
    const codificarDiv = document.getElementById('codificar');
    const corpo=document.querySelector('.corpo');
    const menuicon=document.querySelector('.menu-icon');
    corpo.classList.add("blur");
    menuicon.classList.add("blur");
    codificarDiv.innerHTML = `
        <p>Ao codificar uma turma, você confirma seu início e impede sua edição e exclusão. Se desejar prosseguir, utilize o código registrado no SGE.</p>
        <p><strong>Nome da turma:</strong><br> ${nomeTurma}</p>
        <p><strong>Data de início:</strong><br> ${dataInicio}</p>
        <label for="codigo">Código da turma:</label><br>
        <input type="text" id="codigo" placeholder="Exemplo: XXX-M-000001/2026" />
        <div class="btn-container">
            <button class="btn-back" onclick="fecharCodificar()">Voltar</button>
            <button class="btn-confirm" id="codifyClass" onclick="confirmarTurma('${id}')">Confirmar turma</button>
        </div>
    `;
    codificarDiv.hidden = false;
    
    const input = document.getElementById("codigo");

    input.addEventListener("input", function () {
        let valor = this.value.toUpperCase();

        valor = valor.replace(/[^A-Z0-9]/g, "");

        let letras = valor.replace(/[0-9]/g, "");
        let numeros = valor.replace(/[A-Z]/g, "");

        let parte1 = letras.substring(0,3);
        let parte2 = letras.substring(3,4);
        let parte3 = numeros.substring(0,6);
        let parte4 = numeros.substring(6,10);

        let resultado = "";

        if (parte1) resultado += parte1;
        if (parte2) resultado += "-" + parte2;
        if (parte3) resultado += "-" + parte3;
        if (parte4) resultado += "/" + parte4;

        this.value = resultado;
    });
}

function fecharCodificar() {
    const codificarDiv = document.getElementById('codificar');
    const corpo=document.querySelector('.corpo');
    const menuicon=document.querySelector('.menu-icon');
    corpo.classList.remove("blur");
    menuicon.classList.remove("blur");
    codificarDiv.hidden = true;
    codificarDiv.innerHTML = ''; 
}

function confirmarTurma(id) {
    const botaoConfirmar = document.getElementById('codifyClass');
    botaoConfirmar.setAttribute('disabled', 'disabled');
    const codigo = document.getElementById('codigo').value;
    if (!codigo) {
        alert('Por favor, insira o código da turma.');
        return;
    }
    const url = `/turmas/gerenciar/codificar/${id}`;
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo, status:'Ativo' }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao codificar a turma');
            }
            return response.json();
        })
        .then(data => {
            exibirNotificacao('Turma codificada com sucesso!');
            setTimeout(() => {
                window.location.href = '/turmas';
            }, 1500);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao codificar a turma.');
        });

    fecharCodificar();
}

function gerenciarTurma(id, nomeTurma, codigoTurma) {
    const gerenciarDiv = document.getElementById('gerenciar');
    const corpo=document.querySelector('.corpo');
    const menuicon=document.querySelector('.menu-icon');
    corpo.classList.add("blur");
    menuicon.classList.add("blur");
    gerenciarDiv.innerHTML = `
        <p>Ao <strong>cancelar</strong> uma turma, todos os turmas dos técnicos de ensino, salas e veículos relacionados a essa turma serão removidos.<br>
        <br>Ao <strong>concluir</strong> uma turma, seu status será alterado para “concluído”, impossibilitando novos turmas para a turma e removendo qualquer agendamento posterior a data de conclusão.</p>
        <p><strong>Nome da turma:</strong><br> ${nomeTurma}</p>
        <p><strong>Código da turma:</strong><br> ${codigoTurma}</p>
        <div class="btn-container">
            <button class="btn-back" onclick="fecharGerenciar()">Voltar</button>
            <button class="btn-cancela" id="cancelClass" onclick="cancelaTurma('${id}','${codigoTurma}')">Cancelar turma</button>
            <button class="btn-conclui" id="closeClass" onclick="concluiTurma('${id}','${codigoTurma}')">Concluir turma</button>
        </div>
    `;
    gerenciarDiv.hidden = false;
}

function fecharGerenciar() {
    const gerenciarDiv = document.getElementById('gerenciar');
    const corpo=document.querySelector('.corpo');
    const menuicon=document.querySelector('.menu-icon');
    corpo.classList.remove("blur");
    menuicon.classList.remove("blur");
    gerenciarDiv.hidden = true;
    gerenciarDiv.innerHTML = ''; 
}

function cancelaTurma(id, codigo) {
    const botaoCancela = document.getElementById('cancelClass');
    botaoCancela.setAttribute('disabled', 'disabled');
    const botaoFecha = document.getElementById('closeClass');
    botaoFecha.setAttribute('disabled', 'disabled');
    const url = `/turmas/gerenciar/cancelar/${id}`;
    const confirmarCancelamento = window.confirm('Tem certeza de que deseja cancelar esta turma? Essa ação não pode ser desfeita.');
    if(confirmarCancelamento){
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ codigo, status:'Cancelado' }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao cancelar a turma');
                }
                return response.json();
            })
            .then(data => {
                exibirNotificacao('Turma cancelada com sucesso!');
                setTimeout(() => {
                    window.location.href = '/turmas';
                }, 2000);
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao cancelar a turma.');
            });
    }else{
        window.location.href = '/turmas'; 
    }
    fecharCodificar();
}

function concluiTurma(id, codigo) {
    const botaoCancela = document.getElementById('cancelClass');
    botaoCancela.setAttribute('disabled', 'disabled');
    const botaoFecha = document.getElementById('closeClass');
    botaoFecha.setAttribute('disabled', 'disabled');
    const url = `/turmas/gerenciar/concluir/${id}`;
    const confirmarConclusao = window.confirm('Tem certeza de que deseja concluir esta turma? Essa ação não pode ser desfeita.');
    if(confirmarConclusao){
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo, status:'Concluído' }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao concluir a turma');
            }
            return response.json();
        })
        .then(data => {
            exibirNotificacao('Turma concluída com sucesso!');
            setTimeout(() => {
                window.location.href = '/turmas';
            }, 2000);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao concluir a turma.');
        });
    }else{
        window.location.href = '/turmas'; 
    }
    fecharCodificar();
}

document.addEventListener("DOMContentLoaded", () => {
    const botaoDownload = document.getElementById("download");
    botaoDownload.addEventListener("click", async function(event) {
        const turmas=JSON.parse(sessionStorage.getItem('resultadosTurmas'));
        const cursos=JSON.parse(sessionStorage.getItem('resultadosCursos'));
        let csvContent = "Nome,Código,Curso,Módulo,Origem,Turno,Data Início,Data Fim,Observações,Status\n";
        turmas.forEach(turma =>{
            const cursoObj = cursos.find(curso => curso._id === turma.curso || curso.codigo === turma.curso);
            const nomeCurso = cursoObj ? cursoObj.nome : '';
            const linha = [
                turma.nome || '',
                turma.codigo || '',
                nomeCurso || '',
                turma.modulo || '',
                turma.origem || '',
                turma.turno || '',
                turma.data_inicio || '',
                turma.data_fim || '',
                turma.observacoes || '',
                turma.status || ''
            ].join(",");
            csvContent += linha + "\n";
        });
        const bom = '\uFEFF';
        const blob = new Blob([bom+csvContent], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "turmas.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
});

function renderizarPagina(pagina) {
    const turmas = JSON.parse(sessionStorage.getItem('resultadosTurmas')) || [];
    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const turmasPaginados = turmas.slice(inicio, fim);
    listar(turmasPaginados); 
    renderizarPaginacao(pagina, window.totalPaginas);
}

function renderizarPaginacao(paginaAtual, totalPaginas) {
    const container = document.getElementById('paginacao');
    container.innerHTML = '';
    const maxBotoes = 5;
    let inicio, fim;
    if (totalPaginas <= maxBotoes) {
        inicio = 1;
        fim = totalPaginas;
    } else if (paginaAtual <= 3) {
        inicio = 1;
        fim = maxBotoes;
    } else if (paginaAtual >= totalPaginas - 2) {
        inicio = totalPaginas - (maxBotoes - 1);
        fim = totalPaginas;
    } else {
        inicio = paginaAtual - 2;
        fim = paginaAtual + 2;
    }
    const criarBotao = (texto, paginaDestino, desativado = false, ativo = false) => {
        const btn = document.createElement('button');
        btn.textContent = texto;
        if (ativo) {
            btn.setAttribute('meio', '');
        }
        if (desativado) {
            btn.disabled = true;
        } else {
            btn.addEventListener('click', () => {
                if (paginaDestino >= 1 && paginaDestino <= totalPaginas) {
                    window.paginaAtual = paginaDestino;
                    renderizarPagina(paginaDestino);
                }
            });
        }
        return btn;
    };
    container.appendChild(criarBotao('Anterior',paginaAtual - 1,paginaAtual === 1));
    for (let i = inicio; i <= fim; i++) {
        container.appendChild(criarBotao(i,i,false,i === paginaAtual));
    }
    container.appendChild(criarBotao('Próximo',paginaAtual + 1,paginaAtual === totalPaginas));
}

function exibirNotificacao(mensagem) {
    const notificacao = document.getElementById('notificacao');
    notificacao.textContent = mensagem;
    notificacao.classList.remove('oculto');

    setTimeout(() => {
        notificacao.classList.add('oculto');
    }, 1500);
}

listarTurmas()