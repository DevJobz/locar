// Variáveis globais
let map = null;
let tipoFiltroMapa = null;
let markers = [];
const coordenadasCache = {};
let imagensAtuais = [];
let indiceImagemAtual = 0;
let sidebarCollapsed = false;
let veiculoDetalhado = null;
let veiculoSolicitarId = null;
let userLocation = null;
let routingControl = null;
let paginaAtual = 1;
let itensPorPagina = 10;
let totalPaginas = 1;
let veiculosFiltradosGlobal = [];

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// Função unificada para calcular distância
function calcularDistancia(lat1, lon1, lat2, lon2) {
    try {
        // Verificação rigorosa dos parâmetros
        if (
            lat1 === undefined ||
            lon1 === undefined ||
            lat2 === undefined ||
            lon2 === undefined ||
            lat1 === null ||
            lon1 === null ||
            lat2 === null ||
            lon2 === null
        ) {
            return undefined;
        }

        // Converter para números
        const latUser = parseFloat(lat1);
        const lonUser = parseFloat(lon1);
        const latVeiculo = parseFloat(lat2);
        const lonVeiculo = parseFloat(lon2);

        if (
            isNaN(latUser) ||
            isNaN(lonUser) ||
            isNaN(latVeiculo) ||
            isNaN(lonVeiculo)
        ) {
            return undefined;
        }

        const R = 6371; // Raio da Terra em km
        const dLat = (latVeiculo - latUser) * (Math.PI / 180);
        const dLon = (lonVeiculo - lonUser) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latUser * (Math.PI / 180)) *
                Math.cos(latVeiculo * (Math.PI / 180)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distância em km
    } catch (error) {
        console.error('Erro no cálculo de distância:', error);
        return undefined;
    }
}

// Função para listar solicitações
function listarMinhasSolicitacoes() {
    try {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (!usuarioLogado || !usuarioLogado.id) {
            console.error('Usuário não encontrado');
            return;
        }

        const solicitacoes =
            JSON.parse(localStorage.getItem('solicitacoes')) || [];
        const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
        const solicitacoesLocatario = document.getElementById(
            'solicitacoesLocatario'
        );

        if (!solicitacoesLocatario) {
            console.error('Elemento #solicitacoesLocatario não encontrado');
            return;
        }

        solicitacoesLocatario.innerHTML = '';

        const minhasSolicitacoes = solicitacoes.filter(
            (s) =>
                s.locatarioId === usuarioLogado.id && s.status !== 'Cancelada'
        );

        if (minhasSolicitacoes.length === 0) {
            solicitacoesLocatario.innerHTML =
                '<p class="text-center">Você ainda não fez solicitações.</p>';
            return;
        }

        // Ordenar por data (mais recentes primeiro)
        minhasSolicitacoes.sort(
            (a, b) => new Date(b.dataSolicitacao) - new Date(a.dataSolicitacao)
        );

        minhasSolicitacoes.forEach((solic) => {
            const veiculo = veiculos.find((v) => v.id === solic.veiculoId);
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const locador = usuarios.find((u) => u.id === solic.locadorId);

            const card = document.createElement('div');
            card.className = 'solicitacao-card';

            // Determinar a imagem do veículo (primeira imagem ou imagem padrão)
            let imagemSrc = '';
            if (veiculo && veiculo.imagens && veiculo.imagens.length > 0) {
                // Verifica se a imagem é um objeto ou string
                imagemSrc =
                    typeof veiculo.imagens[0] === 'object'
                        ? veiculo.imagens[0].src
                        : veiculo.imagens[0];
            } else {
                imagemSrc = obterImagemTipoVeiculo(veiculo?.tipo || 'carro');
            }

            // Formatar status
            let statusClass = '';
            let statusText = '';
            switch (solic.status) {
                case 'pendente':
                    statusClass = 'badge badge-warning';
                    statusText = 'Em análise';
                    break;
                case 'aceito':
                    statusClass = 'badge badge-success';
                    statusText = 'Aceito';
                    break;
                case 'recusado':
                    statusClass = 'badge badge-danger';
                    statusText = 'Recusado';
                    break;
                default:
                    statusClass = 'badge badge-secondary';
                    statusText = solic.status || 'Desconhecido';
            }

            card.innerHTML = `
<div class="card-imagem">
    <img src="${imagemSrc}" alt="Imagem do veículo">
</div>
<div class="card-info">
    <h3>${veiculo?.marca || ''} ${veiculo?.modelo || 'Veículo'} 
        <span class="${statusClass}">${statusText}</span>
    </h3>
    <p><strong>Data:</strong> ${new Date(
        solic.dataSolicitacao
    ).toLocaleDateString('pt-BR')}</p>
    <p><strong>Locador:</strong> ${locador?.nome || 'Não informado'}</p>
    <p><strong>Motivo:</strong> ${solic.motivo || 'Não informado'}</p>
    ${
        solic.status === 'recusado'
            ? `<p><strong>Motivo da recusa:</strong> ${
                  solic.respostaLocador || 'Não informado'
              }</p>`
            : ''
    }
    ${
        solic.status === 'aceito' && solic.mensagemAceite
            ? `<p><strong>Mensagem do locador:</strong> ${solic.mensagemAceite}</p>`
            : ''
    }
    
    <div class="card-buttons" style="margin-top: 10px;">
        ${
            solic.status === 'aceito'
                ? `
            <button onclick="abrirChat('${solic.id}')" class="btn-chat">
                <span class="icon-chat"></span> Chat
            </button>
        `
                : ''
        }
        
        ${
            solic.status === 'pendente'
                ? `
            <button onclick="cancelarSolicitacao('${solic.id}')" class="btn-cancelar">
                <i class="fas fa-times"></i> Cancelar solicitação
            </button>
        `
                : ''
        }
    </div>
</div>
`;

            solicitacoesLocatario.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao listar solicitações:', error);
        const solicitacoesEl = document.getElementById('solicitacoesLocatario');
        if (solicitacoesEl) {
            solicitacoesEl.innerHTML = `<p class="error">Erro ao carregar solicitações: ${error.message}</p>`;
        }
    }
}

// Função para obter imagem do tipo de veículo
function obterImagemTipoVeiculo(tipo) {
    const svgs = {
        carro: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="50" width="60" height="30" fill="%232563eb"/><rect x="25" y="30" width="50" height="20" fill="%2338bdf8"/><circle cx="35" cy="80" r="10" fill="%23333"/><circle cx="65" cy="80" r="10" fill="%23333"/></svg>`,
        moto: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M30,60 L40,40 L60,40 L70,60" stroke="%23333" fill="none" stroke-width="3"/><circle cx="40" cy="70" r="10" fill="%23333"/><circle cx="60" cy="70" r="10" fill="%23333"/></svg>`,
        bicicleta: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="30" cy="70" r="15" fill="none" stroke="%23333" stroke-width="3"/><circle cx="70" cy="70" r="15" fill="none" stroke="%23333" stroke-width="3"/><path d="M30,70 L50,40 L70,70" stroke="%23333" fill="none" stroke-width="3"/></svg>`,
        patinete: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="30" y="40" width="40" height="10" fill="%23333"/><rect x="50" y="50" width="5" height="30" fill="%23333"/><circle cx="40" cy="80" r="5" fill="%23333"/></svg>`,
        van: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="15" y="50" width="70" height="30" fill="%232563eb"/><rect x="20" y="35" width="60" height="15" fill="%2338bdf8"/><circle cx="30" cy="80" r="8" fill="%23333"/><circle cx="70" cy="80" r="8" fill="%23333"/></svg>`,
        default: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="50" width="60" height="30" fill="%23666"/><circle cx="35" cy="80" r="10" fill="%23333"/><circle cx="65" cy="80" r="10" fill="%23333"/></svg>`,
    };

    // Se tipo for undefined, null ou string vazia, usar 'default'
    if (!tipo) return svgs.default;
    return svgs[tipo.toLowerCase()] || svgs.default;
}

// Função para solicitar locação
function solicitarLocacao(veiculoId) {
    veiculoSolicitarId = veiculoId;
    document.getElementById('motivoSolicitacao').value = '';
    document.getElementById('solicitarModal').style.display = 'flex';
}

function fecharModalSolicitar() {
    document.getElementById('solicitarModal').style.display = 'none';
    veiculoSolicitarId = null;
}

// Função para cancelar solicitação
window.cancelarSolicitacao = function (solicitacaoId) {
    if (!confirm('Tem certeza que deseja cancelar esta solicitação?')) {
        return;
    }

    try {
        const solicitacoes =
            JSON.parse(localStorage.getItem('solicitacoes')) || [];
        const index = solicitacoes.findIndex((s) => s.id === solicitacaoId);

        if (index === -1) {
            showNotification('Solicitação não encontrada.', 'error');
            return;
        }

        solicitacoes[index].status = 'Cancelada';
        solicitacoes[index].dataCancelamento = new Date().toISOString();

        localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));

        showNotification('Solicitação cancelada com sucesso!', 'success');
        listarMinhasSolicitacoes(); // Atualiza a lista de solicitações
    } catch (error) {
        console.error('Erro ao cancelar solicitação:', error);
        showNotification('Ocorreu um erro ao cancelar a solicitação.', 'error');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    inicializarNavegacao();
    obterLocalizacaoUsuario();
    configurarTabs();
    listarMinhasSolicitacoes();
    configurarTema();

    // Configurar seletores de data
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('dataInicio').min = hoje;
    document.getElementById('dataFim').min = hoje;
    document.getElementById('simulacaoDataInicio').min = hoje;
    document.getElementById('simulacaoDataFim').min = hoje;

    document.getElementById('dataInicio').addEventListener('change', () => {
        document.getElementById('dataFim').min =
            document.getElementById('dataInicio').value;
    });

    document
        .getElementById('simulacaoDataInicio')
        .addEventListener('change', () => {
            document.getElementById('simulacaoDataFim').min =
                document.getElementById('simulacaoDataInicio').value;
        });

    // Toggle Sidebar
    document
        .querySelector('.toggle-sidebar')
        .addEventListener('click', toggleSidebar);
    document
        .querySelector('.mobile-menu-toggle')
        .addEventListener('click', toggleMobileSidebar);

    // Botão de obter localização
    document
        .getElementById('obterLocalizacao')
        .addEventListener('click', () => {
            obterLocalizacaoUsuario(true);
        });

    // Adicionar event listener para Enter no input do chat
    const chatInput = document.getElementById('chatMessageInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                enviarMensagemChat();
            }
        });
    }
});

// Inicializar tabs dentro da página de busca
function configurarTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach((button) => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            tabButtons.forEach((btn) => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Hide all tab panels
            document.querySelectorAll('.tab-panel').forEach((panel) => {
                panel.classList.remove('active');
            });

            // Show the corresponding panel
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            // Refresh the map if map tab is active
            if (tabId === 'map-tab' && map) {
                setTimeout(() => {
                    map.invalidateSize();
                }, 100);
            }
        });
    });
}

// Função para alternar a barra lateral
function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    document
        .querySelector('.sidebar')
        .classList.toggle('collapsed', sidebarCollapsed);
    document
        .querySelector('.main-content')
        .classList.toggle('expanded', sidebarCollapsed);
}

function toggleMobileSidebar() {
    document.querySelector('.sidebar').classList.toggle('mobile-active');
}

// Inicializar navegação por abas
function inicializarNavegacao() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item) => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Remover classe ativa de todos os itens de menu
            menuItems.forEach((i) => i.classList.remove('active'));

            // Adicionar classe ativa ao item clicado
            this.classList.add('active');

            // Esconder todas as abas
            document.querySelectorAll('.tab-content').forEach((tab) => {
                tab.classList.remove('active');
            });

            // Mostrar a aba correspondente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            // Fechar menu no mobile após seleção
            if (window.innerWidth <= 768) {
                document
                    .querySelector('.sidebar')
                    .classList.remove('mobile-active');
            }
        });
    });
}

// Função para obter localização do usuário
function obterLocalizacaoUsuario(forceUpdate = false) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                try {
                    userLocation = {
                        // Armazenar ambos os formatos para compatibilidade
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    // Armazenar no localStorage para uso futuro
                    localStorage.setItem(
                        'userLocation',
                        JSON.stringify(userLocation)
                    );

                    console.log('Localização do usuário obtida:', userLocation);

                    // Atualizar mapa e veículos com base na nova localização
                    if (forceUpdate) {
                        showNotification(
                            'Localização atualizada com sucesso!',
                            'success'
                        );
                        carregarVeiculosAtualizado();
                    } else {
                        // Carregar veículos apenas na primeira vez (sem notificação)
                        carregarVeiculosAtualizado();
                    }
                } catch (error) {
                    console.error('Erro ao processar localização:', error);
                    carregarVeiculosAtualizado();
                }
            },
            function (error) {
                console.error('Erro ao obter localização:', error);
                // Tentar usar localização salva
                try {
                    const savedLocation = localStorage.getItem('userLocation');
                    if (savedLocation) {
                        userLocation = JSON.parse(savedLocation);

                        // Garantir que tenha ambos os formatos para compatibilidade
                        if (userLocation.latitude && !userLocation.lat) {
                            userLocation.lat = userLocation.latitude;
                        }
                        if (userLocation.longitude && !userLocation.lng) {
                            userLocation.lng = userLocation.longitude;
                        }
                        if (userLocation.lat && !userLocation.latitude) {
                            userLocation.latitude = userLocation.lat;
                        }
                        if (userLocation.lng && !userLocation.longitude) {
                            userLocation.longitude = userLocation.lng;
                        }

                        carregarVeiculosAtualizado();
                    } else {
                        // Exibir apenas se for atualização forçada
                        if (forceUpdate) {
                            showNotification(
                                'Não foi possível obter sua localização atual.',
                                'error'
                            );
                        }
                        carregarVeiculosAtualizado();
                    }
                } catch (error) {
                    console.error(
                        'Erro ao recuperar localização salva:',
                        error
                    );
                    carregarVeiculosAtualizado();
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    } else {
        if (forceUpdate) {
            showNotification(
                'Seu navegador não suporta geolocalização.',
                'error'
            );
        }
        carregarVeiculosAtualizado();
    }
}

// Alternar entre visualização e edição do perfil
function toggleProfileEdit() {
    const viewMode = document.getElementById('profileView');
    const editMode = document.getElementById('profileEdit');
    const passwordMode = document.getElementById('passwordChange');

    if (viewMode.style.display === 'none') {
        viewMode.style.display = 'block';
        editMode.style.display = 'none';
        passwordMode.style.display = 'none';
        document.getElementById('editProfileBtn').innerHTML =
            '<i class="fas fa-edit"></i> Editar Perfil';
    } else {
        viewMode.style.display = 'none';
        editMode.style.display = 'block';
        passwordMode.style.display = 'none';
        document.getElementById('editProfileBtn').innerHTML =
            '<i class="fas fa-times"></i> Cancelar';
    }
}

