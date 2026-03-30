document.getElementById("addBasico").addEventListener("click", function () {
    const tabelaUCs =document.querySelector("#table-ucs tbody");
    const cargaModulo = [
        { nome: "Introdução a Qualidade e Produtividade", horas: 16, modulo: 1, areaProf:"Automotiva, Automação Industrial, Construção Civil, Eletroeletrônica, Gestão, Metalmecânica, Segurança do Trabalho, Tecnologia da Informação" },
        { nome: "Saúde e Segurança no Trabalho", horas: 12, modulo: 1, areaProf:"Automotiva, Automação Industrial, Construção Civil, Eletroeletrônica, Gestão, Metalmecânica, Segurança do Trabalho, Tecnologia da Informação"  },
        { nome: "Introdução a Indústria 4.0", horas: 24, modulo: 1, areaProf:"Automotiva, Automação Industrial, Construção Civil, Eletroeletrônica, Gestão, Metalmecânica, Segurança do Trabalho, Tecnologia da Informação"  },
        { nome: "Introdução ao Desenvolvimento de Projetos", horas: 12, modulo: 1, areaProf:"Automotiva, Automação Industrial, Construção Civil, Eletroeletrônica, Gestão, Metalmecânica, Segurança do Trabalho, Tecnologia da Informação"  },
        { nome: "Introdução a Tecnologia da Informação e Comunicação", horas: 40, modulo: 1, areaProf:"Automotiva, Automação Industrial, Construção Civil, Eletroeletrônica, Gestão, Metalmecânica, Segurança do Trabalho, Tecnologia da Informação"  },
        { nome: "Sustentabilidade nos Processos Industriais", horas: 8, modulo: 1, areaProf:"Automotiva, Automação Industrial, Construção Civil, Eletroeletrônica, Gestão, Metalmecânica, Segurança do Trabalho, Tecnologia da Informação"  }
    ];
    cargaModulo.forEach(item => {
        const registro = tabelaUCs.insertRow();
        registro.classList.add("uc");
        const registroNome = registro.insertCell();
        const registroHorasAula = registro.insertCell();
        const registroModulo = registro.insertCell();
        const registroArea = registro.insertCell();
        const registroAcao = registro.insertCell();
        registroNome.textContent = item.nome;
        registroHorasAula.textContent = item.horas;
        registroModulo.textContent = item.modulo;
        registroArea.innerHTML=item.areaProf;
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
});

document.getElementById("addBasicoSeed").addEventListener("click", function () {
    const tabelaUCs =document.querySelector("#table-ucs tbody");
    const cargaModulo = [
        { nome: "Introdução a Qualidade e Produtividade e Sustentabilidade nos processos industriais", horas:33, modulo: 1, areaProf:"Automotiva, Automação Industrial, Construção Civil, Eletroeletrônica, Gestão, Metalmecânica, Segurança do Trabalho, Tecnologia da Informação" },
        { nome: "Introdução a Indústria 4.0 e Introdução a Tecnologia da Informação e Comunicação", horas: 33, modulo: 1, areaProf:"Automotiva, Automação Industrial, Construção Civil, Eletroeletrônica, Gestão, Metalmecânica, Segurança do Trabalho, Tecnologia da Informação"  },
        { nome: "Introdução ao Desenvolvimento de Projetos e Saúde e Segurança no Trabalho", horas: 33, modulo: 1, areaProf:"Automotiva, Automação Industrial, Construção Civil, Eletroeletrônica, Gestão, Metalmecânica, Segurança do Trabalho, Tecnologia da Informação"  }
    ];
    cargaModulo.forEach(item => {
        const registro = tabelaUCs.insertRow();
        registro.classList.add("uc");
        const registroNome = registro.insertCell();
        const registroHorasAula = registro.insertCell();
        const registroModulo = registro.insertCell();
        const registroArea = registro.insertCell();
        const registroAcao = registro.insertCell();
        registroNome.textContent = item.nome;
        registroHorasAula.textContent = item.horas;
        registroModulo.textContent = item.modulo;
        registroArea.innerHTML=item.areaProf;
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
});

document.getElementById("addUC").addEventListener("click", function () {
    const nome=document.getElementById("nome-uc").value;
    const horasAula=document.getElementById("horas-aula").value;
    const modulo=document.getElementById("modulo").value;
    const areaProf=document.getElementById('area-prof');
    const areasSelecionadas = Array.from(areaProf.selectedOptions).map(option => option.value);
    const areas = [];
    const tabelaUCs =document.querySelector("#table-ucs tbody");
    if((!nome || !horasAula || !areas || !modulo)){
        alert("Por favor, preencha corretamente todos os campos!")
        return
    }
    else{
        const registro = tabelaUCs.insertRow();
        registro.classList.add("uc");
        const registroNome = registro.insertCell();
        const registroHorasAula = registro.insertCell();
        const registroModulo = registro.insertCell();
        const registroArea = registro.insertCell();
        const registroAcao = registro.insertCell();
        registroNome.textContent = nome;
        registroHorasAula.textContent = horasAula;
        registroModulo.textContent = modulo;
        registroArea.innerHTML=areasSelecionadas.join(", <br>");
        registroArea.classList.add("area-esquerda");
        registroNome.classList.add("area-esquerda");
        const botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover";
        botaoRemover.onclick = function () {
            registro.remove();
        };
        registroAcao.appendChild(botaoRemover);
        registroAcao.classList.add("remove");
        document.getElementById("nome-uc").value="";
        document.getElementById("horas-aula").value="";
        document.getElementById("modulo").value="";
    }
});

function limparUCs() {
    const linhas = document.querySelectorAll("#table-ucs tbody tr");
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

const checkbox = document.getElementById("externo");
const codigo = document.getElementById("codigo");
checkbox.addEventListener("change", (e) => {
    if (checkbox.checked) {
        codigo.value = "EXTERNO";
        codigo.setAttribute('disabled','disabled');
    } else {
        codigo.value = "";
        codigo.removeAttribute('disabled');
    }
});