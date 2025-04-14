// chat-functions.js - Versão corrigida

// CONFIGURAÇÕES INICIAIS
let chatUpdateInterval = null;

// Criar ou verificar a estrutura do modal chat
function criarModalChat() {
    // Verificar se o modal já existe na página
    if (document.getElementById('chatModal')) return;

    // Criar elemento do modal
    const chatModal = document.createElement('div');
    chatModal.id = 'chatModal';
    chatModal.className = 'modal';

    chatModal.innerHTML = `
    <div class="modal-content chat-modal">
        <div class="chat-header">
            <h3>Chat</h3>
            <span class="close" onclick="fecharChat()">&times;</span>
        </div>
        <div class="chat-body">
            <div id="chatMessages" class="chat-messages"></div>
        </div>
        <div class="chat-footer">
            <input type="text" id="chatMessageInput" placeholder="Digite sua mensagem...">
            <button onclick="enviarMensagemChat()">Enviar</button>
        </div>
    </div>
    `;

    document.body.appendChild(chatModal);
}

// FUNÇÕES PRINCIPAIS
window.abrirChat = function (solicitacaoId) {
    if (!solicitacaoId) {
        console.error('ID de solicitação inválido');
        return;
    }

    // Criar modal se não existir
    criarModalChat();

    // Armazenar ID da solicitação atual
    localStorage.setItem('chatSolicitacaoId', solicitacaoId);

    // Exibir modal
    const chatModal = document.getElementById('chatModal');
    if (chatModal) {
        chatModal.style.display = 'block';

        // Carregar mensagens
        carregarChat();

        // Configurar atualização periódica
        if (chatUpdateInterval) clearInterval(chatUpdateInterval);
        chatUpdateInterval = setInterval(verificarNovasMensagens, 2000);

        // Configurar evento Enter para enviar mensagem
        const inputField = document.getElementById('chatMessageInput');
        if (inputField) {
            inputField.focus();

            // Remover listeners antigos para evitar duplicação
            const newInput = inputField.cloneNode(true);
            inputField.parentNode.replaceChild(newInput, inputField);

            // Adicionar novo listener
            newInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    enviarMensagemChat();
                    e.preventDefault();
                }
            });
        }
    }
};

window.fecharChat = function () {
    localStorage.removeItem('chatSolicitacaoId');
    const chatModal = document.getElementById('chatModal');
    if (chatModal) chatModal.style.display = 'none';

    if (chatUpdateInterval) {
        clearInterval(chatUpdateInterval);
        chatUpdateInterval = null;
    }
};

// Carregar dados do chat
function carregarChat() {
    const solicitacaoId = localStorage.getItem('chatSolicitacaoId');
    if (!solicitacaoId) return;

    try {
        // Obter solicitação
        const solicitacoes =
            JSON.parse(localStorage.getItem('solicitacoes')) || [];
        const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

        if (!solicitacao) {
            console.error('Solicitação não encontrada:', solicitacaoId);
            return;
        }

        // Inicializar array de mensagens se não existir
        if (!solicitacao.mensagens) {
            solicitacao.mensagens = [];

            // Atualizar no localStorage
            const index = solicitacoes.findIndex((s) => s.id === solicitacaoId);
            if (index !== -1) {
                solicitacoes[index] = solicitacao;
                localStorage.setItem(
                    'solicitacoes',
                    JSON.stringify(solicitacoes)
                );
            }
        }

        // Atualizar cabeçalho do chat
        atualizarCabecalhoChat(solicitacao);

        // Renderizar mensagens
        renderizarMensagens(solicitacao);

        // Marcar mensagens como lidas
        marcarMensagensComoLidas(solicitacao);
    } catch (error) {
        console.error('Erro ao carregar chat:', error);
    }
}

// Atualizar cabeçalho do chat com informações do veículo
function atualizarCabecalhoChat(solicitacao) {
    const header = document.querySelector('.chat-header h3');
    if (!header) return;

    try {
        const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
        const veiculo = veiculos.find((v) => v.id === solicitacao.veiculoId);

        if (veiculo) {
            header.textContent = `Chat - ${veiculo.marca || ''} ${
                veiculo.modelo || 'Veículo'
            }`;
        } else {
            header.textContent = 'Chat';
        }
    } catch (error) {
        console.error('Erro ao atualizar cabeçalho:', error);
        header.textContent = 'Chat';
    }
}