// Mostrar formulário de alteração de senha
function showPasswordChange() {
    document.getElementById('profileView').style.display = 'none';
    document.getElementById('profileEdit').style.display = 'none';
    document.getElementById('passwordChange').style.display = 'block';
    document.getElementById('editProfileBtn').innerHTML =
        '<i class="fas fa-times"></i> Cancelar';
}

// Esconder formulário de alteração de senha
function hidePasswordChange() {
    document.getElementById('profileView').style.display = 'block';
    document.getElementById('profileEdit').style.display = 'none';
    document.getElementById('passwordChange').style.display = 'none';
    document.getElementById('editProfileBtn').innerHTML =
        '<i class="fas fa-edit"></i> Editar Perfil';
}

// Função para alterar senha
function alterarSenha() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        showNotification('Preencha todos os campos de senha', 'error');
        return;
    }

    if (senhaAtual !== usuarioLogado.senha) {
        showNotification('Senha atual incorreta', 'error');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        showNotification('As novas senhas não coincidem', 'error');
        return;
    }

    usuarioLogado.senha = novaSenha;
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

    document.getElementById('senhaAtual').value = '';
    document.getElementById('novaSenha').value = '';
    document.getElementById('confirmarSenha').value = '';

    hidePasswordChange();
    showNotification('Senha alterada com sucesso!', 'success');
}

// Função para formatar CPF
function formatarCPF(cpf) {
    if (!cpf) return '';
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para formatar celular
function formatarCelular(celular) {
    if (!celular) return '';
    celular = celular.replace(/\D/g, '');
    return celular.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

// Função para formatar CEP
function formatarCEP(cep) {
    if (!cep) return '';
    cep = cep.replace(/\D/g, '');
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}

// Replace your alterarFotoPerfil function with this
function alterarFotoPerfil() {
    const inputFoto = document.createElement('input');
    inputFoto.type = 'file';
    inputFoto.accept = 'image/*';

    inputFoto.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imgUrl = event.target.result;

                // Update profile image display
                document.getElementById('profileImage').src = imgUrl;
                document.getElementById(
                    'profilePicture'
                ).style.backgroundImage = `url(${imgUrl})`;

                // Save to logged in user
                const usuarioLogado = JSON.parse(
                    localStorage.getItem('usuarioLogado') || '{}'
                );
                usuarioLogado.fotoPerfil = imgUrl;
                localStorage.setItem(
                    'usuarioLogado',
                    JSON.stringify(usuarioLogado)
                );

                // IMPORTANT: Save to users array
                const usuarios = JSON.parse(
                    localStorage.getItem('usuarios') || '[]'
                );
                const index = usuarios.findIndex(
                    (u) => u.id === usuarioLogado.id
                );
                if (index !== -1) {
                    usuarios[index].fotoPerfil = imgUrl;
                    localStorage.setItem('usuarios', JSON.stringify(usuarios));
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Foto atualizada com sucesso!',
                    showConfirmButton: false,
                    timer: 1500,
                });
            };
            reader.readAsDataURL(file);
        }
    });

    inputFoto.click();
}

function carregarPerfil() {
    const usuarioLogado = JSON.parse(
        localStorage.getItem('usuarioLogado') || '{}'
    );

    if (!usuarioLogado) return;

    if (usuarioLogado && usuarioLogado.nome) {
        // Preencher os campos existentes
        // ... código existente ...

        // Carregar a foto de perfil se existir
        if (
            usuarioLogado.fotoPerfil &&
            document.getElementById('profileImage')
        ) {
            document.getElementById('profileImage').src =
                usuarioLogado.fotoPerfil;
        }
    }

    // Atualizar nome na página e foto de perfil
    document.getElementById('profileName').textContent =
        usuarioLogado.nome || 'Usuário';

    // Definir foto de perfil (se existir)
    if (usuarioLogado.fotoPerfil) {
        document.getElementById(
            'profilePicture'
        ).style.backgroundImage = `url(${usuarioLogado.fotoPerfil})`;
    } else {
        document.getElementById('profilePicture').style.backgroundImage =
            'none';
        document.getElementById('profilePicture').style.backgroundColor =
            '#2c3e50';
    }

    // Campos de visualização
    document.getElementById('profileNome').textContent =
        usuarioLogado.nome || 'Não informado';
    document.getElementById('profileEmail').textContent =
        usuarioLogado.email || 'Não informado';
    document.getElementById('profileCelular').textContent =
        formatarCelular(usuarioLogado.celular) || 'Não informado';
    document.getElementById('profileCpf').textContent =
        formatarCPF(usuarioLogado.cpf) || 'Não informado';
    document.getElementById('profileCep').textContent =
        formatarCEP(usuarioLogado.cep) || 'Não informado';
    document.getElementById('profileEndereco').textContent =
        usuarioLogado.endereco || 'Não informado';
    document.getElementById('profileCnh').textContent =
        usuarioLogado.cnh || 'Não informado';

    // Campos de edição
    document.getElementById('nome').value = usuarioLogado.nome || '';
    document.getElementById('email').value = usuarioLogado.email || '';
    document.getElementById('telefone').value = usuarioLogado.celular || '';
    document.getElementById('cpf').value = formatarCPF(usuarioLogado.cpf) || '';
    document.getElementById('cep').value = usuarioLogado.cep || '';
    document.getElementById('endereco').value = usuarioLogado.endereco || '';
    document.getElementById('cnh').value = usuarioLogado.cnh || '';

    // Carregar métodos de pagamento
    carregarMetodosPagamento();
}

// Substituir a função salvarPerfil() existente por esta:
function salvarPerfil() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document
        .getElementById('telefone')
        .value.replace(/\D/g, '');
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    const endereco = document.getElementById('endereco').value;

    if (!nome || !email || !telefone) {
        showNotification('Nome, email e celular são obrigatórios', 'error');
        return;
    }

    usuarioLogado.nome = nome;
    usuarioLogado.email = email;
    usuarioLogado.celular = telefone;

    if (cep) usuarioLogado.cep = cep;
    if (endereco) usuarioLogado.endereco = endereco;

    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
    showNotification('Perfil atualizado com sucesso!', 'success');

    carregarPerfil();
    toggleProfileEdit(); // Volta para a visualização
}

// Substituir a função atual abrirModalFoto()
function abrirModalFoto() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuarioLogado && usuarioLogado.fotoPerfil) {
        document.getElementById(
            'previewFotoPerfil'
        ).style.backgroundImage = `url(${usuarioLogado.fotoPerfil})`;
    } else {
        document.getElementById('previewFotoPerfil').style.backgroundImage =
            'none';
        document.getElementById('previewFotoPerfil').style.backgroundColor =
            '#2c3e50';
    }
    document.getElementById('fotoPerfilModal').style.display = 'flex';
}

function fecharModalFoto() {
    document.getElementById('fotoPerfilModal').style.display = 'none';
}

function salvarFotoPerfil() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const fotoPerfil =
        document.getElementById('previewFotoPerfil').style.backgroundImage;
    if (fotoPerfil && fotoPerfil !== 'none') {
        usuarioLogado.fotoPerfil = fotoPerfil.slice(5, -2); // Remove 'url("' e '")'
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

        // IMPORTANT: Save to users array - this was missing!
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const index = usuarios.findIndex((u) => u.id === usuarioLogado.id);
        if (index !== -1) {
            usuarios[index].fotoPerfil = fotoPerfil.slice(5, -2);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }

        // Atualizar foto na página
        if (document.getElementById('profilePicture')) {
            document.getElementById('profilePicture').style.backgroundImage =
                fotoPerfil;
        }

        showNotification('Foto de perfil atualizada com sucesso!', 'success');
    }
    fecharModalFoto();
}

