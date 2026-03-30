async function registrarLog(usuarioLogado, acao, idDocumento) {
    try {
        const response = await fetch(`/logs/incluir`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({idDocumento, usuarioLogado, acao})
        });
        const data = await response.json();
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function registrarLogExclusao(usuarioLogado, acao, idDocumento, dadosExcluidos) {
    try {
        const response = await fetch(`/logs/incluirExclusao`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({idDocumento, usuarioLogado, acao, dadosExcluidos})
        });
        const data = await response.json();
    } catch (error) {
        console.error('Erro:', error);
    }
}