// Renderizar mensagens do chat
function renderizarMensagens(solicitacao) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    chatMessages.innerHTML = '';

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    // Mostrar mensagem inicial se não houver mensagens
    if (!solicitacao.mensagens || solicitacao.mensagens.length === 0) {
        const msgElement = document.createElement('div');
        msgElement.className = 'message-system';
        msgElement.innerHTML = `<p>Inicie uma conversa com o ${
            usuarioLogado.tipoUsuario === 'locatario' ? 'locador' : 'locatário'
        }.</p>`;
        chatMessages.appendChild(msgElement);
        return;
    }

    // Renderizar cada mensagem
    solicitacao.mensagens.forEach((msg) => {
        const isUsuarioAtual = msg.remetenteId === usuarioLogado.id;

        const msgElement = document.createElement('div');
        msgElement.className = isUsuarioAtual
            ? 'message message-sent'
            : 'message message-received';

        const dataHora = msg.data || msg.dataHora || new Date().toISOString();

        msgElement.innerHTML = `
            <div class="message-content">${msg.texto}</div>
            <div class="message-time">${new Date(dataHora).toLocaleTimeString(
                'pt-BR',
                {
                    hour: '2-digit',
                    minute: '2-digit',
                }
            )}</div>
        `;

        chatMessages.appendChild(msgElement);
    });

    // Rolar para o final do chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Marcar mensagens como lidas
function marcarMensagensComoLidas(solicitacao) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || !solicitacao.mensagens) return;

    let atualizado = false;

    // Marcar mensagens não lidas como lidas
    solicitacao.mensagens.forEach((msg) => {
        if (msg.remetenteId !== usuarioLogado.id && msg.lida === false) {
            msg.lida = true;
            atualizado = true;
        }
    });

    // Salvar no localStorage se houve alteração
    if (atualizado) {
        const solicitacoes =
            JSON.parse(localStorage.getItem('solicitacoes')) || [];
        const index = solicitacoes.findIndex((s) => s.id === solicitacao.id);

        if (index !== -1) {
            solicitacoes[index] = solicitacao;
            localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
        }
    }
}

// Verificar novas mensagens
function verificarNovasMensagens() {
    const solicitacaoId = localStorage.getItem('chatSolicitacaoId');
    if (!solicitacaoId) return;

    try {
        const solicitacoes =
            JSON.parse(localStorage.getItem('solicitacoes')) || [];
        const solicitacao = solicitacoes.find((s) => s.id === solicitacaoId);

        if (solicitacao) {
            carregarChat();
        }
    } catch (error) {
        console.error('Erro ao verificar novas mensagens:', error);
    }
}

// Enviar mensagem
window.enviarMensagemChat = function () {
    const input = document.getElementById('chatMessageInput');
    const texto = input?.value?.trim();

    if (!texto) return;

    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuario) return;

    const solicitacaoId = localStorage.getItem('chatSolicitacaoId');
    if (!solicitacaoId) return;

    try {
        const solicitacoes =
            JSON.parse(localStorage.getItem('solicitacoes')) || [];
        const index = solicitacoes.findIndex((s) => s.id === solicitacaoId);

        if (index === -1) {
            console.error('Solicitação não encontrada');
            return;
        }

        // Inicializar array de mensagens se não existir
        if (!solicitacoes[index].mensagens) {
            solicitacoes[index].mensagens = [];
        }

        // Criar nova mensagem
        const novaMensagem = {
            id: 'msg_' + Date.now(),
            texto,
            remetenteId: usuario.id,
            data: new Date().toISOString(),
            lida: false,
        };

        // Adicionar mensagem
        solicitacoes[index].mensagens.push(novaMensagem);

        // Salvar no localStorage
        localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));

        // Limpar input e atualizar interface
        input.value = '';
        carregarChat();
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
};