// Adicione um listener para o input de arquivo
document.addEventListener('DOMContentLoaded', function () {
    const inputFotoPerfil = document.getElementById('inputFotoPerfil');
    if (inputFotoPerfil) {
        inputFotoPerfil.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById(
                        'previewFotoPerfil'
                    ).style.backgroundImage = `url(${e.target.result})`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Variáveis para gerenciamento de métodos de pagamento
let metodosPagamento = [];
let metodoExcluirId = null;

// Substituir as funções atuais de gerenciamento de pagamento
function adicionarMetodoPagamento() {
    document.getElementById('pagamentoModalTitulo').textContent =
        'Adicionar Método de Pagamento';
    document.getElementById('metodoPagamentoId').value = '';
    document.getElementById('tipoCartao').value = 'visa';
    document.getElementById('numeroCartao').value = '';
    document.getElementById('validadeCartao').value = '';
    document.getElementById('cvvCartao').value = '';
    document.getElementById('nomeCartao').value = '';
    document.getElementById('pagamentoModal').style.display = 'flex';
}

function editarMetodoPagamento(id) {
    const metodo = metodosPagamento.find((m) => m.id == id);
    if (!metodo) return;

    document.getElementById('pagamentoModalTitulo').textContent =
        'Editar Método de Pagamento';
    document.getElementById('metodoPagamentoId').value = metodo.id;
    document.getElementById('tipoCartao').value = metodo.tipo;
    document.getElementById('numeroCartao').value = metodo.numero;
    document.getElementById('validadeCartao').value = metodo.validade;
    document.getElementById('cvvCartao').value = metodo.cvv;
    document.getElementById('nomeCartao').value = metodo.nome;
    document.getElementById('pagamentoModal').style.display = 'flex';
}

function removerMetodoPagamento(id) {
    metodoExcluirId = id;
    document.getElementById('confirmarExclusaoModal').style.display = 'flex';
}

function confirmarExclusaoMetodo() {
    if (metodoExcluirId) {
        metodosPagamento = metodosPagamento.filter(
            (m) => m.id != metodoExcluirId
        );
        salvarMetodosPagamento();
        carregarMetodosPagamento();
        document.getElementById('confirmarExclusaoModal').style.display =
            'none';
        showNotification(
            'Método de pagamento excluído com sucesso!',
            'success'
        );
    }
}

function fecharModalPagamento() {
    document.getElementById('pagamentoModal').style.display = 'none';
}

function salvarMetodoPagamento() {
    const id = document.getElementById('metodoPagamentoId').value || Date.now();
    const tipo = document.getElementById('tipoCartao').value;
    const numero = document.getElementById('numeroCartao').value;
    const validade = document.getElementById('validadeCartao').value;
    const cvv = document.getElementById('cvvCartao').value;
    const nome = document.getElementById('nomeCartao').value;

    if (!numero || !validade || !cvv || !nome) {
        showNotification('Preencha todos os campos obrigatórios', 'error');
        return;
    }

    // Formatação básica
    const numeroFormatado = numero.replace(/\s/g, '');
    if (numeroFormatado.length < 13) {
        showNotification('Número de cartão inválido', 'error');
        return;
    }

    const novoMetodo = {
        id: id,
        tipo: tipo,
        numero: numero,
        validade: validade,
        cvv: cvv,
        nome: nome,
        ultimosDigitos: numeroFormatado.slice(-4),
    };

    const index = metodosPagamento.findIndex((m) => m.id == id);
    if (index !== -1) {
        metodosPagamento[index] = novoMetodo;
    } else {
        metodosPagamento.push(novoMetodo);
    }

    // Salvar no usuário logado
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuarioLogado) {
        usuarioLogado.metodosPagamento = metodosPagamento;
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

        // Sincronizar com o array de usuários
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const userIndex = usuarios.findIndex((u) => u.id === usuarioLogado.id);
        if (userIndex !== -1) {
            usuarios[userIndex].metodosPagamento = metodosPagamento;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
    }

    salvarMetodosPagamento();
    carregarMetodosPagamento();
    fecharModalPagamento();
    showNotification('Método de pagamento salvo com sucesso!', 'success');
}

function salvarMetodosPagamento() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    usuarioLogado.metodosPagamento = metodosPagamento;
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
}

function carregarMetodosPagamento() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    metodosPagamento = usuarioLogado.metodosPagamento || [];

    const container = document.querySelector('.payment-methods');
    if (!container) return;

    // Limpar container mantendo apenas o botão de adicionar
    const btnAdicionar = container.querySelector('.btn-accent');
    container.innerHTML = '';

    if (metodosPagamento.length === 0) {
        const msgVazio = document.createElement('div');
        msgVazio.style.textAlign = 'center';
        msgVazio.style.padding = '10px';
        msgVazio.style.color = '#94a3b8';
        msgVazio.textContent = 'Nenhum método de pagamento cadastrado';
        container.appendChild(msgVazio);
    } else {
        metodosPagamento.forEach((metodo) => {
            const iconeCartao = getIconeCartao(metodo.tipo);
            const elemento = document.createElement('div');
            elemento.className = 'payment-method';
            elemento.innerHTML = `
                <div class="payment-icon">
                    <i class="fab ${iconeCartao}"></i>
                </div>
                <div class="payment-details">
                    <div class="payment-name">${getCartaoNome(
                        metodo.tipo
                    )} terminando em ${metodo.ultimosDigitos}</div>
                    <div class="payment-info">Expira em ${metodo.validade}</div>
                </div>
                <div class="payment-actions">
                    <button class="btn btn-sm btn-primary" onclick="editarMetodoPagamento(${
                        metodo.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="removerMetodoPagamento(${
                        metodo.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(elemento);
        });
    }

    // Adicionar botão de novo método
    const btnNovoMetodo = document.createElement('button');
    btnNovoMetodo.className = 'btn btn-accent mt-3';
    btnNovoMetodo.innerHTML =
        '<i class="fas fa-plus"></i> Adicionar Método de Pagamento';
    btnNovoMetodo.onclick = adicionarMetodoPagamento;
    container.appendChild(btnNovoMetodo);
}

function getIconeCartao(tipo) {
    switch (tipo) {
        case 'visa':
            return 'fa-cc-visa';
        case 'mastercard':
            return 'fa-cc-mastercard';
        case 'amex':
            return 'fa-cc-amex';
        case 'elo':
            return 'fa-credit-card';
        case 'hipercard':
            return 'fa-credit-card';
        default:
            return 'fa-credit-card';
    }
}

function getCartaoNome(tipo) {
    switch (tipo) {
        case 'visa':
            return 'Visa';
        case 'mastercard':
            return 'Mastercard';
        case 'amex':
            return 'American Express';
        case 'elo':
            return 'Elo';
        case 'hipercard':
            return 'Hipercard';
        default:
            return 'Cartão';
    }
}

// Add this to your login function
function login(email, senha) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(
        (u) => u.email === email && u.senha === senha
    );

    if (usuario) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        // Redirect to appropriate dashboard
    }
}

// Adicionar formatação aos campos de cartão
document.addEventListener('DOMContentLoaded', function () {
    const numeroCartao = document.getElementById('numeroCartao');
    if (numeroCartao) {
        numeroCartao.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            e.target.value = value;
        });
    }

    const validadeCartao = document.getElementById('validadeCartao');
    if (validadeCartao) {
        validadeCartao.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Remover todo o bloco que começa com "// Carregar dados do usuário..."
    // Em vez disso, garantir que carregarPerfil() seja chamada
    carregarPerfil();

    // Manter apenas o código para buscar CEP
    if (document.getElementById('cep')) {
        document.getElementById('cep').addEventListener('blur', function () {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then((response) => response.json())
                    .then((data) => {
                        if (!data.erro) {
                            document.getElementById(
                                'endereco'
                            ).value = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
                        }
                    })
                    .catch((error) =>
                        console.error('Erro ao buscar CEP:', error)
                    );
            }
        });
    }
});

// Salvar configurações
function salvarConfiguracoes() {
    const notificacoesEmail =
        document.getElementById('notificacoesEmail').value;
    const idiomaApp = document.getElementById('idiomaApp').value;

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuarioLogado) {
        usuarioLogado.configuracoes = {
            notificacoesEmail,
            idiomaApp,
        };
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
    }

    showNotification('Configurações salvas com sucesso!', 'success');
}

// Função para o visualizador de imagens
function abrirVisualizador(veiculoId) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculo = veiculos.find((v) => v.id === veiculoId);

    if (!veiculo) {
        showNotification('Veículo não encontrado', 'error');
        return;
    }

    // Reset das imagens atuais
    imagensAtuais = [];

    // Verifica se o veículo tem imagens
    if (!veiculo.imagens || veiculo.imagens.length === 0) {
        // Se não tiver, usa a imagem padrão do tipo
        imagensAtuais = [obterImagemTipoVeiculo(veiculo.tipo)];
    } else {
        // Se tiver imagens, usa todas elas
        imagensAtuais = veiculo.imagens.map((img) => {
            // Verifica se a imagem já é um objeto com src
            if (typeof img === 'object' && img.src) {
                return img.src;
            }
            // Se for uma string, usa diretamente
            return img;
        });
    }

    indiceImagemAtual = 0;
    document.getElementById('imagemVisualizador').src = imagensAtuais[0];
    document.getElementById('visualizadorImagens').style.display = 'flex';
}

function fecharVisualizador() {
    document.getElementById('visualizadorImagens').style.display = 'none';
}

function mudarImagem(direcao) {
    indiceImagemAtual += direcao;

    // Verificar limites
    if (indiceImagemAtual < 0) {
        indiceImagemAtual = imagensAtuais.length - 1;
    } else if (indiceImagemAtual >= imagensAtuais.length) {
        indiceImagemAtual = 0;
    }

    document.getElementById('imagemVisualizador').src =
        imagensAtuais[indiceImagemAtual];
}

// Funções do modal de detalhes
function abrirModalDetalhes(veiculoId) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    veiculoDetalhado = veiculos.find((v) => v.id === veiculoId);

    if (!veiculoDetalhado) {
        showNotification('Veículo não encontrado!', 'error');
        return;
    }

    // Preencher informações básicas
    document.getElementById('modalTitulo').textContent = `${
        veiculoDetalhado.marca || ''
    } ${veiculoDetalhado.modelo || 'Detalhes do Veículo'}`;
    document.getElementById('modalMarca').textContent =
        veiculoDetalhado.marca || 'Não informado';
    document.getElementById('modalModelo').textContent =
        veiculoDetalhado.modelo || 'Não informado';
    document.getElementById('modalAno').textContent =
        veiculoDetalhado.ano || 'Não informado';
    document.getElementById('modalTipo').textContent =
        veiculoDetalhado.tipo || 'Não informado';

    // Corrigido: Mostrar apenas o motor sem "não informado" quando existe
    document.getElementById('modalMotor').textContent =
        veiculoDetalhado.motor || 'Não informado';

    // Mostrar motorização junto com o tipo de motor, se disponível
    if (veiculoDetalhado.motorizacao && veiculoDetalhado.motor) {
        document.getElementById(
            'modalMotor'
        ).textContent = `${veiculoDetalhado.motor} ${veiculoDetalhado.motorizacao}`;
    }

    document.getElementById('modalCombustivel').textContent =
        veiculoDetalhado.combustivel || 'Não informado';

    // Melhorado: Informações de capacidade
    let textoCapacidade = 'Não informado';
    if (veiculoDetalhado.capacidadePassageiros) {
        textoCapacidade = `${veiculoDetalhado.capacidadePassageiros} pessoas`;
    }
    if (veiculoDetalhado.capacidadeCarga) {
        textoCapacidade +=
            textoCapacidade !== 'Não informado'
                ? ` / ${veiculoDetalhado.capacidadeCarga} kg de carga`
                : `${veiculoDetalhado.capacidadeCarga} kg de carga`;
    }
    document.getElementById('modalCapacidade').textContent = textoCapacidade;

    document.getElementById('modalFinalidade').textContent =
        veiculoDetalhado.finalidade || 'Não informado';
    document.getElementById('modalLocalizacao').textContent =
        veiculoDetalhado.endereco || 'Não informado';

    // Distância do usuário
    let distanciaTexto = 'Não disponível';
    if (
        userLocation &&
        veiculoDetalhado.latitude &&
        veiculoDetalhado.longitude
    ) {
        const distancia = calcularDistancia(
            userLocation.latitude || userLocation.lat,
            userLocation.longitude || userLocation.lng,
            veiculoDetalhado.latitude,
            veiculoDetalhado.longitude
        );

        if (distancia !== undefined && !isNaN(distancia)) {
            distanciaTexto =
                distancia < 1
                    ? `${Math.round(distancia * 1000)} metros`
                    : `${distancia.toFixed(1)} km`;
        }
    }
    document.getElementById('modalDistancia').textContent = distanciaTexto;

    // Forma de cobrança - corrigido
    let cobrancaText = 'Não informado';
    if (
        veiculoDetalhado.formaCobranca === 'minuto' &&
        veiculoDetalhado.valorPorMinuto !== undefined
    ) {
        cobrancaText = `Por minuto - R$ ${(
            veiculoDetalhado.valorPorMinuto || 0
        ).toFixed(2)}/min`;
    } else if (
        veiculoDetalhado.formaCobranca === 'hora' &&
        veiculoDetalhado.valorPorHora !== undefined
    ) {
        cobrancaText = `Por hora - R$ ${(
            veiculoDetalhado.valorPorHora || 0
        ).toFixed(2)}/h`;
    } else if (veiculoDetalhado.valorPorDia !== undefined) {
        cobrancaText = `Por dia - R$ ${(
            veiculoDetalhado.valorPorDia || 0
        ).toFixed(2)}/dia`;
    }
    document.getElementById('modalCobranca').textContent = cobrancaText;

    // Disponibilidade
    let disponibilidadeText = 'Sempre disponível';
    if (veiculoDetalhado.disponibilidade) {
        if (
            veiculoDetalhado.disponibilidade.diasSemana &&
            veiculoDetalhado.disponibilidade.horarioInicio &&
            veiculoDetalhado.disponibilidade.horarioFim
        ) {
            const diasSemana = [
                'Domingo',
                'Segunda',
                'Terça',
                'Quarta',
                'Quinta',
                'Sexta',
                'Sábado',
            ];
            const diasDisponiveis = [];
            veiculoDetalhado.disponibilidade.diasSemana.forEach(
                (disponivel, index) => {
                    if (disponivel) {
                        diasDisponiveis.push(diasSemana[index]);
                    }
                }
            );

            disponibilidadeText = `Disponível ${diasDisponiveis.join(
                ', '
            )} das ${veiculoDetalhado.disponibilidade.horarioInicio} às ${
                veiculoDetalhado.disponibilidade.horarioFim
            }`;
        }

        // Verificar e exibir datas indisponíveis
        if (
            veiculoDetalhado.disponibilidade.diasIndisponiveis &&
            veiculoDetalhado.disponibilidade.diasIndisponiveis.length > 0
        ) {
            document.getElementById('modalDatasIndisponiveis').style.display =
                'flex';
            const dataFormatada =
                veiculoDetalhado.disponibilidade.diasIndisponiveis
                    .map((data) => {
                        const d = new Date(data);
                        return d.toLocaleDateString('pt-BR');
                    })
                    .join(', ');
            document.getElementById('modalIndisponiveis').textContent =
                dataFormatada;
        } else {
            document.getElementById('modalDatasIndisponiveis').style.display =
                'none';
        }
    } else {
        document.getElementById('modalDatasIndisponiveis').style.display =
            'none';
    }
    document.getElementById('modalDisponibilidade').textContent =
        disponibilidadeText;

    // Configurar imagens
    const thumbnailsContainer = document.getElementById('modalThumbnails');
    thumbnailsContainer.innerHTML = '';

    // Usar imagem padrão se não houver imagens
    const imagens =
        veiculoDetalhado.imagens && veiculoDetalhado.imagens.length > 0
            ? veiculoDetalhado.imagens
            : [obterImagemTipoVeiculo(veiculoDetalhado.tipo)];

    // Definir imagem principal
    document.getElementById('modalImagemPrincipal').src = imagens[0];

    // Criar thumbnails
    imagens.forEach((img, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = img;
        thumbnail.className =
            'modal-thumbnail' + (index === 0 ? ' active' : '');
        thumbnail.onclick = () => {
            document.getElementById('modalImagemPrincipal').src = img;
            document
                .querySelectorAll('.modal-thumbnail')
                .forEach((t) => t.classList.remove('active'));
            thumbnail.classList.add('active');
        };
        thumbnailsContainer.appendChild(thumbnail);
    });

    // Configurar campos de simulação baseados na forma de cobrança
    document.getElementById('simulacaoHorasContainer').style.display = 'none';
    document.getElementById('simulacaoMinutosContainer').style.display = 'none';
    document.getElementById('simulacaoAlerta').style.display = 'none';
    document.getElementById('simulacaoResultado').style.display = 'none';

    if (veiculoDetalhado.formaCobranca === 'minuto') {
        document.getElementById('simulacaoMinutosContainer').style.display =
            'block';
    } else if (veiculoDetalhado.formaCobranca === 'hora') {
        document.getElementById('simulacaoHorasContainer').style.display =
            'block';
    }

    // Limpar campos de simulação
    document.getElementById('simulacaoDataInicio').value = '';
    document.getElementById('simulacaoDataFim').value = '';
    document.getElementById('simulacaoHoras').value = '';
    document.getElementById('simulacaoMinutos').value = '';

    // Mostrar modal
    document.getElementById('modalDetalhes').style.display = 'flex';
}

function fecharModalDetalhes() {
    document.getElementById('modalDetalhes').style.display = 'none';
    veiculoDetalhado = null;
}

function calcularSimulacao() {
    if (!veiculoDetalhado) return;

    const dataInicio = document.getElementById('simulacaoDataInicio').value;
    const dataFim = document.getElementById('simulacaoDataFim').value;

    // Obtenção segura dos valores - evita erros se os elementos não existirem
    const horasInput = document.getElementById('simulacaoHoras');
    const minutosInput = document.getElementById('simulacaoMinutos');

    const horas =
        horasInput && horasInput.value ? parseInt(horasInput.value) : 0;
    const minutos =
        minutosInput && minutosInput.value ? parseInt(minutosInput.value) : 0;

    document.getElementById('simulacaoAlerta').style.display = 'none';
    document.getElementById('simulacaoResultado').style.display = 'none';

    // Validação com base na forma de cobrança
    if (veiculoDetalhado.formaCobranca === 'minuto') {
        if (!minutos || minutos <= 0) {
            showNotification('Informe a quantidade de minutos', 'error');
            return;
        }
    } else if (veiculoDetalhado.formaCobranca === 'hora') {
        if (!horas || horas <= 0) {
            showNotification('Informe a quantidade de horas', 'error');
            return;
        }
    } else {
        // Cobrança por dia (padrão)
        if (!dataInicio || !dataFim) {
            showNotification('Selecione as datas para simulação', 'error');
            return;
        }
    }

    // Verificar disponibilidade
    let disponivel = true;
    if (dataInicio && dataFim) {
        disponivel = verificarDisponibilidade(
            veiculoDetalhado,
            dataInicio,
            dataFim
        );
    }

    if (!disponivel) {
        document.getElementById('simulacaoAlerta').innerHTML =
            '<i class="fas fa-exclamation-triangle"></i> O veículo não está disponível neste período!';
        document.getElementById('simulacaoAlerta').className =
            'unavailable-alert';
        document.getElementById('simulacaoAlerta').style.display = 'block';
        return;
    }

    // Calcular valor total
    let total = 0;
    let descricao = '';

    try {
        if (
            veiculoDetalhado.formaCobranca === 'minuto' &&
            veiculoDetalhado.valorPorMinuto !== undefined
        ) {
            total = (veiculoDetalhado.valorPorMinuto || 0) * minutos;
            descricao = `${minutos} minuto(s) x R$ ${(
                veiculoDetalhado.valorPorMinuto || 0
            ).toFixed(2)}/min = R$ ${total.toFixed(2)}`;
        } else if (
            veiculoDetalhado.formaCobranca === 'hora' &&
            veiculoDetalhado.valorPorHora !== undefined
        ) {
            total = (veiculoDetalhado.valorPorHora || 0) * horas;
            descricao = `${horas} hora(s) x R$ ${(
                veiculoDetalhado.valorPorHora || 0
            ).toFixed(2)}/h = R$ ${total.toFixed(2)}`;
        } else if (veiculoDetalhado.valorPorDia !== undefined) {
            // Cobrança por dia
            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);
            const diferencaMs = fim - inicio;
            const dias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));

            if (dias <= 0) {
                showNotification(
                    'A data final deve ser após a data inicial',
                    'error'
                );
                return;
            }

            total = (veiculoDetalhado.valorPorDia || 0) * dias;
            descricao = `${dias} dia(s) x R$ ${(
                veiculoDetalhado.valorPorDia || 0
            ).toFixed(2)}/dia = R$ ${total.toFixed(2)}`;
        } else {
            showNotification(
                'Não foi possível calcular o valor. Verifique a configuração do veículo.',
                'error'
            );
            return;
        }

        const resultadoDiv = document.getElementById('simulacaoResultado');
        resultadoDiv.innerHTML = `Total estimado: <span class="preco">R$ ${total.toFixed(
            2
        )}</span><br>${descricao}`;
        resultadoDiv.style.display = 'block';

        // Exibir alerta de disponibilidade
        document.getElementById('simulacaoAlerta').innerHTML =
            '<i class="fas fa-check-circle"></i> O veículo está disponível neste período!';
        document.getElementById('simulacaoAlerta').className =
            'availability-alert';
        document.getElementById('simulacaoAlerta').style.display = 'block';
    } catch (error) {
        console.error('Erro ao calcular simulação:', error);
        showNotification(
            'Ocorreu um erro ao calcular o valor. Tente novamente.',
            'error'
        );
    }
}

// Verificar autenticação
function verificarAutenticacao() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || usuarioLogado.tipoUsuario !== 'locatario') {
        window.location.href = 'index.html';
    }
}

// Filtrar veículos no mapa
function filtrarMapa(tipoSelecionado) {
    tipoFiltroMapa = tipoSelecionado;
    aplicarFiltrosMapa();
}

function resetarFiltroMapa() {
    tipoFiltroMapa = null;
    aplicarFiltrosMapa();
}

async function aplicarFiltrosMapa() {
    const filtros = obterFiltrosAtivos();
    filtros.tipo = tipoFiltroMapa;
    await carregarVeiculosAtualizado(filtros);
}

// Obter todos os filtros ativos
function obterFiltrosAtivos() {
    return {
        tipo: document.getElementById('tipoFiltro').value,
        valorMax: document.getElementById('valorMaxFiltro').value,
        cidade: document.getElementById('cidadeFiltro').value.trim(),
        motor: document.getElementById('motorFiltro').value,
        combustivel: document.getElementById('combustivelFiltro').value,
        motorizacao: document.getElementById('motorizacaoFiltro').value,
        capacidade: document.getElementById('capacidadeFiltro').value,
        finalidade: document.getElementById('finalidadeFiltro').value,
        marca: document.getElementById('marcaFiltro').value,
        dataInicio: document.getElementById('dataInicio').value,
        dataFim: document.getElementById('dataFim').value,
        anoMin: document.getElementById('anoMinFiltro').value,
        distanciaMax: document.getElementById('distanciaMaxFiltro').value,
        ordenarPor: document.getElementById('ordenarPor').value,
    };
}

// Aplicar filtros
function aplicarFiltros() {
    const filtros = obterFiltrosAtivos();
    carregarVeiculosAtualizado(filtros);
}

// Função para criar rota até o veículo
function criarRotaParaVeiculo(veiculoId) {
    if (!userLocation) {
        showNotification(
            'Sua localização atual não está disponível. Permita o acesso à localização.',
            'error'
        );
        return;
    }

    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculo = veiculos.find((v) => v.id === veiculoId);

    if (!veiculo || !veiculo.latitude || !veiculo.longitude) {
        showNotification(
            'Não foi possível criar uma rota para este veículo.',
            'error'
        );
        return;
    }

    // Fechar o modal de detalhes se estiver aberto
    if (document.getElementById('modalDetalhes').style.display === 'flex') {
        fecharModalDetalhes();
    }

    // Mudar para a aba do mapa
    document.querySelector('.tab-button[data-tab="map-tab"]').click();

    // Adicionar rota ao mapa
    setTimeout(() => {
        // Remover rota anterior e botões se existirem
        if (routingControl) {
            map.removeControl(routingControl);
        }

        const botaoExistente = document.getElementById('toggleInstructions');
        if (botaoExistente) {
            botaoExistente.remove();
        }

        const botaoCancelarExistente = document.getElementById('cancelRoute');
        if (botaoCancelarExistente) {
            botaoCancelarExistente.remove();
        }

        // Criar o controle de rota
        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(
                    userLocation.latitude || userLocation.lat,
                    userLocation.longitude || userLocation.lng
                ),
                L.latLng(veiculo.latitude, veiculo.longitude),
            ],
            routeWhileDragging: false,
            showAlternatives: false,
            lineOptions: {
                styles: [
                    {
                        color: 'var(--primary-color)',
                        opacity: 0.8,
                        weight: 6,
                    },
                ],
            },
            createMarker: function () {
                return null;
            },
            addWaypoints: false,
            draggableWaypoints: false,
        }).addTo(map);

        routingControl.on('routesfound', function (e) {
            const bounds = L.latLngBounds([
                [
                    userLocation.latitude || userLocation.lat,
                    userLocation.longitude || userLocation.lng,
                ],
                [veiculo.latitude, veiculo.longitude],
            ]);
            map.fitBounds(bounds, { padding: [50, 50] });

            // Destacar o marcador do veículo
            markers.forEach((marker) => {
                if (marker.options.veiculoId === veiculoId) {
                    marker.openPopup();
                }
            });

            // Adicionar botão para cancelar rota
            adicionarBotaoCancelarRota();

            // Ocultar instruções padrão e adicionar nosso botão customizado
            // Aguardar para garantir que o Leaflet criou todos os elementos
            setTimeout(ocultarInstrucoesRota, 500);
        });

        showNotification(
            `Rota criada para ${veiculo.modelo || 'veículo selecionado'}`,
            'success'
        );
    }, 300);
}

// Nova função para adicionar botão de cancelar rota
function adicionarBotaoCancelarRota() {
    const mapContainer =
        document.querySelector('.leaflet-container') ||
        document.getElementById('map');
    if (!mapContainer) return;

    // Verificar se já existe um botão e remover
    const botaoExistente = document.getElementById('cancelRoute');
    if (botaoExistente) {
        botaoExistente.remove();
    }

    // Criar botão de cancelar
    const btnCancelar = document.createElement('button');
    btnCancelar.id = 'cancelRoute';
    btnCancelar.innerHTML = '<i class="fas fa-times-circle"></i> Cancelar Rota';
    btnCancelar.className = 'btn btn-sm btn-danger';
    btnCancelar.style.position = 'absolute';
    btnCancelar.style.bottom = '20px';
    btnCancelar.style.left = '20px';
    btnCancelar.style.zIndex = '1000';
    btnCancelar.style.padding = '8px 12px';
    btnCancelar.style.backgroundColor = '#ef4444';
    btnCancelar.style.color = 'white';
    btnCancelar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

    btnCancelar.addEventListener('click', cancelarRota);

    // Adicionar ao mapa
    mapContainer.appendChild(btnCancelar);
}

// Função para cancelar a rota atual
function cancelarRota() {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;

        // Remover botão de instruções
        const botaoInstrucoes = document.getElementById('toggleInstructions');
        if (botaoInstrucoes) {
            botaoInstrucoes.remove();
        }

        // Remover container de instruções personalizado
        const containerInstrucoes = document.getElementById(
            'instrucoes-personalizadas'
        );
        if (containerInstrucoes) {
            containerInstrucoes.remove();
        }

        // Remover botão cancelar
        const botaoCancelar = document.getElementById('cancelRoute');
        if (botaoCancelar) {
            botaoCancelar.remove();
        }

        showNotification('Rota cancelada', 'success');
    }
}

// Fix for routing instructions overlay - run this when a route is created
function ocultarInstrucoesRota() {
    // Verificar primeiro se há rota ativa
    if (
        !routingControl ||
        !routingControl._routes ||
        routingControl._routes.length === 0
    ) {
        console.log('Sem rota ativa, não exibindo botão de instruções');
        return;
    }

    // Remover botão existente
    const botaoExistente = document.getElementById('toggleInstructions');
    if (botaoExistente) {
        botaoExistente.remove();
    }

    // Ocultar containers de instruções nativas do Leaflet
    const containers = document.querySelectorAll(
        '.leaflet-routing-container, ' +
            '.leaflet-routing-container-hide, ' +
            '.leaflet-routing-alternatives-container, ' +
            '.leaflet-control-container .leaflet-routing-container'
    );

    containers.forEach((container) => {
        container.style.display = 'none';
    });

    // Garantir que temos instruções para mostrar
    let temInstrucoes = false;

    if (
        routingControl &&
        routingControl._routes &&
        routingControl._routes[0] &&
        routingControl._routes[0].instructions &&
        routingControl._routes[0].instructions.length > 0
    ) {
        temInstrucoes = true;
    }

    if (!temInstrucoes) {
        console.log('Rota sem instruções, não exibindo botão');
        return;
    }

    // Adicionar botão de instruções somente se há instruções
    const mapContainer =
        document.querySelector('.leaflet-container') ||
        document.getElementById('map');
    if (!mapContainer) return;

    const btnToggle = document.createElement('button');
    btnToggle.id = 'toggleInstructions';
    btnToggle.innerHTML = '<i class="fas fa-directions"></i> Instruções';
    btnToggle.className = 'btn btn-sm btn-primary';
    btnToggle.style.position = 'absolute';
    btnToggle.style.bottom = '20px'; // Posicionado acima do botão cancelar
    btnToggle.style.right = '5px';
    btnToggle.style.zIndex = '1000';
    btnToggle.style.padding = '8px 12px';
    btnToggle.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

    btnToggle.addEventListener('click', function () {
        // Remover container personalizado existente
        const containerExistente = document.getElementById(
            'instrucoes-personalizadas'
        );
        if (containerExistente) {
            containerExistente.remove();
            btnToggle.innerHTML =
                '<i class="fas fa-directions"></i> Instruções';
        } else {
            // Criar novo container
            criarInstrucoesPersonalizadas(routingControl._routes[0]);
            btnToggle.innerHTML = '<i class="fas fa-times"></i> Fechar';
        }
    });

    mapContainer.appendChild(btnToggle);
}

function criarInstrucoesPersonalizadas(rota) {
    if (!rota || !rota.instructions || rota.instructions.length === 0) {
        console.error('Sem instruções disponíveis para exibir');
        return;
    }

    // Remover container existente se houver
    const containerExistente = document.getElementById(
        'instrucoes-personalizadas'
    );
    if (containerExistente) {
        containerExistente.remove();
    }

    // Criar div para o painel fora da estrutura de controles do Leaflet
    const container = document.createElement('div');
    container.id = 'instrucoes-personalizadas';
    container.className =
        'leaflet-control-instrucoes leaflet-bar leaflet-control';

    // Estilização para o container
    Object.assign(container.style, {
        position: 'absolute',
        top: '40px',
        right: '5px',
        backgroundColor: 'white',
        color: '#333',
        padding: '12px',
        borderRadius: '4px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.4)',
        width: '300px',
        maxHeight: '400px',
        overflowY: 'auto',
        zIndex: '1000',
    });

    // Adicionar título/cabeçalho arrastável
    const headerBar = document.createElement('div');
    headerBar.style.display = 'flex';
    headerBar.style.justifyContent = 'space-between';
    headerBar.style.alignItems = 'center';
    headerBar.style.marginBottom = '10px';
    headerBar.style.paddingBottom = '8px';
    headerBar.style.borderBottom = '1px solid #eee';
    headerBar.style.cursor = 'grab';
    headerBar.setAttribute('draggable', 'false'); // Evitar comportamento nativo de drag

    const tituloTexto = document.createElement('h4');
    tituloTexto.textContent = 'Instruções da Rota';
    tituloTexto.style.margin = '0';

    const btnClose = document.createElement('button');
    btnClose.innerHTML = '&times;';
    btnClose.style.background = 'none';
    btnClose.style.border = 'none';
    btnClose.style.fontSize = '20px';
    btnClose.style.cursor = 'pointer';
    btnClose.style.padding = '0 5px';

    btnClose.addEventListener('click', function () {
        container.remove();
        const btnToggle = document.getElementById('toggleInstructions');
        if (btnToggle) {
            btnToggle.innerHTML =
                '<i class="fas fa-directions"></i> Instruções';
        }
    });

    headerBar.appendChild(tituloTexto);
    headerBar.appendChild(btnClose);
    container.appendChild(headerBar);

    // Criar lista de instruções
    const lista = document.createElement('ul');
    lista.style.listStyleType = 'none';
    lista.style.padding = '0';
    lista.style.margin = '0';

    // Adicionar cada instrução com tradução
    rota.instructions.forEach((instrucao) => {
        const item = document.createElement('li');
        item.style.padding = '8px 0';
        item.style.borderBottom = '1px solid #eee';
        item.style.display = 'flex';

        // Ícone baseado no tipo de instrução
        let icone = 'arrow-right';
        if (instrucao.type === 'Left') icone = 'arrow-left';
        if (instrucao.type === 'Right') icone = 'arrow-right';
        if (instrucao.type === 'Straight') icone = 'arrow-up';
        if (instrucao.type === 'SharpLeft') icone = 'arrow-turn-down';
        if (instrucao.type === 'SharpRight') icone = 'arrow-turn-up';
        if (instrucao.type === 'SlightLeft') icone = 'share';
        if (instrucao.type === 'SlightRight') icone = 'reply';
        if (instrucao.type === 'Roundabout') icone = 'sync';
        if (instrucao.type === 'Destination') icone = 'map-marker-alt';

        const distancia = instrucao.distance
            ? instrucao.distance < 1000
                ? `${Math.round(instrucao.distance)}m`
                : `${(instrucao.distance / 1000).toFixed(1)}km`
            : '';

        // Traduzir a instrução
        const textoTraduzido = traduzirInstrucao(instrucao.text);

        item.innerHTML = `
<div style="min-width: 30px; text-align: center; padding-right: 10px;">
    <i class="fas fa-${icone}"></i>
</div>
<div style="flex: 1; overflow-wrap: break-word;">
    <div>${textoTraduzido}</div>
    ${distancia ? `<small style="color: #666;">${distancia}</small>` : ''}
</div>
`;

        lista.appendChild(item);
    });

    container.appendChild(lista);

    // Adicionar ao mapa
    const mapContainer =
        document.querySelector('.leaflet-container') ||
        document.getElementById('map');
    if (mapContainer) {
        mapContainer.appendChild(container);
    }

    // Implementar funcionalidade de arrastar
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    // Impedir que eventos de mouse afetem o mapa
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    // Função para iniciar arrasto no cabeçalho
    headerBar.addEventListener('mousedown', function (e) {
        // Apenas o botão esquerdo do mouse
        if (e.button !== 0) return;

        isDragging = true;
        headerBar.style.cursor = 'grabbing';

        // Obter posição inicial do mouse
        startX = e.clientX;
        startY = e.clientY;

        // Obter posição inicial do container
        const rect = container.getBoundingClientRect();
        const mapRect = mapContainer.getBoundingClientRect();

        startLeft = rect.left - mapRect.left;
        startTop = rect.top - mapRect.top;

        // Impedir seleção de texto durante arrasto
        e.preventDefault();

        // Capturar eventos em todo o documento
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
    });

    // Função para realizar o arrasto
    function handleDrag(e) {
        if (!isDragging) return;

        // Calcular nova posição
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // Calcular nova posição
        let newLeft = startLeft + dx;
        let newTop = startTop + dy;

        // Obter dimensões do mapa e container
        const mapWidth = mapContainer.offsetWidth;
        const mapHeight = mapContainer.offsetHeight;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Garantir que o painel permaneça dentro do mapa
        newLeft = Math.max(
            10,
            Math.min(mapWidth - containerWidth - 10, newLeft)
        );
        newTop = Math.max(
            10,
            Math.min(mapHeight - containerHeight - 10, newTop)
        );

        // Aplicar nova posição
        container.style.left = newLeft + 'px';
        container.style.right = 'auto'; // Importante para não conflitar com 'left'
        container.style.top = newTop + 'px';
    }

    // Função para finalizar arrasto
    function stopDrag() {
        if (isDragging) {
            isDragging = false;
            headerBar.style.cursor = 'grab';

            // Remover eventos temporários
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }

    // Adicionar indicador visual para arrastar
    const dragIndicator = document.createElement('div');
    dragIndicator.innerHTML = '<i class="fas fa-grip-lines"></i>';
    dragIndicator.style.marginRight = '10px';
    dragIndicator.style.opacity = '0.5';
    headerBar.insertBefore(dragIndicator, tituloTexto);
}

// Função para traduzir as instruções de inglês para português
function traduzirInstrucao(texto) {
    // Substituições de termos comuns
    let traduzido = texto
        .replace(/Turn right onto/g, 'Vire à direita em')
        .replace(/Turn left onto/g, 'Vire à esquerda em')
        .replace(/Turn right/g, 'Vire à direita')
        .replace(/Turn left/g, 'Vire à esquerda')
        .replace(/Go straight onto/g, 'Siga em frente em')
        .replace(/Go straight/g, 'Siga em frente')
        .replace(/Keep right/g, 'Mantenha-se à direita')
        .replace(/Keep left/g, 'Mantenha-se à esquerda')
        .replace(
            /Keep left at the fork/g,
            'Mantenha-se à esquerda na bifurcação'
        )
        .replace(
            /Keep right at the fork/g,
            'Mantenha-se à direita na bifurcação'
        )
        .replace(/at the fork/g, 'na bifurcação') // Tradução de "at the fork" restante
        .replace(/Make a sharp right/g, 'Faça uma curva fechada à direita')
        .replace(/Make a sharp left/g, 'Faça uma curva fechada à esquerda')
        .replace(/Make a slight right/g, 'Faça uma leve curva à direita')
        .replace(/Make a slight left/g, 'Faça uma leve curva à esquerda')
        .replace(/Continue onto/g, 'Continue em')
        .replace(/Head southwest on/g, 'Siga para sudoeste em')
        .replace(/Head south on/g, 'Siga para sul em')
        .replace(/Head north on/g, 'Siga para norte em')
        .replace(/Head northeast on/g, 'Siga para nordeste em')
        .replace(/Head northwest on/g, 'Siga para noroeste em')
        .replace(/Head southeast on/g, 'Siga para sudeste em')
        .replace(/Head east on/g, 'Siga para leste em')
        .replace(/Head west on/g, 'Siga para oeste em')
        .replace(/Enter the roundabout/g, 'Entre na rotatória')
        .replace(/Exit the roundabout/g, 'Saia da rotatória')
        .replace(/Take the ([0-9]+)(?:st|nd|rd|th) exit/g, 'Pegue a $1ª saída')
        .replace(
            /You have arrived at your destination/g,
            'Você chegou ao seu destino'
        )
        .replace(/([0-9]+) m/g, '$1 m')
        .replace(/([0-9]+\.[0-9]+) km/g, '$1 km');

    return traduzido;
}

// Chame após inicializar a rota
ocultarInstrucoesRota();

// Substitua seu código atual de criação de marcadores por este
function criarMarcadorVeiculo(veiculo, latLng) {
    const htmlMarcador = `
<div style="background-color: white; border-radius: 50%; width: 60px; height: 60px; 
            display: flex; flex-direction: column; align-items: center; justify-content: center; 
            border: 2px solid #3388ff; padding: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
    <img src="${obterImagemTipoVeiculo(veiculo.tipo)}" 
         style="width: 32px; height: 32px; object-fit: contain;">
    <div style="font-size: 10px; text-align: center; white-space: nowrap; 
               overflow: hidden; text-overflow: ellipsis; width: 50px; margin-top: 2px;">
        ${veiculo.preco || 'Preço não informado'}
    </div>
</div>
`;

    return L.marker(latLng, {
        icon: L.divIcon({
            html: htmlMarcador,
            className: '',
            iconSize: [60, 60],
            iconAnchor: [30, 30],
        }),
    });
}

// Função para inicializar o mapa com a criação dos marcadores
function inicializarMapa(veiculos) {
    if (map !== null) {
        if (routingControl) {
            map.removeControl(routingControl);
            routingControl = null;
        }
        markers.forEach((marker) => map.removeLayer(marker));
        markers = [];
        map.remove();
        map = null;
    }

    map = L.map('map');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Se não houver userLocation definida, tente obter a localização atual
    if (!userLocation) {
        // Verificar se já estamos tentando obter a localização para evitar múltiplas chamadas
        const isGettingLocation = sessionStorage.getItem('gettingLocation');

        if (navigator.geolocation && !isGettingLocation) {
            sessionStorage.setItem('gettingLocation', 'true');

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    sessionStorage.removeItem('gettingLocation');
                    userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    // Reinicializar o mapa com a localização obtida
                    inicializarMapa(veiculos);
                },
                function (error) {
                    sessionStorage.removeItem('gettingLocation');
                    console.error('Erro ao obter localização:', error);
                    // Centralizar no Brasil como fallback
                    if (map) map.setView([-14.235, -51.9253], 4);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000,
                }
            );

            // Definir uma visualização padrão enquanto aguarda a localização
            map.setView([-14.235, -51.9253], 4);
            return;
        }
    }

    // Adicionar marcador para a localização do usuário se disponível
    if (userLocation) {
        // Normaliza a estrutura de userLocation
        if (!userLocation.latitude && userLocation.lat) {
            userLocation.latitude = userLocation.lat;
        }
        if (!userLocation.longitude && userLocation.lng) {
            userLocation.longitude = userLocation.lng;
        }
        if (!userLocation.lat && userLocation.latitude) {
            userLocation.lat = userLocation.latitude;
        }
        if (!userLocation.lng && userLocation.longitude) {
            userLocation.lng = userLocation.longitude;
        }

        try {
            const userMarker = L.marker(
                [
                    userLocation.latitude || userLocation.lat,
                    userLocation.longitude || userLocation.lng,
                ],
                {
                    icon: L.divIcon({
                        className: 'user-location-marker',
                        html: `<div style="background-color:#4CAF50; border-radius:50%; width:20px; height:20px; border:3px solid white;"></div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                    }),
                }
            )
                .addTo(map)
                .bindPopup('Sua localização atual');

            // Adicionar círculo para raio de pesquisa
            const distanciaMax = parseInt(
                document.getElementById('distanciaMaxFiltro').value
            );
            if (distanciaMax && distanciaMax > 0) {
                L.circle(
                    [
                        userLocation.latitude || userLocation.lat,
                        userLocation.longitude || userLocation.lng,
                    ],
                    {
                        radius: distanciaMax * 1000, // Converte km para metros
                        color: 'var(--primary-color)',
                        fillColor: 'var(--primary-color)',
                        fillOpacity: 0.1,
                        weight: 1,
                    }
                ).addTo(map);
            }

            // Centralizar o mapa na localização do usuário imediatamente
            map.setView(
                [
                    userLocation.latitude || userLocation.lat,
                    userLocation.longitude || userLocation.lng,
                ],
                14
            );
        } catch (error) {
            console.error('Erro ao adicionar marcador de usuário:', error);
        }
    }

    if (!veiculos || veiculos.length === 0) {
        if (userLocation && (userLocation.latitude || userLocation.lat)) {
            map.setView(
                [
                    userLocation.latitude || userLocation.lat,
                    userLocation.longitude || userLocation.lng,
                ],
                14
            );
        } else {
            map.setView([-14.235, -51.9253], 4); // Centro do Brasil
        }
        return;
    }

    const grupo = L.featureGroup();

    veiculos.forEach((veiculo) => {
        try {
            // Só cria marcador se latitude e longitude estiverem definidos
            if (
                veiculo.latitude !== undefined &&
                veiculo.longitude !== undefined
            ) {
                let classeTipo = '';
                let valorExibir = '';

                // Determinar valor a exibir e classe de cor com base no preço
                if (
                    veiculo.formaCobranca === 'minuto' &&
                    veiculo.valorPorMinuto !== undefined
                ) {
                    valorExibir = `R$${veiculo.valorPorMinuto.toFixed(2)}/min`;
                    if (veiculo.valorPorMinuto <= 0.5) {
                        classeTipo = ' mapa-marcador-barato';
                    } else if (veiculo.valorPorMinuto >= 2) {
                        classeTipo = ' mapa-marcador-caro';
                    }
                } else if (
                    veiculo.formaCobranca === 'hora' &&
                    veiculo.valorPorHora !== undefined
                ) {
                    valorExibir = `R$${veiculo.valorPorHora.toFixed(2)}/h`;
                    if (veiculo.valorPorHora <= 20) {
                        classeTipo = ' mapa-marcador-barato';
                    } else if (veiculo.valorPorHora >= 80) {
                        classeTipo = ' mapa-marcador-caro';
                    }
                } else if (veiculo.valorPorDia !== undefined) {
                    valorExibir = `R$${veiculo.valorPorDia.toFixed(2)}/dia`;
                    if (veiculo.valorPorDia <= 80) {
                        classeTipo = ' mapa-marcador-barato';
                    } else if (veiculo.valorPorDia >= 200) {
                        classeTipo = ' mapa-marcador-caro';
                    }
                } else {
                    valorExibir = `Preço não informado`;
                }

                // Obter imagem em miniatura
                const imagemMiniatura =
                    veiculo.imagens && veiculo.imagens.length > 0
                        ? veiculo.imagens[0]
                        : obterImagemTipoVeiculo(veiculo.tipo);

                // Calcular a distância entre usuário e veículo
                let distanciaTexto = '';
                if (
                    userLocation &&
                    (userLocation.latitude || userLocation.lat)
                ) {
                    const lat1 = userLocation.latitude || userLocation.lat;
                    const lng1 = userLocation.longitude || userLocation.lng;
                    const distancia = calcularDistancia(
                        lat1,
                        lng1,
                        veiculo.latitude,
                        veiculo.longitude
                    );

                    if (distancia < 1) {
                        distanciaTexto = `${Math.round(distancia * 1000)} m`;
                    } else {
                        distanciaTexto = `${distancia.toFixed(1)} km`;
                    }
                }

                // Criar o novo marcador com seta e miniatura
                const iconHTML = L.divIcon({
                    className: '',
                    html: `
                <div class="mapa-marcador${classeTipo}">${valorExibir}</div>
                <div class="mapa-miniatura">
                    <img src="${imagemMiniatura}" alt="${
                        veiculo.tipo || 'Veículo'
                    }">
                </div>
            `,
                    iconSize: [110, 45], // Tamanho do container do ícone
                    iconAnchor: [55, 25], // Ponto de ancoragem (centro, parte inferior)
                });

                const marker = L.marker([veiculo.latitude, veiculo.longitude], {
                    icon: iconHTML,
                    veiculoId: veiculo.id,
                });

                // Popup para o marcador
                marker.bindPopup(`
            <div style="text-align: center; font-family: 'Poppins', sans-serif; width: 200px;">
                <strong>${veiculo.marca || ''} ${
                    veiculo.modelo || ''
                }</strong><br>
                <img src="${imagemMiniatura}" style="width: 100px; height: 70px; object-fit: cover; margin: 5px 0; border-radius: 5px;"><br>
                <span style="font-size: 0.9rem; color: #2563eb;">${valorExibir}</span>
                ${
                    distanciaTexto
                        ? `<br><span style="font-size: 0.8rem;">Distância: ${distanciaTexto}</span>`
                        : ''
                }
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                    <button onclick="abrirModalDetalhes('${
                        veiculo.id
                    }')" style="flex: 1; background: #2563eb; color: white; padding: 3px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-info-circle"></i> Detalhes
                    </button>
                    <button onclick="solicitarLocacao('${
                        veiculo.id
                    }')" style="flex: 1; background: #2563eb; color: white; padding: 3px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-car"></i> Solicitar
                    </button>
                </div>
                <button onclick="criarRotaParaVeiculo('${
                    veiculo.id
                }')" style="width: 100%; margin-top: 5px; background: #38bdf8; color: #0f172a; padding: 3px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    <i class="fas fa-route"></i> Gerar Rota
                </button>
            </div>
        `);

                marker.on('click', function () {
                    if (routingControl) {
                        map.removeControl(routingControl);
                        routingControl = null;
                    }
                });

                marker.addTo(grupo);
                markers.push(marker);
            }
        } catch (error) {
            console.error('Erro ao processar veículo:', error, veiculo);
        }
    });

    try {
        grupo.addTo(map);

        if (markers.length > 0) {
            map.fitBounds(grupo.getBounds(), { padding: [50, 50] });
        } else if (
            userLocation &&
            (userLocation.latitude || userLocation.lat)
        ) {
            map.setView(
                [
                    userLocation.latitude || userLocation.lat,
                    userLocation.longitude || userLocation.lng,
                ],
                14
            );
        } else {
            map.setView([-14.235, -51.9253], 4);
        }
    } catch (error) {
        console.error('Erro ao finalizar o mapa:', error);
        map.setView([-14.235, -51.9253], 4);
    }
}

// Carregar veículos no mapa
function carregarVeiculosNoMapa(veiculos) {
    veiculos.forEach((veiculo) => {
        // Verificar se o veículo tem coordenadas válidas
        if (veiculo.latitude && veiculo.longitude) {
            // Criar o marcador usando as coordenadas no formato esperado pelo mapa
            const marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(veiculo.latitude),
                    lng: parseFloat(veiculo.longitude),
                },
                map: map,
                title: `${veiculo.marca} ${veiculo.modelo}`,
                // Adicione outros atributos do marcador conforme necessário
            });

            // Adicione info window ou outras funcionalidades
        }
    });
}

// Verificação de disponibilidade com base no calendário do locador
function verificarDisponibilidade(veiculo, dataInicio, dataFim) {
    // Se não tiver dados de disponibilidade, assume que está disponível
    if (!veiculo.disponibilidade) return true;

    // Se não tiver datas selecionadas, assume que está disponível
    if (!dataInicio || !dataFim) return true;

    // Converter datas de string para objetos Date
    const inicio = new Date(dataInicio);
    inicio.setHours(0, 0, 0, 0); // Início do dia

    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59, 999); // Fim do dia

    // Verificar cada dia no intervalo
    for (
        let dia = new Date(inicio);
        dia <= fim;
        dia.setDate(dia.getDate() + 1)
    ) {
        const diaSemana = dia.getDay(); // 0 = Domingo, 1 = Segunda, etc.

        // Verificar se o dia da semana está disponível
        if (
            veiculo.disponibilidade.diasSemana &&
            !veiculo.disponibilidade.diasSemana[diaSemana]
        )
            return false;

        // Verificar se o dia específico está marcado como indisponível
        const dataFormatada = dia.toISOString().split('T')[0];
        if (
            veiculo.disponibilidade.diasIndisponiveis &&
            veiculo.disponibilidade.diasIndisponiveis.includes(dataFormatada)
        )
            return false;
    }

    // Verificar se já existe uma locação para este período
    const locacoes = JSON.parse(localStorage.getItem('locacoes')) || [];
    const locacoesVeiculo = locacoes.filter(
        (loc) => loc.veiculoId === veiculo.id
    );

    for (const locacao of locacoesVeiculo) {
        if (!locacao.dataInicio || !locacao.dataFim) continue;

        const locacaoInicio = new Date(locacao.dataInicio);
        locacaoInicio.setHours(0, 0, 0, 0);

        const locacaoFim = new Date(locacao.dataFim);
        locacaoFim.setHours(23, 59, 59, 999);

        // Verificar sobreposição de datas
        if (
            (inicio <= locacaoFim && fim >= locacaoInicio) ||
            (locacaoInicio <= fim && locacaoFim >= inicio)
        ) {
            return false;
        }
    }

    return true;
}

// Cálculo de preços conforme definido pelo locador
function calcularPrecoLocacao(
    veiculo,
    dataInicio,
    dataFim,
    horas = 0,
    minutos = 0
) {
    if (!dataInicio || !dataFim) return null;

    // Cobrança por minutos ou horas (ignora datas)
    if (veiculo.formaCobranca === 'minuto' && minutos > 0) {
        return (minutos * veiculo.valorPorMinuto).toFixed(2);
    }

    if (veiculo.formaCobranca === 'hora' && horas > 0) {
        return (horas * veiculo.valorPorHora).toFixed(2);
    }

    // Cobrança por dia (baseado nas datas)
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    // Diferença em milissegundos
    const diferencaMs = fim - inicio;

    if (veiculo.formaCobranca === 'minuto') {
        const minutos = Math.ceil(diferencaMs / (1000 * 60));
        return (minutos * veiculo.valorPorMinuto).toFixed(2);
    } else if (veiculo.formaCobranca === 'hora') {
        const horas = Math.ceil(diferencaMs / (1000 * 60 * 60));
        return (horas * veiculo.valorPorHora).toFixed(2);
    } else {
        // Padrão: por dia
        const dias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));
        return (dias * veiculo.valorPorDia).toFixed(2);
    }
}

// Função melhorada de paginação
function renderizarPaginacao(totalItens) {
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);
    this.totalPaginas = totalPaginas;

    const paginacaoContainer = document.getElementById('paginacao');
    paginacaoContainer.innerHTML = '';

    if (totalPaginas <= 1) return;

    // Botão para página anterior
    if (paginaAtual > 1) {
        const btnAnterior = document.createElement('button');
        btnAnterior.className = 'paginacao-btn';
        btnAnterior.innerHTML = '&laquo; Anterior';
        btnAnterior.onclick = () => mudarPagina(paginaAtual - 1);
        paginacaoContainer.appendChild(btnAnterior);
    }

    // Determinar quais números de página mostrar
    let startPage = Math.max(1, paginaAtual - 2);
    let endPage = Math.min(totalPaginas, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    // Renderizar botões de página
    for (let i = startPage; i <= endPage; i++) {
        const btnPagina = document.createElement('button');
        btnPagina.className =
            'paginacao-btn' + (i === paginaAtual ? ' active' : '');
        btnPagina.textContent = i;
        btnPagina.onclick = () => mudarPagina(i);
        paginacaoContainer.appendChild(btnPagina);
    }

    // Botão para próxima página
    if (paginaAtual < totalPaginas) {
        const btnProximo = document.createElement('button');
        btnProximo.className = 'paginacao-btn';
        btnProximo.innerHTML = 'Próximo &raquo;';
        btnProximo.onclick = () => mudarPagina(paginaAtual + 1);
        paginacaoContainer.appendChild(btnProximo);
    }
}

function mudarPagina(novaPagina) {
    paginaAtual = novaPagina;
    atualizarListaVeiculos();
}

function mudarItensPorPagina() {
    itensPorPagina = parseInt(document.getElementById('itensPorPagina').value);
    paginaAtual = 1; // Voltar para a primeira página
    atualizarListaVeiculos();
}

function atualizarListaVeiculos() {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const veiculosPaginados = veiculosFiltradosGlobal.slice(inicio, fim);

    const veiculosDisponiveis = document.getElementById('veiculosDisponiveis');
    veiculosDisponiveis.innerHTML = '';

    veiculosPaginados.forEach((veiculo) => renderizarCardVeiculo(veiculo));
    renderizarPaginacao(veiculosFiltradosGlobal.length);
}

// Função atualizada para carregar e filtrar veículos
async function carregarVeiculosAtualizado(filtros = {}) {
    mostrarLoader();

    // Inicializa o array de veículos logo no início
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];

    // Garantir que todos os veículos tenham coordenadas
    for (const veiculo of veiculos) {
        if (!veiculo.latitude || !veiculo.longitude) {
            if (veiculo.cep) {
                // Supondo que buscarCoordenadasPorCEP retorne um objeto com latitude e longitude
                const coords = await buscarCoordenadasPorCEP(veiculo.cep);
                if (coords) {
                    veiculo.latitude = coords.latitude;
                    veiculo.longitude = coords.longitude;
                    // Atualiza no localStorage
                    localStorage.setItem('veiculos', JSON.stringify(veiculos));
                }
            } else if (veiculo.endereco) {
                // Tentar obter coordenadas pelo endereço
                const coords = await buscarCoordenadasPorCidade(
                    veiculo.endereco
                );
                if (coords) {
                    veiculo.latitude = coords.latitude;
                    veiculo.longitude = coords.longitude;
                    // Atualiza no localStorage
                    localStorage.setItem('veiculos', JSON.stringify(veiculos));
                }
            }
        }
    }

    const veiculosDisponiveis = document.getElementById('veiculosDisponiveis');
    veiculosDisponiveis.innerHTML = '';

    // Calcular distâncias se a localização do usuário estiver disponível
    if (userLocation) {
        veiculos.forEach((veiculo) => {
            if (veiculo.latitude && veiculo.longitude) {
                veiculo.distanciaDoUsuario = calcularDistancia(
                    userLocation.latitude || userLocation.lat,
                    userLocation.longitude || userLocation.lng,
                    veiculo.latitude,
                    veiculo.longitude
                );
            } else {
                veiculo.distanciaDoUsuario = Infinity;
            }
        });
    }

    // Filtrar os veículos com base nos critérios (filtros)
    let veiculosFiltrados = veiculos.filter((veiculo) => {
        // Filtros de tipo, marca, modelo
        if (filtros.tipo && veiculo.tipo !== filtros.tipo) return false;
        if (
            filtros.marca &&
            !veiculo.marca?.toLowerCase().includes(filtros.marca.toLowerCase())
        )
            return false;

        // Filtros de preço
        if (filtros.valorMax) {
            if (
                veiculo.formaCobranca === 'minuto' &&
                veiculo.valorPorMinuto * 60 > filtros.valorMax
            )
                return false;
            if (
                veiculo.formaCobranca === 'hora' &&
                veiculo.valorPorHora > filtros.valorMax
            )
                return false;
            if (
                (veiculo.formaCobranca === 'dia' || !veiculo.formaCobranca) &&
                veiculo.valorPorDia > filtros.valorMax
            )
                return false;
        }

        // Filtros de motor e combustível
        if (filtros.motor && veiculo.motor !== filtros.motor) return false;
        if (filtros.combustivel && veiculo.combustivel !== filtros.combustivel)
            return false;

        // Filtro de motorização
        if (filtros.motorizacao) {
            if (filtros.motorizacao === 'maior') {
                if (
                    !veiculo.motorizacao ||
                    parseFloat(veiculo.motorizacao) <= 2.0
                )
                    return false;
            } else if (
                !veiculo.motorizacao ||
                veiculo.motorizacao !== filtros.motorizacao
            ) {
                return false;
            }
        }

        // Filtro de capacidade
        if (
            filtros.capacidade &&
            (!veiculo.capacidadePassageiros ||
                parseInt(veiculo.capacidadePassageiros) <
                    parseInt(filtros.capacidade))
        ) {
            return false;
        }

        // Filtro de finalidade
        if (filtros.finalidade && veiculo.finalidade !== filtros.finalidade)
            return false;

        // Filtro de ano mínimo
        if (
            filtros.anoMin &&
            (!veiculo.ano || parseInt(veiculo.ano) < parseInt(filtros.anoMin))
        ) {
            return false;
        }

        // Filtro de distância máxima
        if (filtros.distanciaMax && userLocation) {
            if (
                !veiculo.distanciaDoUsuario ||
                veiculo.distanciaDoUsuario > parseFloat(filtros.distanciaMax)
            ) {
                return false;
            }
        }

        // Verificar disponibilidade se datas forem fornecidas
        if (filtros.dataInicio && filtros.dataFim) {
            if (
                !verificarDisponibilidade(
                    veiculo,
                    filtros.dataInicio,
                    filtros.dataFim
                )
            ) {
                return false;
            }
        }

        return true;
    });

    // Se houver filtro por cidade, filtrar com base nas coordenadas da cidade
    if (filtros.cidade) {
        const coordenadasCidade = await buscarCoordenadasPorCidade(
            filtros.cidade
        );
        if (coordenadasCidade) {
            veiculosFiltrados = veiculosFiltrados.filter((veiculo) => {
                if (!veiculo.latitude || !veiculo.longitude) return false;
                const distancia = calcularDistancia(
                    coordenadasCidade.latitude,
                    coordenadasCidade.longitude,
                    veiculo.latitude,
                    veiculo.longitude
                );
                return distancia <= 30; // Limite de 30 km de raio
            });
        } else {
            showNotification(
                'Cidade não encontrada. Verifique o nome e tente novamente.',
                'warning'
            );
        }
    }

    // Ordenar veículos conforme selecionado
    if (filtros.ordenarPor) {
        switch (filtros.ordenarPor) {
            case 'distancia':
                veiculosFiltrados.sort(
                    (a, b) =>
                        (a.distanciaDoUsuario || Infinity) -
                        (b.distanciaDoUsuario || Infinity)
                );
                break;
            case 'precoAsc':
                veiculosFiltrados.sort((a, b) => {
                    const precoA =
                        a.formaCobranca === 'minuto'
                            ? a.valorPorMinuto * 60
                            : a.formaCobranca === 'hora'
                            ? a.valorPorHora
                            : a.valorPorDia;
                    const precoB =
                        b.formaCobranca === 'minuto'
                            ? b.valorPorMinuto * 60
                            : b.formaCobranca === 'hora'
                            ? b.valorPorHora
                            : b.valorPorDia;
                    return precoA - precoB;
                });
                break;
            case 'precoDesc':
                veiculosFiltrados.sort((a, b) => {
                    const precoA =
                        a.formaCobranca === 'minuto'
                            ? a.valorPorMinuto * 60
                            : a.formaCobranca === 'hora'
                            ? a.valorPorHora
                            : a.valorPorDia;
                    const precoB =
                        b.formaCobranca === 'minuto'
                            ? b.valorPorMinuto * 60
                            : b.formaCobranca === 'hora'
                            ? b.valorPorHora
                            : b.valorPorDia;
                    return precoB - precoA;
                });
                break;
            case 'anoDesc':
                veiculosFiltrados.sort(
                    (a, b) => (parseInt(b.ano) || 0) - (parseInt(a.ano) || 0)
                );
                break;
        }
    } else if (userLocation) {
        // Por padrão, ordenar por proximidade se a localização estiver disponível
        veiculosFiltrados.sort(
            (a, b) =>
                (a.distanciaDoUsuario || Infinity) -
                (b.distanciaDoUsuario || Infinity)
        );
    }

    // Salvar veículos filtrados para paginação
    veiculosFiltradosGlobal = veiculosFiltrados;

    // Exibe mensagem se não houver veículos filtrados
    if (veiculosFiltrados.length === 0) {
        veiculosDisponiveis.innerHTML =
            '<p class="text-center" style="width: 100%; text-align: center; padding: 20px;">Não há veículos disponíveis com esses filtros.</p>';
        inicializarMapa([]);
        esconderLoader();
        return;
    }

    // Reset para primeira página quando filtros são aplicados
    paginaAtual = 1;

    // Renderizar apenas os veículos da página atual
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const veiculosPaginados = veiculosFiltrados.slice(inicio, fim);

    // Renderiza os veículos da página atual
    veiculosPaginados.forEach((veiculo) =>
        renderizarCardVeiculo(veiculo, filtros)
    );

    // Renderizar controles de paginação
    renderizarPaginacao(veiculosFiltrados.length);

    // Atualiza o mapa com todos os veículos filtrados (sem paginação no mapa)
    inicializarMapa(veiculosFiltrados);
    esconderLoader();
}

function limparECarregarVeiculos() {
    // Limpar a lista atual de veículos
    const veiculosDisponiveis = document.getElementById('veiculosDisponiveis');
    if (veiculosDisponiveis) {
        veiculosDisponiveis.innerHTML = '';
    }

    // Recarregar os veículos com os filtros atuais
    aplicarFiltros();
}

// Função melhorada para renderizar card de veículo
function renderizarCardVeiculo(veiculo) {
    try {
        const veiculosDisponiveis = document.getElementById(
            'veiculosDisponiveis'
        );
        if (!veiculosDisponiveis) return;

        const card = document.createElement('div');
        card.className = 'veiculo-card';
        card.dataset.id = veiculo.id;

        // Pegar a imagem principal
        const imagemPrincipal =
            veiculo.imagens && veiculo.imagens.length > 0
                ? veiculo.imagens[0]
                : obterImagemTipoVeiculo(veiculo.tipo);

        // Calcular distância do usuário
        let distanciaTexto = 'Distância indisponível';
        try {
            if (userLocation && veiculo.latitude && veiculo.longitude) {
                const userLat = userLocation.latitude || userLocation.lat;
                const userLng = userLocation.longitude || userLocation.lng;

                if (userLat && userLng) {
                    const distancia = calcularDistancia(
                        userLat,
                        userLng,
                        parseFloat(veiculo.latitude),
                        parseFloat(veiculo.longitude)
                    );

                    if (
                        distancia !== undefined &&
                        distancia !== null &&
                        distancia !== Infinity &&
                        !isNaN(distancia)
                    ) {
                        distanciaTexto =
                            distancia < 1
                                ? `${Math.round(distancia * 1000)}m`
                                : `${distancia.toFixed(1)}km`;

                        veiculo.distanciaDoUsuario = distancia;
                    }
                }
            }
        } catch (error) {
            console.error('Erro no cálculo de distância:', error);
        }

        // Formatar valor com base na forma de cobrança
        let valorExibido = 'Preço não informado';

        if (
            veiculo.formaCobranca === 'minuto' &&
            veiculo.valorPorMinuto !== undefined
        ) {
            valorExibido = `R$ ${(veiculo.valorPorMinuto || 0).toFixed(
                2
            )}/minuto`;
        } else if (
            veiculo.formaCobranca === 'hora' &&
            veiculo.valorPorHora !== undefined
        ) {
            valorExibido = `R$ ${(veiculo.valorPorHora || 0).toFixed(2)}/hora`;
        } else if (veiculo.valorPorDia !== undefined) {
            valorExibido = `R$ ${(veiculo.valorPorDia || 0).toFixed(2)}/dia`;
        }

        // Criar HTML do card
        const isDesktop = window.innerWidth >= 992;

        // Estrutura de detalhes para desktop (em grid)
        const detalhesDesktop = `
    <div class="card-details">
        <p><strong>Tipo:</strong> ${veiculo.tipo || 'Não especificado'}</p>
        ${veiculo.ano ? `<p><strong>Ano:</strong> ${veiculo.ano}</p>` : ''}
        ${
            veiculo.motor
                ? `<p><strong>Motor:</strong> ${veiculo.motor} ${
                      veiculo.motorizacao || ''
                  }</p>`
                : ''
        }
        ${
            veiculo.combustivel
                ? `<p><strong>Combustível:</strong> ${veiculo.combustivel}</p>`
                : ''
        }
        ${
            veiculo.capacidadePassageiros
                ? `<p><strong>Capacidade:</strong> ${veiculo.capacidadePassageiros} pessoas</p>`
                : ''
        }
        <p><strong>Valor:</strong> <span class="preco">${valorExibido}</span></p>
        <p><strong>Localização:</strong> ${
            veiculo.endereco
                ? veiculo.endereco.substring(0, 30) + '...'
                : 'Não informada'
        }</p>
    </div>
`;

        // Estrutura de detalhes para mobile (em lista)
        const detalhesMobile = `
    <p><strong>Tipo:</strong> ${veiculo.tipo || 'Não especificado'}</p>
    ${veiculo.ano ? `<p><strong>Ano:</strong> ${veiculo.ano}</p>` : ''}
    ${
        veiculo.motor
            ? `<p><strong>Motor:</strong> ${veiculo.motor} ${
                  veiculo.motorizacao || ''
              }</p>`
            : ''
    }
    ${
        veiculo.combustivel
            ? `<p><strong>Combustível:</strong> ${veiculo.combustivel}</p>`
            : ''
    }
    ${
        veiculo.capacidadePassageiros
            ? `<p><strong>Capacidade:</strong> ${veiculo.capacidadePassageiros} pessoas</p>`
            : ''
    }
    <p><strong>Valor:</strong> <span class="preco">${valorExibido}</span></p>
    <p><strong>Localização:</strong> ${veiculo.endereco || 'Não informada'}</p>
`;

        card.innerHTML = `
    <div class="card-imagem">
        <img src="${imagemPrincipal}"
            alt="${veiculo.modelo || veiculo.tipo || 'Veículo'}"
            onclick="abrirVisualizador('${veiculo.id}')" />
        ${
            veiculo.imagens && veiculo.imagens.length > 1
                ? `<small>+${veiculo.imagens.length - 1} imagens</small>`
                : ''
        }
    </div>
    <div class="card-info">
        <h3>
            ${veiculo.marca || ''} ${
            veiculo.modelo || 'Modelo não especificado'
        }
            ${
                veiculo.distanciaDoUsuario !== undefined
                    ? `<span class="distance-badge"><i class="fas fa-map-marker-alt"></i> ${
                          veiculo.distanciaDoUsuario < 1
                              ? `${Math.round(
                                    veiculo.distanciaDoUsuario * 1000
                                )}m`
                              : `${veiculo.distanciaDoUsuario.toFixed(1)}km`
                      }</span>`
                    : ''
            }
        </h3>
        ${isDesktop ? detalhesDesktop : detalhesMobile}
        <div class="card-buttons">
            <button onclick="abrirModalDetalhes('${
                veiculo.id
            }')" class="btn-card">
                <i class="fas fa-info-circle"></i> Detalhes
            </button>
            <button onclick="solicitarLocacao('${
                veiculo.id
            }')" class="btn-solicitar">
                <i class="fas fa-car"></i> Solicitar
            </button>
        </div>
        <button onclick="criarRotaParaVeiculo('${
            veiculo.id
        }')" class="btn-rota">
            <i class="fas fa-route"></i> Gerar Rota até o Veículo
        </button>
    </div>
`;

        veiculosDisponiveis.appendChild(card);

        // Adicionar listener para adaptar o layout quando o tamanho da janela mudar
        window.addEventListener('resize', function () {
            const isDesktopNow = window.innerWidth >= 992;
            if (isDesktopNow !== isDesktop) {
                // Recarregar os cards se o viewport mudar entre desktop e mobile
                limparECarregarVeiculos();
            }
        });
    } catch (error) {
        console.error('Erro ao renderizar card de veículo:', error);
    }
}

// Função para enviar solicitação
function enviarSolicitacao() {
    const motivo = document.getElementById('motivoSolicitacao').value.trim();

    if (!motivo) {
        showNotification('O motivo da solicitação é obrigatório.', 'error');
        return;
    }

    if (!veiculoSolicitarId) {
        showNotification('Erro ao identificar o veículo.', 'error');
        return;
    }

    mostrarLoader();
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        window.location.href = 'index.html';
        return;
    }

    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculoSelecionado = veiculos.find(
        (v) => v.id === veiculoSolicitarId
    );

    if (!veiculoSelecionado) {
        esconderLoader();
        showNotification('Veículo não encontrado.', 'error');
        return;
    }

    const novaSolicitacao = {
        id: gerarIdUnico(),
        locadorId: veiculoSelecionado.locadorId,
        locatarioId: usuarioLogado.id,
        veiculoId: veiculoSelecionado.id,
        motivo: motivo,
        status: 'pendente',
        respostaLocador: '',
        dataSolicitacao: new Date().toISOString(),
        mensagens: [], // Inicializa o array de mensagens
    };

    const solicitacoesExistentes =
        JSON.parse(localStorage.getItem('solicitacoes')) || [];
    solicitacoesExistentes.push(novaSolicitacao);
    localStorage.setItem(
        'solicitacoes',
        JSON.stringify(solicitacoesExistentes)
    );

    esconderLoader();
    showNotification('Solicitação enviada com sucesso!', 'success');
    fecharModalSolicitar();
    listarMinhasSolicitacoes();
}

// Função para aceitar solicitação
function aceitarSolicitacao(idSolicitacao) {
    const motivo = prompt(
        'Deseja aceitar esta solicitação? Você pode adicionar uma mensagem opcional:'
    );

    const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
    const index = solicitacoes.findIndex((s) => s.id === idSolicitacao);

    if (index !== -1) {
        solicitacoes[index].status = 'aceito';
        if (motivo) {
            solicitacoes[index].mensagemAceite = motivo;
        }
        localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));

        showNotification('Solicitação aceita! O chat foi liberado.', 'success');
        listarSolicitacoes(); // Ou listarMinhasSolicitacoes() no locatário

        // Se for o locador, abrir o chat automaticamente
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (usuarioLogado.tipoUsuario === 'locador') {
            abrirChat(idSolicitacao);
        }
    }
}

// Utilitários
function gerarIdUnico() {
    return 'solic_' + Math.floor(Math.random() * 1000000);
}

// Função para buscar coordenadas por cidade
async function buscarCoordenadasPorCidade(endereco) {
    if (!endereco || typeof endereco !== 'string' || endereco.trim() === '') {
        console.error('Endereço inválido:', endereco);
        return null;
    }

    // Verifica no cache primeiro
    const chaveCache = endereco.toLowerCase().trim();
    if (coordenadasCache[chaveCache]) {
        return coordenadasCache[chaveCache];
    }

    // Normaliza o endereço
    const enderecoNormalizado = endereco
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // Tenta primeiro com o endereço completo
    let coordenadas = await buscarCoordenadasNoNominatim(enderecoNormalizado);
    if (coordenadas) {
        coordenadasCache[chaveCache] = coordenadas;
        return coordenadas;
    }

    // Se não encontrou, tenta apenas com a cidade e estado
    const partes = enderecoNormalizado.split(',');
    if (partes.length >= 2) {
        const cidadeEstado = partes
            .slice(-2)
            .map((p) => p.trim())
            .join(', ');
        coordenadas = await buscarCoordenadasNoNominatim(cidadeEstado);
        if (coordenadas) {
            coordenadasCache[chaveCache] = coordenadas;
            return coordenadas;
        }
    }

    // Se ainda não encontrou, tenta apenas com a cidade
    if (partes.length >= 1) {
        const cidade = partes[0].trim();
        coordenadas = await buscarCoordenadasNoNominatim(cidade);
        if (coordenadas) {
            coordenadasCache[chaveCache] = coordenadas;
            return coordenadas;
        }
    }

    console.error('Não foi possível encontrar coordenadas para:', endereco);
    return null;
}

// Função para buscar coordenadas por CEP
async function buscarCoordenadasPorCEP(cep) {
    // Remove caracteres não numéricos
    cep = cep.replace(/\D/g, '');

    if (cep.length !== 8) {
        console.error('CEP inválido:', cep);
        return null;
    }

    // Verifica cache primeiro
    if (coordenadasCache[cep]) {
        return coordenadasCache[cep];
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            console.error('CEP não encontrado:', cep);
            return null;
        }

        // Monta o endereço completo para geocodificação
        const endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;

        // Usa o Nominatim para obter as coordenadas
        const coordenadas = await buscarCoordenadasNoNominatim(endereco);

        if (coordenadas) {
            coordenadasCache[cep] = coordenadas;
            return coordenadas;
        }

        return null;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        return null;
    }
}

// Função para buscar coordenadas usando Nominatim
async function buscarCoordenadasNoNominatim(query) {
    try {
        const controller = new AbortController();
        // Aumentamos o timeout para 10 segundos
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
        )}&limit=1`;
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'LoCar-App/1.0', // Identificar o app para evitar bloqueios
            },
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
            };
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar no Nominatim:', error);
        return null;
    }
}

function resetarFiltros() {
    const campos = [
        'tipoFiltro',
        'cidadeFiltro',
        'valorMaxFiltro',
        'motorFiltro',
        'combustivelFiltro',
        'motorizacaoFiltro',
        'capacidadeFiltro',
        'finalidadeFiltro',
        'marcaFiltro',
        'dataInicio',
        'dataFim',
        'anoMinFiltro',
        'distanciaMaxFiltro',
        'ordenarPor',
    ];

    campos.forEach((id) => {
        const elem = document.getElementById(id);
        if (elem) {
            if (elem.tagName === 'SELECT') {
                elem.value = '';
            } else {
                elem.value = '';
            }
        }
    });

    document.getElementById('ordenarPor').value = 'distancia';
    carregarVeiculosAtualizado();
}

// Configurar tema
function configurarTema() {
    const btnToggle = document.getElementById('toggleTheme');

    // Verifica se o botão existe antes de adicionar o listener
    if (btnToggle) {
        btnToggle.addEventListener('click', () => {
            let currentTheme = localStorage.getItem('theme') || 'dark';
            let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            aplicarTema(newTheme);
        });
    }

    // Aplicar tema salvo ao carregar
    aplicarTema(localStorage.getItem('theme') || 'dark');
}

function aplicarTema() {
    // Aplica sempre o tema dark
    document.documentElement.style.setProperty('--background-dark', '#0f172a');
    document.documentElement.style.setProperty('--text-light', '#e2e8f0');
    document.documentElement.style.setProperty('--card-bg', '#1e293b');
    document.documentElement.style.setProperty('--card-border', '#334155');

    // Aplicar estilos diretamente ao body e elementos-chave para garantir consistência
    document.body.style.background = 'var(--background-dark)';
    document.body.style.color = 'var(--text-light)';

    // Aplicar estilo aos cards de veículos
    const cards = document.querySelectorAll('.veiculo-card, .solicitacao-card');
    cards.forEach((card) => {
        card.style.backgroundColor = 'var(--card-bg)';
        card.style.borderColor = 'var(--card-border)';
    });
}

// Mostrar loader
function mostrarLoader() {
    document.getElementById('globalLoader').style.display = 'flex';
}

function esconderLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}

// Mostrar notificação
function showNotification(message, type) {
    Swal.fire({
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 1500,
    });
}

// Notification System Functions
function getNotifications() {
    return JSON.parse(localStorage.getItem('notificacoes') || '[]');
}

function saveNotifications(notifications) {
    localStorage.setItem('notificacoes', JSON.stringify(notifications));
}

function createNotification(type, title, message, relatedId = null) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const notification = {
        id: 'notif_' + Date.now(),
        type: type, // message, request_approved, request_rejected, etc.
        title: title,
        message: message,
        timestamp: new Date().toISOString(),
        read: false,
        userId: usuarioLogado.id,
        relatedId: relatedId, // ID of the related object (request, vehicle, etc.)
    };

    const notifications = getNotifications();
    notifications.push(notification);
    saveNotifications(notifications);

    // Update UI
    updateNotificationBadge();

    // If notifications tab is active, update the list
    if (
        document.getElementById('notificacoes') &&
        document.getElementById('notificacoes').classList.contains('active')
    ) {
        displayNotifications();
    }

    return notification;
}

function markNotificationAsRead(notificationId) {
    const notifications = getNotifications();
    const index = notifications.findIndex((n) => n.id === notificationId);

    if (index !== -1) {
        notifications[index].read = true;
        saveNotifications(notifications);
        updateNotificationBadge();
        displayNotifications();
    }
}

function markAllNotificationsAsRead() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const notifications = getNotifications();
    let updated = false;

    notifications.forEach((notif) => {
        if (notif.userId === usuarioLogado.id && !notif.read) {
            notif.read = true;
            updated = true;
        }
    });

    if (updated) {
        saveNotifications(notifications);
        updateNotificationBadge();
        displayNotifications();
    }
}

function deleteNotification(notificationId) {
    const notifications = getNotifications();
    const updatedNotifications = notifications.filter(
        (n) => n.id !== notificationId
    );

    if (updatedNotifications.length !== notifications.length) {
        saveNotifications(updatedNotifications);
        updateNotificationBadge();
        displayNotifications();
    }
}

function updateNotificationBadge() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const notifications = getNotifications();
    const unreadCount = notifications.filter(
        (n) => n.userId === usuarioLogado.id && !n.read
    ).length;

    // Get the notifications menu item
    const notificationItem = document.querySelector(
        '.menu-item[data-tab="notificacoes"]'
    );

    if (notificationItem) {
        // Remove existing badge if present
        const existingBadge = notificationItem.querySelector(
            '.notification-badge'
        );
        if (existingBadge) {
            existingBadge.remove();
        }

        // Add badge if there are unread notifications
        if (unreadCount > 0) {
            const badge = document.createElement('span');
            badge.className = 'notification-badge';
            badge.textContent = unreadCount;
            notificationItem.appendChild(badge);
        }
    }
}

function formatTimestamp(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return 'Agora';
    if (diffMin < 60) return `Há ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
    if (diffHour < 24) return `Há ${diffHour} hora${diffHour > 1 ? 's' : ''}`;
    if (diffDay < 30) return `Há ${diffDay} dia${diffDay > 1 ? 's' : ''}`;

    return date.toLocaleDateString('pt-BR');
}

function displayNotifications() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const notifications = getNotifications();
    const userNotifications = notifications.filter(
        (n) => n.userId === usuarioLogado.id
    );
    const container = document.getElementById('listaNotificacoes');

    if (!container) return;

    container.innerHTML = '';

    if (userNotifications.length === 0) {
        container.innerHTML =
            '<p style="text-align: center;">Você não possui notificações.</p>';
        return;
    }

    // Sort notifications by timestamp (newest first)
    userNotifications.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    userNotifications.forEach((notification) => {
        // Format the timestamp
        const timestamp = formatTimestamp(notification.timestamp);

        // Choose icon based on notification type
        let icon = 'bell';
        if (notification.type === 'message') icon = 'comment';
        if (notification.type === 'request_approved') icon = 'check-circle';
        if (notification.type === 'request_rejected') icon = 'times-circle';
        if (notification.type === 'feedback') icon = 'star';

        // Create notification element
        const notificationEl = document.createElement('div');
        notificationEl.className = 'notification-item';
        if (!notification.read) {
            notificationEl.classList.add('notification-unread');
        }

        notificationEl.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <strong>${notification.title}</strong>
                <p>${notification.message}</p>
                <div class="notification-time">${timestamp}</div>
            </div>
            <div class="notification-actions">
                ${
                    notification.relatedId && notification.type === 'message'
                        ? `<button class="btn-chat" onclick="abrirChat('${notification.relatedId}')">
                    <i class="fas fa-comment"></i>
                </button>`
                        : ''
                }
                ${
                    !notification.read
                        ? `<button class="btn-mark-read" onclick="markNotificationAsRead('${notification.id}')">
                    <i class="fas fa-check"></i>
                </button>`
                        : ''
                }
                <button class="btn-delete" onclick="deleteNotification('${
                    notification.id
                }')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        container.appendChild(notificationEl);
    });

    // Add "Mark All as Read" button if there are unread notifications
    if (userNotifications.some((n) => !n.read)) {
        const markAllButton = document.createElement('button');
        markAllButton.className = 'btn btn-primary';
        markAllButton.style.marginTop = '15px';
        markAllButton.textContent = 'Marcar todas como lidas';
        markAllButton.onclick = markAllNotificationsAsRead;
        container.appendChild(markAllButton);
    }
}

// Function to check for new messages and create notifications - CORRECTED
function checkForNewMessages() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    // Obter mensagens já notificadas
    const notifiedMessageIds = JSON.parse(
        localStorage.getItem('tenantNotifiedMessageIds') || '[]'
    );

    const solicitacoes = JSON.parse(
        localStorage.getItem('solicitacoes') || '[]'
    );
    const minhasSolicitacoes = solicitacoes.filter(
        (s) =>
            s.locatarioId === usuarioLogado.id ||
            s.locadorId === usuarioLogado.id
    );

    let hasNewMessages = false;
    const newlyNotifiedMessageIds = [];

    minhasSolicitacoes.forEach((solicitacao) => {
        if (!solicitacao.mensagens) return;

        // Filtrar mensagens não lidas que não foram enviadas pelo usuário logado e ainda não foram notificadas
        const newMessages = solicitacao.mensagens.filter((msg) => {
            const messageId = `${solicitacao.id}_${msg.id}`;
            return (
                !msg.lida &&
                msg.remetenteId !== usuarioLogado.id &&
                !notifiedMessageIds.includes(messageId)
            );
        });

        if (newMessages.length > 0) {
            hasNewMessages = true;

            // Obter informações do remetente e veículo
            const usuarios = JSON.parse(
                localStorage.getItem('usuarios') || '[]'
            );
            const veiculos = JSON.parse(
                localStorage.getItem('veiculos') || '[]'
            );

            const senderId = newMessages[0].remetenteId;
            const sender = usuarios.find((u) => u.id === senderId);
            const veiculo = veiculos.find(
                (v) => v.id === solicitacao.veiculoId
            );

            const senderName = sender ? sender.nome : 'Usuário';
            const veiculoName = veiculo
                ? `${veiculo.marca} ${veiculo.modelo}`
                : 'veículo';

            // Criar notificação apenas para a mensagem mais recente não lida
            createNotification(
                'message',
                'Nova mensagem',
                `${senderName} enviou uma mensagem sobre o ${veiculoName}.`,
                solicitacao.id
            );

            // Marcar todas as mensagens como notificadas
            newMessages.forEach((msg) => {
                const messageId = `${solicitacao.id}_${msg.id}`;
                newlyNotifiedMessageIds.push(messageId);
            });
        }
    });

    // Atualizar lista de mensagens já notificadas
    if (newlyNotifiedMessageIds.length > 0) {
        localStorage.setItem(
            'tenantNotifiedMessageIds',
            JSON.stringify([...notifiedMessageIds, ...newlyNotifiedMessageIds])
        );
    }

    return hasNewMessages;
}

// Function to check for request status changes - FIXED VERSION
function checkForRequestStatusChanges() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    // Get the last checked timestamp
    const lastCheckedTimestamp =
        localStorage.getItem('lastCheckedRequests') || '0';
    console.log('Last checked timestamp:', lastCheckedTimestamp);
    const currentTimestamp = Date.now().toString();

    // Get all requests
    const solicitacoes = JSON.parse(
        localStorage.getItem('solicitacoes') || '[]'
    );
    const minhasSolicitacoes = solicitacoes.filter(
        (s) => s.locatarioId === usuarioLogado.id
    );
    console.log('Minhas solicitações:', minhasSolicitacoes.length);

    let hasStatusChanges = false;

    // Get the last known states if available
    const lastKnownStates = JSON.parse(
        localStorage.getItem('lastKnownRequestStates') || '{}'
    );
    const currentStates = {};

    minhasSolicitacoes.forEach((solicitacao) => {
        // Store current state for next check
        currentStates[solicitacao.id] = solicitacao.status;

        // Get previous state if available
        const previousState = lastKnownStates[solicitacao.id];

        // Check if status has changed or if this is a new request
        const statusChanged =
            previousState && previousState !== solicitacao.status;

        console.log(
            `Solicitação ${solicitacao.id}: status atual = ${
                solicitacao.status
            }, status anterior = ${previousState || 'novo'}`
        );

        // If status changed or dataAtualizacao is newer than lastCheckedTimestamp
        const updatedTimestamp =
            solicitacao.dataAtualizacao || solicitacao.dataCriacao || '0';
        const isRecent = updatedTimestamp > lastCheckedTimestamp;

        if (statusChanged || (isRecent && !previousState)) {
            hasStatusChanges = true;
            console.log(
                `Detectada mudança de status ou solicitação recente: ${solicitacao.id}`
            );

            // Get vehicle information
            const veiculos = JSON.parse(
                localStorage.getItem('veiculos') || '[]'
            );
            const veiculo = veiculos.find(
                (v) => v.id === solicitacao.veiculoId
            );
            const veiculoName = veiculo
                ? `${veiculo.marca} ${veiculo.modelo}`
                : 'veículo';

            // Normalize status for comparison (case insensitive)
            const normalizedStatus = solicitacao.status
                ? solicitacao.status.toLowerCase()
                : '';

            // Check for accepted status - handle various possible formats
            if (
                normalizedStatus === 'aceito' ||
                normalizedStatus === 'aceita' ||
                normalizedStatus === 'aprovado' ||
                normalizedStatus === 'aprovada' ||
                normalizedStatus === 'approved' ||
                normalizedStatus === 'accepted'
            ) {
                console.log(
                    `Criando notificação para solicitação aprovada: ${solicitacao.id}`
                );

                createNotification(
                    'request_approved',
                    'Solicitação aprovada!',
                    `Sua solicitação para o ${veiculoName} foi aprovada.`,
                    solicitacao.id
                );
            }
            // Check for rejected status - handle various possible formats
            else if (
                normalizedStatus === 'recusado' ||
                normalizedStatus === 'recusada' ||
                normalizedStatus === 'negado' ||
                normalizedStatus === 'negada' ||
                normalizedStatus === 'rejected' ||
                normalizedStatus === 'denied'
            ) {
                console.log(
                    `Criando notificação para solicitação recusada: ${solicitacao.id}`
                );

                createNotification(
                    'request_rejected',
                    'Solicitação recusada',
                    `Sua solicitação para o ${veiculoName} foi recusada.${
                        solicitacao.respostaLocador
                            ? ' Motivo: ' + solicitacao.respostaLocador
                            : ''
                    }`,
                    solicitacao.id
                );
            }
        }
    });

    // Save current states for next check
    localStorage.setItem(
        'lastKnownRequestStates',
        JSON.stringify(currentStates)
    );

    // Update the last checked timestamp
    localStorage.setItem('lastCheckedRequests', currentTimestamp);

    return hasStatusChanges;
}

// Adicione este código ao painel do LOCATÁRIO

// Função para verificar solicitações aceitas pelo locador
function checkForAcceptedRequests() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    console.log('Verificando solicitações aceitas...');

    // Obter notificações já enviadas
    const notifiedAcceptances = JSON.parse(
        localStorage.getItem('notifiedAcceptances') || '[]'
    );

    // Obter todas as solicitações do locatário
    const solicitacoes = JSON.parse(
        localStorage.getItem('solicitacoes') || '[]'
    );
    const minhasSolicitacoes = solicitacoes.filter(
        (s) => s.locatarioId === usuarioLogado.id
    );

    let hasStatusChanges = false;
    const newlyNotifiedAcceptances = [];

    minhasSolicitacoes.forEach((solicitacao) => {
        // Verificar se já notificamos esta aceitação
        if (
            solicitacao.status === 'aceito' &&
            !notifiedAcceptances.includes(solicitacao.id)
        ) {
            hasStatusChanges = true;

            // Buscar informações do veículo e locador
            const veiculos = JSON.parse(
                localStorage.getItem('veiculos') || '[]'
            );
            const usuarios = JSON.parse(
                localStorage.getItem('usuarios') || '[]'
            );

            const veiculo = veiculos.find(
                (v) => v.id === solicitacao.veiculoId
            );
            const locador = usuarios.find(
                (u) => u.id === solicitacao.locadorId
            );

            const veiculoName = veiculo
                ? `${veiculo.marca} ${veiculo.modelo}`
                : 'veículo';
            const locadorName = locador ? locador.nome : 'Locador';

            // Criar notificação
            createNotification(
                'request_accepted',
                'Solicitação aceita',
                `${locadorName} aceitou sua solicitação para o ${veiculoName}.`,
                solicitacao.id
            );

            // Adicionar à lista de notificações
            newlyNotifiedAcceptances.push(solicitacao.id);
        }
    });

    // Salvar aceitações já notificadas
    if (newlyNotifiedAcceptances.length > 0) {
        localStorage.setItem(
            'notifiedAcceptances',
            JSON.stringify([
                ...notifiedAcceptances,
                ...newlyNotifiedAcceptances,
            ])
        );
    }

    return hasStatusChanges;
}

// Adicionar esta chamada à função que verifica todas as notificações no painel do locatário
function checkNotifications() {
    const hasNewMessages = checkForNewMessages(); // Se existir essa função no painel do locatário
    const hasAcceptedRequests = checkForAcceptedRequests();

    // Se houver novas notificações, atualizar o badge
    if (hasNewMessages || hasAcceptedRequests) {
        updateNotificationBadge();

        // Se a aba de notificações estiver aberta, atualizar a exibição
        if (
            document.getElementById('notificacoes') &&
            document.getElementById('notificacoes').classList.contains('active')
        ) {
            displayNotifications();
        }
    }
}

// Função de inicialização completa
function initializeNotifications() {
    // Atualizar badge de notificações
    updateNotificationBadge();

    // Adicionar event listener para a aba de notificações
    const notificationTab = document.querySelector(
        '.menu-item[data-tab="notificacoes"]'
    );
    if (notificationTab) {
        notificationTab.addEventListener('click', function () {
            displayNotifications();
        });
    }

    // Verificar notificações imediatamente
    checkNotifications();

    // Configurar verificação periódica (apenas uma vez)
    setInterval(checkNotifications, 30000);

    // Adicionar event listener para marcar notificações como lidas quando abrir chat
    document.body.addEventListener('click', function (e) {
        // Find if the clicked element or its parent has an onclick with abrirChat
        let target = e.target;
        while (target && target !== document.body) {
            if (
                target.hasAttribute('onclick') &&
                target.getAttribute('onclick').includes('abrirChat')
            ) {
                // Extract solicitacao ID from onclick attribute
                const onclickAttr = target.getAttribute('onclick');
                const match = onclickAttr.match(
                    /abrirChat\(['"]([^'"]+)['"]\)/
                );

                if (match && match[1]) {
                    const solicitacaoId = match[1];

                    // Mark related notifications as read
                    const notifications = getNotifications();
                    let updated = false;

                    notifications.forEach((notif) => {
                        if (notif.relatedId === solicitacaoId && !notif.read) {
                            notif.read = true;
                            updated = true;
                        }
                    });

                    if (updated) {
                        saveNotifications(notifications);
                        updateNotificationBadge();
                    }
                }
                break;
            }
            target = target.parentElement;
        }
    });
}

// Inicializar apenas uma vez quando a página carregar
document.addEventListener('DOMContentLoaded', initializeNotifications);
