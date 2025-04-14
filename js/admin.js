// =================== VARIÁVEIS GLOBAIS ===================
let chartStatusUsuarios = null;
let chartLocacoes = null;
let chartAprovacoes = null;
let chartAvaliacoes = null;
let isDarkTheme = true;
let imagensAtuais = [];
let indiceImagemAtual = 0;

// Idioma atual (se não definido, padrão "pt")
let lang = localStorage.getItem('lang') || 'pt';

// =================== OBJETO DE TRADUÇÕES ===================
const adminTraducoes = {
    pt: {
        dashboard: 'Dashboard',
        usuarios: 'Usuários',
        locacoes: 'Locações',
        veiculos: 'Veículos',
        relatorios: 'Relatórios',
        configuracoes: 'Configurações',
        sair: 'Sair',

        // Cards
        usuariosTotais: 'Usuários Totais',
        locadoresLabel: 'Locadores',
        locatariosLabel: 'Locatários',
        cadastrosPendentes: 'Cadastros Pendentes',
        totalLocacoesLabel: 'Total de Locações',
        veiculosCadastradosLabel: 'Veículos Cadastrados',
        totalReportacoesLabel: 'Total de Reportações',
        modeloLabel: 'Modelo',
        tipoLabel: 'Tipo',
        anoLabel: 'Ano',
        valorLabel: 'Valor',
        localizacaoLabel: 'Localização',

        // Seções e filtros
        pendentesTitle: '⏳ Cadastros Pendentes',
        aprovadosTitle: '✅ Usuários Aprovados',
        recusadosTitle: '❌ Usuários Recusados',
        locacoesTitle: '🚗 Histórico de Locações',
        veiculosTitle: '🚗 Veículos Cadastrados',
        relatoriosTitle: '📄 Relatórios e Estatísticas',
        configuracoesTitle: '⚙️ Configurações do Admin',
        aplicarfiltro: 'Aplicar Filtro',
        filterLocalizacaoPlaceholder: 'Filtrar por Localização',
        filterStatusLabel: 'Status',
        filterTipoLabel: 'Tipo de Usuário',
        filterModeloLabel: 'Modelo',
        filterTipoVeiculoLabel: 'Tipo de Veículo',
        filterAnoLabel: 'Ano',
        filterLocalVeiculoLabel: 'Localização',
        filterLocacaoLocalLabel: 'Localização',
        filterLocacaoTipoLabel: 'Tipo de Locação',
        filterRelatorioCidadeLabel: 'Cidade',
        filterRelatorioTipoVeiculoLabel: 'Tipo de Veículo',
        filterRelatorioModeloLabel: 'Modelo',
        filterRelatorioStatusLabel: 'Status de Usuário',
        telefoneLabel: 'Telefone',
        enderecoLabel: 'Endereço',

        // Seletor de opções
        todosStatus: 'Todos Status',
        todosTipos: 'Todos Tipos',
        todos: 'Todos',
        todosTiposVeiculo: 'Todos os Tipos de Veículo',
        todosUsuarios: 'Todos Usuários',

        // Exportação
        exportarCSV: 'Exportar CSV',
        exportarPDF: 'Exportar PDF',

        // Alteração de senha
        changePasswordBtn: 'Alterar Senha',
        cancelChangePassword: 'Cancelar Alteração',
        currentPasswordPlaceholder: 'Senha Atual',
        newPasswordPlaceholder: 'Nova Senha',
        confirmPasswordPlaceholder: 'Confirmar Nova Senha',
        confirmChangePassword: 'Confirmar Alteração',

        // Logs
        acessosTitle: 'Registro de Acessos',
        registroDeModificacoes: 'Registro de Modificações',

        // Modais e Detalhes
        detalhesUsuarioTitle: 'Detalhes do Usuário',
        fechar: 'Fechar',
        verReportacoes: 'Ver Reportações',
        adicionarReportacao: 'Adicionar Reportação',
        motivoRecusaPlaceholder: 'Motivo da recusa:',

        // Botões de ação
        recusarBtn: 'Recusar',
        cancelarBtn: 'Cancelar',
        habilitarBtn: 'Habilitar',
        aprovarBtn: 'Aprovar',

        // Logout modal
        logoutTitle: 'Até logo!',
        logoutText: 'Você será redirecionado em breve.',

        // Status
        statusPendente: 'Pendente',
        statusAprovado: 'Aprovado',
        statusRecusado: 'Recusado',

        // Tipos de usuário
        tipoAdmin: 'Administrador',
        tipoLocador: 'Locador',
        tipoLocatario: 'Locatário',

        // Mensagens
        nenhumRegistro: 'Nenhum registro encontrado',
        nenhumVeiculo: 'Nenhum veículo cadastrado',
        nenhumLocador: 'Nenhum locador cadastrado',
        nenhumaLocacao: 'Nenhuma locação encontrada',
        reportacaoVazia: 'A reportação não pode estar vazia',
        motivoObrigatorio: 'Você deve informar um motivo',
        senhaAtualIncorreta: 'Senha atual incorreta',
        senhasNaoCoincidem: 'Nova senha e confirmação não coincidem',
        reportacaoAdicionada: 'Reportação adicionada',
        usuarioAprovado: 'Usuário aprovado',
        usuarioRecusado: 'Usuário recusado',
        usuarioReabilitado: 'Usuário reabilitado',

        filtrarPorModelo: 'Filtrar por Modelo',
        filtrarPorTipo: 'Filtrar por Tipo',
        filtrarPorAno: 'Filtrar por Ano',

        todososTiposDeVeículo: 'Todos os Tipos de Veículo',
        carro: 'Carro',
        moto: 'Moto',
        caminhão: 'Caminhão',
        SUV: 'SUV',
        filtrarPorModelo: 'Filtrar por Modelo',

        admin: 'Administrador',
        email: 'Email',
        confirmarAlteração: 'Confirmar Alteração',
        registroDeAcessos: 'Registro de Acessos',
        mais: 'mais',

        ultimoAcesso: 'Último Acesso',
        ultimaSaida: 'Última Saída',
        sair: 'Sair',

        senhaAtual: 'Senha Atual',
        novaSenha: 'Nova Senha',
        confirmarSenha: 'Confirmar Nova Senha',
        confirmarAlteracao: 'Confirmar Alteração',

        reportacaoAdicionada: 'Reportação adicionada',
        motivo: 'motivo',
        reabilitadoParaAnalise: 'reabilitado para nova análise',
    },
    en: {
        dashboard: 'Dashboard',
        usuarios: 'Users',
        locacoes: 'Rentals',
        veiculos: 'Vehicles',
        relatorios: 'Reports',
        configuracoes: 'Settings',
        sair: 'Logout',

        usuariosTotais: 'Total Users',
        locadoresLabel: 'Renters',
        locatariosLabel: 'Lessees',
        cadastrosPendentes: 'Pending Registrations',
        totalLocacoesLabel: 'Total Rentals',
        veiculosCadastradosLabel: 'Registered Vehicles',
        totalReportacoesLabel: 'Total Reports',
        modeloLabel: 'Model',
        tipoLabel: 'Type',
        anoLabel: 'Year',
        valorLabel: 'Value',
        localizacaoLabel: 'Location',

        pendentesTitle: '⏳ Pending Registrations',
        aprovadosTitle: '✅ Approved Users',
        recusadosTitle: '❌ Rejected Users',
        locacoesTitle: '🚗 Rental History',
        veiculosTitle: '🚗 Registered Vehicles',
        relatoriosTitle: '📄 Reports and Statistics',
        configuracoesTitle: '⚙️ Admin Settings',
        aplicarfiltro: 'Apply Filter',
        filterLocalizacaoPlaceholder: 'Filter by Location',
        filterStatusLabel: 'Status',
        filterTipoLabel: 'User Type',
        filterModeloLabel: 'Model',
        filterTipoVeiculoLabel: 'Vehicle Type',
        filterAnoLabel: 'Year',
        filterLocalVeiculoLabel: 'Location',
        filterLocacaoLocalLabel: 'Location',
        filterLocacaoTipoLabel: 'Rental Type',
        filterRelatorioCidadeLabel: 'City',
        filterRelatorioTipoVeiculoLabel: 'Vehicle Type',
        filterRelatorioModeloLabel: 'Model',
        filterRelatorioStatusLabel: 'User Status',
        telefoneLabel: 'Phone',
        enderecoLabel: 'Address',

        todosStatus: 'All Statuses',
        todosTipos: 'All Types',
        todos: 'All',
        todosTiposVeiculo: 'All Vehicle Types',
        todosUsuarios: 'All Users',

        exportarCSV: 'Export CSV',
        exportarPDF: 'Export PDF',

        changePasswordBtn: 'Change Password',
        cancelChangePassword: 'Cancel Change',
        currentPasswordPlaceholder: 'Current Password',
        newPasswordPlaceholder: 'New Password',
        confirmPasswordPlaceholder: 'Confirm New Password',
        confirmChangePassword: 'Confirm Change',

        acessosTitle: 'Access Log',
        registroDeModificacoes: 'Modification Log',

        detalhesUsuarioTitle: 'User Details',
        fechar: 'Close',
        verReportacoes: 'View Reports',
        adicionarReportacao: 'Add Report',
        motivoRecusaPlaceholder: 'Reason for rejection:',

        recusarBtn: 'Reject',
        cancelarBtn: 'Cancel',
        habilitarBtn: 'Enable',
        aprovarBtn: 'Approve',

        logoutTitle: 'Goodbye!',
        logoutText: 'You will be redirected shortly.',

        statusPendente: 'Pending',
        statusAprovado: 'Approved',
        statusRecusado: 'Rejected',

        tipoAdmin: 'Admin',
        tipoLocador: 'Renter',
        tipoLocatario: 'Lessee',

        nenhumRegistro: 'No records found',
        nenhumVeiculo: 'No vehicles registered',
        nenhumLocador: 'No renters registered',
        nenhumaLocacao: 'No rentals found',
        reportacaoVazia: 'Report cannot be empty',
        motivoObrigatorio: 'You must provide a reason',
        senhaAtualIncorreta: 'Current password is incorrect',
        senhasNaoCoincidem: 'New password and confirmation do not match',
        reportacaoAdicionada: 'Report added',
        usuarioAprovado: 'User approved',
        usuarioRecusado: 'User rejected',
        usuarioReabilitado: 'User re-enabled',

        filtrarPorModelo: 'Filter by Model',
        filtrarPorTipo: 'Filter by Type',
        filtrarPorAno: 'Filter by Year',

        todososTiposDeVeículo: 'All Vehicle Types',
        carro: 'Car',
        moto: 'Motorcycle',
        caminhão: 'Truck',
        SUV: 'SUV',

        admin: 'Admin',
        email: 'Email',
        confirmarAlteração: 'Confirm Change',
        registroDeAcessos: 'Access Log',
        mais: 'more',
        ultimaSaida: 'Last Exit',
        sair: 'Logout',
        ultimoAcesso: 'Last Access',

        senhaAtual: 'Current Password',
        novaSenha: 'New Password',
        confirmarSenha: 'Confirm New Password',
        confirmarAlteracao: 'Confirm Change',

        reportacaoAdicionada: 'Report added',
        motivo: 'reason',
        reabilitadoParaAnalise: 're-enabled for review',
    },
    es: {
        dashboard: 'Tablero',
        usuarios: 'Usuarios',
        locacoes: 'Alquileres',
        veiculos: 'Vehículos',
        relatorios: 'Informes',
        configuracoes: 'Configuraciones',
        sair: 'Salir',

        usuariosTotais: 'Usuarios Totales',
        locadoresLabel: 'Arrendadores',
        locatariosLabel: 'Arrendatarios',
        cadastrosPendentes: 'Registros Pendientes',
        totalLocacoesLabel: 'Total de Alquileres',
        veiculosCadastradosLabel: 'Vehículos Registrados',
        totalReportacoesLabel: 'Total de Reportes',
        modeloLabel: 'Modelo',
        tipoLabel: 'Tipo',
        anoLabel: 'Año',
        valorLabel: 'Valor',
        localizacaoLabel: 'Ubicación',

        pendentesTitle: '⏳ Registros Pendientes',
        aprovadosTitle: '✅ Usuarios Aprobados',
        recusadosTitle: '❌ Usuarios Rechazados',
        locacoesTitle: '🚗 Historial de Alquileres',
        veiculosTitle: '🚗 Vehículos Registrados',
        relatoriosTitle: '📄 Informes y Estadísticas',
        configuracoesTitle: '⚙️ Configuraciones del Admin',
        aplicarfiltro: 'Aplicar Filtro',
        filterLocalizacaoPlaceholder: 'Filtrar por Ubicación',
        filterStatusLabel: 'Estado',
        filterTipoLabel: 'Tipo de Usuario',
        filterModeloLabel: 'Modelo',
        filterTipoVeiculoLabel: 'Tipo de Vehículo',
        filterAnoLabel: 'Año',
        filterLocalVeiculoLabel: 'Ubicación',
        filterLocacaoLocalLabel: 'Ubicación',
        filterLocacaoTipoLabel: 'Tipo de Alquiler',
        filterRelatorioCidadeLabel: 'Ciudad',
        filterRelatorioTipoVeiculoLabel: 'Tipo de Vehículo',
        filterRelatorioModeloLabel: 'Modelo',
        filterRelatorioStatusLabel: 'Estado de Usuario',
        telefoneLabel: 'Teléfono',
        enderecoLabel: 'Dirección',

        todosStatus: 'Todos los Estados',
        todosTipos: 'Todos los Tipos',
        todos: 'Todos',
        todosTiposVeiculo: 'Todos los Tipos de Vehículo',
        todosUsuarios: 'Todos los Usuarios',

        exportarCSV: 'Exportar CSV',
        exportarPDF: 'Exportar PDF',

        changePasswordBtn: 'Cambiar Contraseña',
        cancelChangePassword: 'Cancelar Cambio',
        currentPasswordPlaceholder: 'Contraseña Actual',
        newPasswordPlaceholder: 'Nueva Contraseña',
        confirmPasswordPlaceholder: 'Confirmar Nueva Contraseña',
        confirmChangePassword: 'Confirmar Cambio',

        acessosTitle: 'Registro de Accesos',
        registroDeModificacoes: 'Registro de Modificaciones',

        detalhesUsuarioTitle: 'Detalles del Usuario',
        fechar: 'Cerrar',
        verReportacoes: 'Ver Reportes',
        adicionarReportacao: 'Agregar Reporte',
        motivoRecusaPlaceholder: 'Motivo del rechazo:',

        recusarBtn: 'Rechazar',
        cancelarBtn: 'Cancelar',
        habilitarBtn: 'Habilitar',
        aprovarBtn: 'Aprobar',

        logoutTitle: '¡Adiós!',
        logoutText: 'Serás redirigido en breve.',

        statusPendente: 'Pendiente',
        statusAprovado: 'Aprobado',
        statusRecusado: 'Rechazado',

        tipoAdmin: 'Admin',
        tipoLocador: 'Arrendador',
        tipoLocatario: 'Arrendatario',

        nenhumRegistro: 'No se encontraron registros',
        nenhumVeiculo: 'No hay vehículos registrados',
        nenhumLocador: 'No hay arrendadores registrados',
        nenhumaLocacao: 'No se encontraron alquileres',
        reportacaoVazia: 'El reporte no puede estar vacío',
        motivoObrigatorio: 'Debes proporcionar un motivo',
        senhaAtualIncorreta: 'La contraseña actual es incorrecta',
        senhasNaoCoincidem:
            'La nueva contraseña y la confirmación no coinciden',
        reportacaoAdicionada: 'Reporte agregado',
        usuarioAprovado: 'Usuario aprobado',
        usuarioRecusado: 'Usuario rechazado',
        usuarioReabilitado: 'Usuario rehabilitado',

        filtrarPorModelo: 'Filtrar por Modelo',
        filtrarPorTipo: 'Filtrar por Tipo',
        filtrarPorAno: 'Filtrar por Año',

        todososTiposDeVeículo: 'Todos los Tipos de Vehículo',
        carro: 'Coche',
        moto: 'Motocicleta',
        caminhão: 'Camión',
        SUV: 'SUV',

        admin: 'Administrador',
        email: 'Correo Electrónico',
        confirmarAlteração: 'Confirmar Cambio',
        registroDeAcessos: 'Registro de Accesos',
        mais: 'más',
        ultimaSaida: 'Última Salida',
        sair: 'Salir',
        ultimoAcesso: 'Último Acceso',

        senhaAtual: 'Contraseña Actual',
        novaSenha: 'Nueva Contraseña',
        confirmarSenha: 'Confirmar Nueva Contraseña',
        confirmarAlteracao: 'Confirmar Cambio',

        reportacaoAdicionada: 'Reporte agregado',
        motivo: 'motivo',
        reabilitadoParaAnalise: 'rehabilitado para revisión',
    },
};

// =================== FUNÇÕES DE TRADUÇÃO ===================
function t(key) {
    return adminTraducoes[lang][key] || adminTraducoes['pt'][key] || key;
}

function setLanguage(l) {
    if (!['pt', 'en', 'es'].includes(l)) l = 'pt';
    lang = l;
    localStorage.setItem('lang', lang);

    // Atualiza a sidebar
    document.querySelectorAll('.nav-item').forEach((item) => {
        const section = item.getAttribute('data-section');
        if (adminTraducoes[lang][section]) {
            item.querySelector('span').textContent = t(section);
        }
    });

    // Atualiza o título principal
    const activeSection =
        document
            .querySelector('.nav-item.active')
            ?.getAttribute('data-section') || 'dashboard';
    document.getElementById('adminTitle').textContent = t(activeSection);

    // Atualiza todos os textos estáticos
    updateAdminStaticTexts();

    // Atualiza listas dinâmicas
    setTimeout(() => {
        if (document.getElementById('pendentesList')) listarUsuarios();
        if (document.getElementById('veiculosList')) listarVeiculosPorUsuario();
        if (document.getElementById('locacoesList')) aplicarFiltroLocacoes();
        if (document.getElementById('modLogsList')) atualizarModificationLogs();

        // Redesenha gráficos
        if (chartLocacoes) chartLocacoes.destroy();
        if (chartAprovacoes) chartAprovacoes.destroy();
        gerarGraficos();
    }, 100);
}

function updateAdminStaticTexts() {
    // Função auxiliar para atualizar elementos
    const updateElement = (selector, text) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = text;
    };

    // 1. Cards do Dashboard
    updateElement('#usuariosTotaisText', t('usuariosTotais'));
    updateElement('#locadoresText', t('locadoresLabel'));
    updateElement('#locatariosText', t('locatariosLabel'));
    updateElement('#cadastrosPendentesText', t('cadastrosPendentes'));

    // 2. Títulos das seções
    updateElement('#pendentesTitle', t('pendentesTitle'));
    updateElement('#aprovadosTitle', t('aprovadosTitle'));
    updateElement('#recusadosTitle', t('recusadosTitle'));
    updateElement('#locacoesTitle', t('locacoesTitle'));
    updateElement('#veiculosTitle', t('veiculosTitle'));
    updateElement('#relatoriosTitle', t('relatoriosTitle'));
    updateElement('#configuracoesTitle', t('configuracoesTitle'));

    // 3. Botões de exportação
    updateElement('#exportarCSVText', t('exportarCSV'));
    updateElement('#exportarPDFText', t('exportarPDF'));

    // 4. Placeholders dos filtros
    document
        .getElementById('filterLocalizacao')
        ?.setAttribute('placeholder', t('filterLocalizacaoPlaceholder'));
    document
        .getElementById('filterLocacaoLocal')
        ?.setAttribute('placeholder', t('filterLocacaoLocalLabel'));
    document
        .getElementById('filterLocalVeiculo')
        ?.setAttribute('placeholder', t('filterLocalVeiculoLabel'));
    document
        .getElementById('filterRelatorioCidade')
        ?.setAttribute('placeholder', t('filterRelatorioCidadeLabel'));

    // 5. Botões de aplicar filtro
    updateElement('#aplicarFiltroBtn', t('aplicarfiltro'));
    updateElement('#aplicarFiltroLocacoesBtn', t('aplicarfiltro'));
    updateElement('#aplicarFiltroVeiculosBtn', t('aplicarfiltro'));
    updateElement('#aplicarFiltroRelatoriosBtn', t('aplicarfiltro'));

    // 7. Atualizar selects de filtro
    const updateSelect = (id, options) => {
        const select = document.getElementById(id);
        if (select) {
            select.innerHTML = options
                .map(
                    (opt) =>
                        `<option value="${opt.value}">${t(opt.text)}</option>`
                )
                .join('');
        }
    };

    updateSelect('filterStatus', [
        { value: 'all', text: 'todosStatus' },
        { value: 'pendente', text: 'statusPendente' },
        { value: 'aprovado', text: 'statusAprovado' },
        { value: 'recusado', text: 'statusRecusado' },
    ]);

    updateSelect('filterTipo', [
        { value: 'all', text: 'todosTipos' },
        { value: 'locador', text: 'tipoLocador' },
        { value: 'locatario', text: 'tipoLocatario' },
    ]);

    updateSelect('filterLocacaoTipo', [
        { value: 'all', text: 'todosTipos' },
        { value: 'locador', text: 'tipoLocador' },
        { value: 'locatario', text: 'tipoLocatario' },
    ]);

    updateSelect('filterRelatorioStatus', [
        { value: 'all', text: 'todosStatus' },
        { value: 'pendente', text: 'statusPendente' },
        { value: 'aprovado', text: 'statusAprovado' },
        { value: 'recusado', text: 'statusRecusado' },
    ]);

    // Atualizar placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });

    // Atualizar options do select
    document.querySelectorAll('option[data-i18n]').forEach((opt) => {
        opt.textContent = t(opt.getAttribute('data-i18n'));
    });

    // Atualize o botão Sair
    const logoutBtnText = document.getElementById('logoutBtnText');
    if (logoutBtnText) logoutBtnText.textContent = t('sair');

    // Adicione estas linhas no FINAL da função, antes do fechamento:

    // Configurações - Admin Data
    updateElement('#adminLabel', t('admin') + ':');
    updateElement('#emailLabel', t('email') + ':');

    // Configurações - Change Password
    document
        .getElementById('currentPassword')
        ?.setAttribute('placeholder', t('senhaAtual'));
    document
        .getElementById('newPassword')
        ?.setAttribute('placeholder', t('novaSenha'));
    document
        .getElementById('confirmPassword')
        ?.setAttribute('placeholder', t('confirmarSenha'));

    const confirmChangeBtn = document.getElementById('confirmChangeBtn');
    if (confirmChangeBtn) {
        confirmChangeBtn.textContent = t('confirmarAlteracao');
    }

    const toggleBtn = document.getElementById('toggleChangePassword');
    if (toggleBtn) {
        toggleBtn.textContent = t('changePasswordBtn');
    }

    // Configurações - Logs
    updateElement('#acessosTitle', t('registroDeAcessos'));
    updateElement('#modificacoesTitle', t('registroDeModificacoes'));

    // Atualizar textos específicos dos logs
    document.querySelectorAll('[data-i18n="ultimoAcesso"]').forEach((el) => {
        el.textContent = t('ultimoAcesso') + ':';
    });
    document.querySelectorAll('[data-i18n="ultimaSaida"]').forEach((el) => {
        el.textContent = t('ultimaSaida') + ':';
    });

    // Atualizar textos de "Nenhum registro encontrado"
    const lastAccess = document.getElementById('lastAccess');
    const lastExit = document.getElementById('lastExit');
    if (lastAccess && lastAccess.textContent === 'Nenhum registro') {
        lastAccess.textContent = t('nenhumRegistro');
    }
    if (lastExit && lastExit.textContent === 'Nenhum registro') {
        lastExit.textContent = t('nenhumRegistro');
    }

    const modLogsList = document.getElementById('modLogsList');
    if (
        modLogsList &&
        modLogsList.textContent === 'Nenhum registro encontrado.'
    ) {
        modLogsList.textContent = t('nenhumRegistro');
    }
}

// =================== FUNÇÕES PARA USUÁRIOS ===================
function listarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const pendentesList = document.getElementById('pendentesList');
    const aprovadosList = document.getElementById('aprovadosList');
    const recusadosList = document.getElementById('recusadosList');

    if (!pendentesList || !aprovadosList || !recusadosList) return;

    pendentesList.innerHTML = '';
    aprovadosList.innerHTML = '';
    recusadosList.innerHTML = '';

    if (usuarios.length === 0) {
        pendentesList.innerHTML = `<p>${t('nenhumRegistro')}</p>`;
        return;
    }

    usuarios.forEach((usuario) => {
        const tipoTraduzido = t(
            `tipo${
                usuario.tipoUsuario.charAt(0).toUpperCase() +
                usuario.tipoUsuario.slice(1)
            }`
        );
        const card = document.createElement('div');
        card.className = 'user-card fade-in';
        card.innerHTML = `
            <p><strong>${t('detalhesUsuarioTitle').split(' ')[0]}:</strong> ${
            usuario.nome
        }</p>
            <p><strong>Email:</strong> ${usuario.email}</p>
            <p><strong>${t('tipoLabel')}:</strong> ${tipoTraduzido}</p>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            exibirDetalhesUsuario(usuario);
        });

        if (usuario.status === 'pendente') {
            const actions = document.createElement('div');
            actions.className = 'user-actions';
            actions.innerHTML = `
                <button class="btn btn-success" onclick="aprovarUsuario('${
                    usuario.id
                }')">
                    <i>✓</i>
                    <span>${t('aprovarBtn')}</span>
                </button>
                <button class="btn btn-danger" onclick="recusarUsuario('${
                    usuario.id
                }')">
                    <i>✗</i>
                    <span>${t('recusarBtn')}</span>
                </button>
            `;
            card.appendChild(actions);
            pendentesList.appendChild(card);
        } else if (usuario.status === 'aprovado') {
            aprovadosList.appendChild(card);
        } else if (usuario.status === 'recusado') {
            let motivo = document.createElement('p');
            motivo.innerHTML = `<strong>${
                t('motivoRecusaPlaceholder').split(':')[0]
            }:</strong> ${usuario.motivoRecusa || t('nenhumRegistro')}`;
            card.appendChild(motivo);

            let btnHabilitar = document.createElement('button');
            btnHabilitar.className = 'btn btn-primary';
            btnHabilitar.textContent = t('habilitarBtn');
            btnHabilitar.onclick = (e) => {
                e.stopPropagation();
                habilitarUsuario(usuario.id);
            };
            card.appendChild(btnHabilitar);
            recusadosList.appendChild(card);
        }
    });
}

function aplicarFiltroUsuarios() {
    const statusFilter =
        document.getElementById('filterStatus')?.value || 'all';
    const tipoFilter = document.getElementById('filterTipo')?.value || 'all';
    const localFilter =
        document
            .getElementById('filterLocalizacao')
            ?.value.trim()
            .toLowerCase() || '';

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    let filtered = usuarios.filter((usuario) => {
        const statusMatch =
            statusFilter === 'all' || usuario.status === statusFilter;
        const tipoMatch =
            tipoFilter === 'all' || usuario.tipoUsuario === tipoFilter;

        const enderecoCompleto = (
            usuario.endereco ||
            usuario.localizacao ||
            ''
        ).toLowerCase();
        const localMatch =
            localFilter === '' || enderecoCompleto.includes(localFilter);

        return statusMatch && tipoMatch && localMatch;
    });

    const pendentesList = document.getElementById('pendentesList');
    const aprovadosList = document.getElementById('aprovadosList');
    const recusadosList = document.getElementById('recusadosList');

    if (!pendentesList || !aprovadosList || !recusadosList) return;

    pendentesList.innerHTML = '';
    aprovadosList.innerHTML = '';
    recusadosList.innerHTML = '';

    if (filtered.length === 0) {
        pendentesList.innerHTML = `<p>${t('nenhumRegistro')}</p>`;
        return;
    }

    filtered.forEach((usuario) => {
        const tipoTraduzido = t(
            `tipo${
                usuario.tipoUsuario.charAt(0).toUpperCase() +
                usuario.tipoUsuario.slice(1)
            }`
        );
        const card = document.createElement('div');
        card.className = 'user-card fade-in';
        card.innerHTML = `
            <p><strong>${t('detalhesUsuarioTitle').split(' ')[0]}:</strong> ${
            usuario.nome
        }</p>
            <p><strong>Email:</strong> ${usuario.email}</p>
            <p><strong>${t('tipoLabel')}:</strong> ${tipoTraduzido}</p>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            exibirDetalhesUsuario(usuario);
        });

        if (usuario.status === 'pendente') {
            const actions = document.createElement('div');
            actions.className = 'user-actions';
            actions.innerHTML = `
                <button class="btn btn-success" onclick="aprovarUsuario('${
                    usuario.id
                }')">
                    <i>✓</i>
                    <span>${t('aprovarBtn')}</span>
                </button>
                <button class="btn btn-danger" onclick="recusarUsuario('${
                    usuario.id
                }')">
                    <i>✗</i>
                    <span>${t('recusarBtn')}</span>
                </button>
            `;
            card.appendChild(actions);
            pendentesList.appendChild(card);
        } else if (usuario.status === 'aprovado') {
            aprovadosList.appendChild(card);
        } else if (usuario.status === 'recusado') {
            let motivo = document.createElement('p');
            motivo.innerHTML = `<strong>${
                t('motivoRecusaPlaceholder').split(':')[0]
            }:</strong> ${usuario.motivoRecusa || t('nenhumRegistro')}`;
            card.appendChild(motivo);

            let btnHabilitar = document.createElement('button');
            btnHabilitar.className = 'btn btn-primary';
            btnHabilitar.textContent = t('habilitarBtn');
            btnHabilitar.onclick = (e) => {
                e.stopPropagation();
                habilitarUsuario(usuario.id);
            };
            card.appendChild(btnHabilitar);
            recusadosList.appendChild(card);
        }
    });
}

function aprovarUsuario(id) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuarios.findIndex((u) => u.id === id);

    if (index !== -1) {
        usuarios[index].status = 'aprovado';
        delete usuarios[index].motivoRecusa;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        showNotification(
            `${t('usuarioAprovado')} ${usuarios[index].nome}`,
            'success'
        );
        logModification(
            `${t('usuarioAprovado')} ${usuarios[index].nome}`,
            usuarios[index].id
        );

        listarUsuarios();
        atualizarDashboard();
    }
}

function recusarUsuario(id) {
    Swal.fire({
        title: t('motivoRecusaPlaceholder'),
        input: 'text',
        inputPlaceholder: t('motivoRecusaPlaceholder'),
        showCancelButton: true,
        confirmButtonText: t('recusarBtn'),
        cancelButtonText: t('cancelarBtn'),
        inputValidator: (value) => {
            if (!value) {
                return t('motivoObrigatorio');
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            const motivo = result.value.trim();
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const index = usuarios.findIndex((u) => u.id === id);

            if (index !== -1) {
                usuarios[index].status = 'recusado';
                usuarios[index].motivoRecusa = motivo;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                showNotification(`${t('usuarioRecusado')}`, 'info');
                logModification(
                    `${t('usuarioRecusado')} ${usuarios[index].nome} (${t(
                        'motivoRecusaPlaceholder'
                    )}: ${motivo})`,
                    usuarios[index].id
                );

                listarUsuarios();
                atualizarDashboard();
            }
        }
    });
}

function habilitarUsuario(id) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuarios.findIndex((u) => u.id === id);

    if (index !== -1) {
        usuarios[index].status = 'pendente';
        delete usuarios[index].motivoRecusa;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        showNotification(`${t('usuarioReabilitado')}`, 'success');
        logModification(
            `${t('usuarioReabilitado')}: ${usuarios[index].nome}`,
            usuarios[index].id
        );

        listarUsuarios();
        atualizarDashboard();
    }
}

// =================== FUNÇÕES PARA LOCAÇÕES ===================
function aplicarFiltroLocacoes() {
    const localFilter =
        document
            .getElementById('filterLocacaoLocal')
            ?.value.trim()
            .toLowerCase() || '';
    const tipoFilter =
        document.getElementById('filterLocacaoTipo')?.value || 'all';

    const locacoes = JSON.parse(localStorage.getItem('locacoes')) || [];
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    let filtered = locacoes.filter((locacao) => {
        const localMatch =
            localFilter === '' ||
            (locacao.localizacao &&
                locacao.localizacao.toLowerCase().includes(localFilter));

        const tipoMatch =
            tipoFilter === 'all' ||
            (locacao.locadorId && tipoFilter === 'locador') ||
            (locacao.locatarioId && tipoFilter === 'locatario');

        return localMatch && tipoMatch;
    });

    const locacoesList = document.getElementById('locacoesList');
    if (!locacoesList) return;

    locacoesList.innerHTML = '';

    if (filtered.length === 0) {
        locacoesList.innerHTML = `<p>${t('nenhumaLocacao')}</p>`;
        return;
    }

    filtered.forEach((loc) => {
        const locador = usuarios.find((u) => u.id === loc.locadorId);
        const locatario = usuarios.find((u) => u.id === loc.locatarioId);

        const div = document.createElement('div');
        div.className = 'locacao-card';
        div.innerHTML = `
            <p><strong>${t('veiculosTitle').split(' ')[1]}:</strong> ${
            loc.veiculo || t('nenhumVeiculo')
        }</p>
            <p><strong>${t('tipoLocador')}:</strong> ${
            locador?.nome || t('nenhumLocador')
        }</p>
            <p><strong>${t('tipoLocatario')}:</strong> ${
            locatario?.nome || t('nenhumRegistro')
        }</p>
            <p><strong>${t('dataLabel')}:</strong> ${
            loc.data || t('nenhumRegistro')
        }</p>
            <p><strong>${t('localizacaoLabel')}:</strong> ${
            loc.localizacao || t('nenhumRegistro')
        }</p>
        `;
        locacoesList.appendChild(div);
    });
}

// =================== FUNÇÕES PARA VEÍCULOS ===================
function listarVeiculosPorUsuario() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculosList = document.getElementById('veiculosList');

    if (!veiculosList) return;

    veiculosList.innerHTML = '';

    const locadores = usuarios.filter(
        (u) => u.tipoUsuario === 'locador' && u.status === 'aprovado'
    );

    if (locadores.length === 0) {
        veiculosList.innerHTML = `<p>${t('nenhumLocador')}</p>`;
        return;
    }

    locadores.forEach((locador) => {
        const veiculosDoUsuario = veiculos.filter(
            (v) => v.locadorId === locador.id
        );

        const card = document.createElement('div');
        card.className = 'user-veiculos-card fade-in';
        card.innerHTML = `
            <div class="user-veiculos-card-header">
                <p><strong>${locador.nome}</strong> - ${locador.email}</p>
                <span class="veiculos-count">${veiculosDoUsuario.length} ${t(
            'veiculosTitle'
        )
            .split(' ')[1]
            .toLowerCase()}</span>
            </div>
            <div class="veiculos-details" id="veiculos-${locador.id}"></div>
        `;

        card.addEventListener('click', (e) => {
            if (
                !e.target.classList.contains('veiculo-imagem') &&
                !e.target.classList.contains('btn-navegacao') &&
                !e.target.classList.contains('btn-fechar')
            ) {
                const details = card.querySelector('.veiculos-details');
                if (details.style.display === 'block') {
                    details.style.display = 'none';
                } else {
                    if (details.innerHTML === '') {
                        carregarDetalhesVeiculos(
                            locador.id,
                            veiculosDoUsuario,
                            details
                        );
                    }
                    details.style.display = 'block';
                }
            }
        });

        veiculosList.appendChild(card);
    });
}

function carregarDetalhesVeiculos(userId, veiculos, container) {
    if (!container) return;

    container.innerHTML = '';

    if (veiculos.length === 0) {
        container.innerHTML = `<p>${t('nenhumVeiculo')}</p>`;
        return;
    }

    veiculos.forEach((veiculo) => {
        const veiculoItem = document.createElement('div');
        veiculoItem.className = 'veiculo-item';
        veiculoItem.innerHTML = `
            <p><strong>${t('modeloLabel')}:</strong> ${
            veiculo.modelo || t('nenhumRegistro')
        }</p>
            <p><strong>${t('tipoLabel')}:</strong> ${
            veiculo.tipo || t('nenhumRegistro')
        }</p>
            <p><strong>${t('anoLabel')}:</strong> ${
            veiculo.ano || t('nenhumRegistro')
        }</p>
            <p><strong>${t('valorLabel')}:</strong> R$ ${
            veiculo.valorPorDia || t('nenhumRegistro')
        }</p>
            <p><strong>${t('localizacaoLabel')}:</strong> ${
            veiculo.endereco || veiculo.localizacao || t('nenhumRegistro')
        }</p>
        `;

        if (veiculo.imagens && veiculo.imagens.length > 0) {
            const imagensContainer = document.createElement('div');
            imagensContainer.className = 'veiculo-imagens';

            veiculo.imagens.forEach((img, index) => {
                const imgElement = document.createElement('img');
                imgElement.src = img;
                imgElement.className = 'veiculo-imagem';
                imgElement.alt = `Imagem ${index + 1} do veículo ${
                    veiculo.modelo
                }`;
                imgElement.onclick = (e) => {
                    e.stopPropagation();
                    abrirVisualizador(userId, veiculo.id, index);
                };
                imagensContainer.appendChild(imgElement);
            });

            veiculoItem.appendChild(imagensContainer);
        }

        container.appendChild(veiculoItem);
    });
}

function aplicarFiltroVeiculos() {
    const modeloFilter =
        document.getElementById('filterModelo')?.value.trim().toLowerCase() ||
        '';
    const tipoFilter =
        document
            .getElementById('filterTipoVeiculo')
            ?.value.trim()
            .toLowerCase() || '';
    const anoFilter = document.getElementById('filterAno')?.value || '';
    const localFilter =
        document
            .getElementById('filterLocalVeiculo')
            ?.value.trim()
            .toLowerCase() || '';

    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    let filtered = veiculos.filter((v) => {
        const modeloMatch =
            modeloFilter === '' ||
            (v.modelo && v.modelo.toLowerCase().includes(modeloFilter));

        const tipoMatch =
            tipoFilter === '' ||
            (v.tipo && v.tipo.toLowerCase().includes(tipoFilter));

        const anoMatch = anoFilter === '' || v.ano == anoFilter;

        const localMatch =
            localFilter === '' ||
            (v.endereco && v.endereco.toLowerCase().includes(localFilter)) ||
            (v.localizacao &&
                v.localizacao.toLowerCase().includes(localFilter));

        return modeloMatch && tipoMatch && anoMatch && localMatch;
    });

    const veiculosList = document.getElementById('veiculosList');
    if (!veiculosList) return;

    veiculosList.innerHTML = '';

    if (filtered.length === 0) {
        veiculosList.innerHTML = `<p>${t('nenhumVeiculo')}</p>`;
        return;
    }

    filtered.forEach((veiculo) => {
        const locador = usuarios.find((u) => u.id === veiculo.locadorId);

        const card = document.createElement('div');
        card.className = 'user-veiculos-card fade-in';
        card.innerHTML = `
            <div class="user-veiculos-card-header">
                <p><strong>${
                    veiculo.modelo || t('nenhumRegistro')
                }</strong> - ${locador?.nome || t('nenhumLocador')} (${
            locador?.email || t('nenhumRegistro')
        })</p>
                <span class="veiculos-count">${
                    veiculo.solicitacoes?.length || 0
                } ${t('solicitacoesLabel')}</span>
            </div>
            <div class="veiculos-details" id="veiculos-${veiculo.id}"></div>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('veiculo-imagem')) {
                const details = card.querySelector('.veiculos-details');
                if (details.style.display === 'block') {
                    details.style.display = 'none';
                } else {
                    if (details.innerHTML === '') {
                        carregarDetalhesVeiculos(
                            veiculo.locadorId,
                            [veiculo],
                            details
                        );
                    }
                    details.style.display = 'block';
                }
            }
        });

        veiculosList.appendChild(card);
    });
}

// =================== FUNÇÕES PARA RELATÓRIOS ===================
function aplicarFiltroRelatorios() {
    const cidade =
        document
            .getElementById('filterRelatorioCidade')
            ?.value.trim()
            .toLowerCase() || '';
    const tipoVeiculo =
        document.getElementById('filterRelatorioTipoVeiculo')?.value || 'all';
    const modelo =
        document
            .getElementById('filterRelatorioModelo')
            ?.value.trim()
            .toLowerCase() || '';
    const statusUsuario =
        document.getElementById('filterRelatorioStatus')?.value || 'all';

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    let locacoes = JSON.parse(localStorage.getItem('locacoes')) || [];
    let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];

    // Filtrar usuários
    if (cidade !== '') {
        usuarios = usuarios.filter((u) => {
            const endereco = (u.endereco || u.localizacao || '').toLowerCase();
            return endereco.includes(cidade);
        });
    }

    if (statusUsuario !== 'all') {
        usuarios = usuarios.filter((u) => u.status === statusUsuario);
    }

    // Filtrar locações
    if (cidade !== '') {
        locacoes = locacoes.filter((loc) => {
            const local = (loc.localizacao || '').toLowerCase();
            return local.includes(cidade);
        });
    }

    // Filtrar veículos
    if (tipoVeiculo !== 'all') {
        veiculos = veiculos.filter(
            (v) => v.tipo && v.tipo.toLowerCase() === tipoVeiculo.toLowerCase()
        );
    }

    if (modelo !== '') {
        veiculos = veiculos.filter(
            (v) => v.modelo && v.modelo.toLowerCase().includes(modelo)
        );
    }

    atualizarDashboard(usuarios);
    gerarGraficos(usuarios, locacoes, veiculos);
}

// =================== GRÁFICOS E DASHBOARD ===================
function atualizarDashboard(usuariosParam) {
    let usuarios =
        usuariosParam || JSON.parse(localStorage.getItem('usuarios')) || [];

    const total = usuarios.length;
    const locadores = usuarios.filter(
        (u) => u.tipoUsuario === 'locador'
    ).length;
    const locatarios = usuarios.filter(
        (u) => u.tipoUsuario === 'locatario'
    ).length;
    const pendentes = usuarios.filter((u) => u.status === 'pendente').length;

    animarContador('totalUsuarios', total);
    animarContador('totalLocadores', locadores);
    animarContador('totalLocatarios', locatarios);
    animarContador('totalPendentes', pendentes);
}

function animarContador(id, valorFinal) {
    const elemento = document.getElementById(id);
    if (!elemento) return;

    let atual = 0;
    const incremento = Math.ceil(valorFinal / 50);

    elemento.classList.remove('counting');
    void elemento.offsetWidth; // Trigger reflow
    elemento.classList.add('counting');

    const interval = setInterval(() => {
        atual += incremento;
        if (atual >= valorFinal) {
            atual = valorFinal;
            clearInterval(interval);
        }
        elemento.textContent = atual;
    }, 30);
}

function gerarGraficos(usuariosParam, locacoesParam, veiculosParam) {
    const usuarios =
        usuariosParam || JSON.parse(localStorage.getItem('usuarios')) || [];
    const locacoes =
        locacoesParam || JSON.parse(localStorage.getItem('locacoes')) || [];
    const veiculos =
        veiculosParam || JSON.parse(localStorage.getItem('veiculos')) || [];

    // Destruir gráficos existentes
    if (chartLocacoes) chartLocacoes.destroy();
    if (chartAprovacoes) chartAprovacoes.destroy();

    // Gráfico de Locações
    const ctxLocacoes = document
        .getElementById('graficoLocacoes')
        ?.getContext('2d');
    if (ctxLocacoes) {
        const pendentes = locacoes.filter(
            (l) => l.status === 'pendente'
        ).length;
        const aceitas = locacoes.filter((l) => l.status === 'aceito').length;
        const recusadas = locacoes.filter(
            (l) => l.status === 'recusado'
        ).length;

        chartLocacoes = new Chart(ctxLocacoes, {
            type: 'bar',
            data: {
                labels: [
                    t('statusPendente'),
                    t('statusAprovado'),
                    t('statusRecusado'),
                ],
                datasets: [
                    {
                        label: t('locacoesTitle'),
                        data: [pendentes, aceitas, recusadas],
                        backgroundColor: ['#ffc107', '#28a745', '#dc3545'],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 15,
                            font: { size: 12 },
                            padding: 10,
                        },
                    },
                },
            },
        });
    }

    // Gráfico de Aprovações
    const ctxAprovacoes = document
        .getElementById('graficoAprovacoes')
        ?.getContext('2d');
    if (ctxAprovacoes) {
        const aprovados = usuarios.filter(
            (u) => u.status === 'aprovado'
        ).length;
        const recusados = usuarios.filter(
            (u) => u.status === 'recusado'
        ).length;
        const pendentes = usuarios.filter(
            (u) => u.status === 'pendente'
        ).length;

        chartAprovacoes = new Chart(ctxAprovacoes, {
            type: 'pie',
            data: {
                labels: [
                    t('statusAprovado'),
                    t('statusRecusado'),
                    t('statusPendente'),
                ],
                datasets: [
                    {
                        data: [aprovados, recusados, pendentes],
                        backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 15,
                            font: { size: 12 },
                            padding: 10,
                        },
                    },
                },
            },
        });
    }
}

// =================== EXIBIR DETALHES DO USUÁRIO ===================
function exibirDetalhesUsuario(usuario) {
    const locacoes = JSON.parse(localStorage.getItem('locacoes')) || [];
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const reports = JSON.parse(localStorage.getItem('reports')) || [];

    const totalLocacoes = locacoes.filter(
        (loc) => loc.locadorId === usuario.id || loc.locatarioId === usuario.id
    ).length;

    const totalVeiculos = veiculos.filter(
        (v) => v.locadorId === usuario.id
    ).length;
    const totalReports = reports.filter((r) => r.userId === usuario.id).length;

    const tipoTraduzido = t(
        `tipo${
            usuario.tipoUsuario.charAt(0).toUpperCase() +
            usuario.tipoUsuario.slice(1)
        }`
    );
    const statusTraduzido = t(
        `status${
            usuario.status.charAt(0).toUpperCase() + usuario.status.slice(1)
        }`
    );

    let htmlContent = `
        <div style="text-align:left; font-size: 0.95rem;">
            <p><strong>${t('detalhesUsuarioTitle').split(' ')[0]}:</strong> ${
        usuario.nome
    }</p>
            <p><strong>Email:</strong> ${usuario.email}</p>
            <p><strong>${t('telefoneLabel')}:</strong> ${
        usuario.celular || usuario.telefone || t('nenhumRegistro')
    }</p>
            ${usuario.cpf ? `<p><strong>CPF:</strong> ${usuario.cpf}</p>` : ''}
            ${usuario.cnh ? `<p><strong>CNH:</strong> ${usuario.cnh}</p>` : ''}
            <p><strong>${t('enderecoLabel')}:</strong> ${
        usuario.endereco || usuario.localizacao || t('nenhumRegistro')
    }</p>
            <p><strong>${t('tipoLabel')}:</strong> ${tipoTraduzido}</p>
            <p><strong>${t('statusLabel')}:</strong> ${statusTraduzido}</p>
            <p><strong>${t('totalLocacoesLabel')}:</strong> ${totalLocacoes}</p>
            ${
                usuario.tipoUsuario === 'locador'
                    ? `<p><strong>${t(
                          'veiculosCadastradosLabel'
                      )}:</strong> ${totalVeiculos}</p>`
                    : ''
            }
            <p><strong>${t(
                'totalReportacoesLabel'
            )}:</strong> ${totalReports}</p>
        </div>
        <div style="margin-top:1rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
            ${
                usuario.status === 'aprovado'
                    ? `<button class="btn btn-danger" id="btnRecusar">${t(
                          'recusarBtn'
                      )}</button>`
                    : ''
            }
            <button class="btn btn-secondary" id="btnVerReportacoes">${t(
                'verReportacoes'
            )}</button>
        </div>
    `;

    Swal.fire({
        title: t('detalhesUsuarioTitle'),
        html: htmlContent,
        showConfirmButton: true,
        confirmButtonText: t('fechar'),
        didOpen: () => {
            const btnRecusar = Swal.getPopup().querySelector('#btnRecusar');
            if (btnRecusar) {
                btnRecusar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    Swal.close();
                    recusarUsuario(usuario.id);
                });
            }

            const btnVerReportacoes =
                Swal.getPopup().querySelector('#btnVerReportacoes');
            if (btnVerReportacoes) {
                btnVerReportacoes.addEventListener('click', (e) => {
                    e.stopPropagation();
                    exibirReportacoes(usuario.id);
                });
            }
        },
    });
}

// =================== FUNÇÕES DE REPORTAÇÕES ===================
function exibirReportacoes(userId) {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const userReports = reports.filter((r) => r.userId === userId);

    let reportsHtml = '<ul style="text-align:left; font-size:0.9rem;">';
    if (userReports.length === 0) {
        reportsHtml += `<li>${t('nenhumRegistro')}</li>`;
    } else {
        userReports.forEach((r) => {
            reportsHtml += `<li><strong>${r.date}</strong>: ${r.text}</li>`;
        });
    }
    reportsHtml += '</ul>';

    Swal.fire({
        title: t('detalhesUsuarioTitle'),
        html: reportsHtml,
        showCancelButton: true,
        confirmButtonText: t('adicionarReportacao'),
        cancelButtonText: t('fechar'),
    }).then((result) => {
        if (result.isConfirmed) {
            adicionarReportacao(userId);
        }
    });
}

function adicionarReportacao(userId) {
    Swal.fire({
        title: t('adicionarReportacao'),
        input: 'textarea',
        inputPlaceholder: t('motivoRecusaPlaceholder'),
        showCancelButton: true,
        confirmButtonText: t('recusarBtn'),
        cancelButtonText: t('cancelarBtn'),
        inputValidator: (value) => {
            if (!value.trim()) {
                return t('reportacaoVazia');
            }
        },
    }).then((result) => {
        if (result.value) {
            const reportText = result.value.trim();
            let reports = JSON.parse(localStorage.getItem('reports')) || [];

            const newReport = {
                userId: userId,
                text: reportText,
                date: new Date().toLocaleString(),
            };

            reports.push(newReport);
            localStorage.setItem('reports', JSON.stringify(reports));

            showNotification(t('reportacaoAdicionada'), 'success');
            logModification(
                `${t('reportacaoAdicionada')} ${getUsuarioNome(userId)}`,
                userId
            );
        }
    });
}

// =================== VISUALIZADOR DE IMAGENS ===================
function abrirVisualizador(userId, veiculoId, startIndex = 0) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculo = veiculos.find(
        (v) => v.id === veiculoId && v.locadorId === userId
    );

    if (!veiculo || !veiculo.imagens || veiculo.imagens.length === 0) return;

    imagensAtuais = veiculo.imagens;
    indiceImagemAtual = startIndex;

    const visualizador = document.getElementById('visualizadorImagens');
    if (visualizador) {
        document.getElementById('imagemVisualizador').src =
            imagensAtuais[indiceImagemAtual];
        visualizador.style.display = 'flex';
    }
}

function fecharVisualizador() {
    const visualizador = document.getElementById('visualizadorImagens');
    if (visualizador) {
        visualizador.style.display = 'none';
    }
}

function mudarImagem(direcao) {
    indiceImagemAtual += direcao;

    if (indiceImagemAtual < 0) {
        indiceImagemAtual = imagensAtuais.length - 1;
    } else if (indiceImagemAtual >= imagensAtuais.length) {
        indiceImagemAtual = 0;
    }

    const imgElement = document.getElementById('imagemVisualizador');
    if (imgElement) {
        imgElement.src = imagensAtuais[indiceImagemAtual];
    }
}

// =================== EXPORTAÇÃO DE RELATÓRIOS ===================
function exportarCSV() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `${t('detalhesUsuarioTitle').split(' ')[0]},Email,${t(
        'tipoLabel'
    )},${t('statusLabel')}\n`;

    usuarios.forEach((usuario) => {
        const tipoTraduzido = t(
            `tipo${
                usuario.tipoUsuario.charAt(0).toUpperCase() +
                usuario.tipoUsuario.slice(1)
            }`
        );
        const statusTraduzido = t(
            `status${
                usuario.status.charAt(0).toUpperCase() + usuario.status.slice(1)
            }`
        );

        csvContent += `${usuario.nome},${usuario.email},${tipoTraduzido},${statusTraduzido}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
        'download',
        `usuarios_LoCar_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification(`${t('exportarCSV')} ${t('success')}`, 'success');
}

function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    doc.setFontSize(18);
    doc.text(`${t('relatoriosTitle')} - LoCar`, 10, 10);
    doc.setFontSize(12);

    let y = 20;
    usuarios.forEach((usuario) => {
        const tipoTraduzido = t(
            `tipo${
                usuario.tipoUsuario.charAt(0).toUpperCase() +
                usuario.tipoUsuario.slice(1)
            }`
        );
        const statusTraduzido = t(
            `status${
                usuario.status.charAt(0).toUpperCase() + usuario.status.slice(1)
            }`
        );

        doc.text(
            `${t('detalhesUsuarioTitle').split(' ')[0]}: ${usuario.nome}`,
            10,
            y
        );
        doc.text(`Email: ${usuario.email}`, 10, y + 7);
        doc.text(`${t('tipoLabel')}: ${tipoTraduzido}`, 10, y + 14);
        doc.text(`${t('statusLabel')}: ${statusTraduzido}`, 10, y + 21);

        y += 30;
        if (y > 270) {
            doc.addPage();
            y = 10;
        }
    });

    doc.save(`usuarios_LoCar_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification(`${t('exportarPDF')} ${t('success')}`, 'success');
}

// =================== REGISTRO DE ACESSOS E MODIFICAÇÕES ===================
function logAccess() {
    let accessLogs = JSON.parse(localStorage.getItem('access-Logs')) || {};
    accessLogs.lastAccess = new Date().toLocaleString();
    localStorage.setItem('access-Logs', JSON.stringify(accessLogs));
    atualizarAccessLogs();
}

function logExit() {
    let accessLogs = JSON.parse(localStorage.getItem('access-Logs')) || {};
    accessLogs.lastExit = new Date().toLocaleString();
    localStorage.setItem('access-Logs', JSON.stringify(accessLogs));
    atualizarAccessLogs();
}

function atualizarAccessLogs() {
    const accessObj = JSON.parse(localStorage.getItem('access-Logs')) || {};
    const lastAccess = document.getElementById('lastAccess');
    const lastExit = document.getElementById('lastExit');

    if (lastAccess) {
        lastAccess.textContent = accessObj.lastAccess || t('nenhumRegistro');
    }
    if (lastExit) {
        lastExit.textContent = accessObj.lastExit || t('nenhumRegistro');
    }
}

function logModification(description, userId) {
    let modLogs = JSON.parse(localStorage.getItem('modLogs')) || [];
    let userName = '';

    if (userId) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const found = usuarios.find((u) => u.id === userId);
        userName = found ? found.nome : userId;
    }

    modLogs.push({
        date: new Date().toLocaleString(),
        description: description,
        userId: userId,
        userName: userName,
    });

    localStorage.setItem('modLogs', JSON.stringify(modLogs));
    atualizarModificationLogs();
}

function getUsuarioNome(userId) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find((u) => u.id === userId);
    return usuario ? usuario.nome : userId;
}

function atualizarModificationLogs() {
    let modLogs = JSON.parse(localStorage.getItem('modLogs')) || [];
    let groups = {};
    let others = [];

    modLogs.forEach((log) => {
        let descTranslated = log.description || '';

        // Traduzir frases comuns
        if (descTranslated) {
            descTranslated = descTranslated
                .replace(
                    /Report(?:ação| added|e)? adicionada(?: para)?/i,
                    t('reportacaoAdicionada')
                )
                .replace(
                    /User approved|Usuário aprovado/i,
                    t('usuarioAprovado')
                )
                .replace(
                    /User rejected|Usuário recusado/i,
                    t('usuarioRecusado')
                )
                .replace(
                    /User re-enabled|Usuário reabilitado/i,
                    t('usuarioReabilitado')
                )
                .replace(/motivo|reason/i, t('motivo'))
                .replace(
                    /reabilitado para nova análise|re-enabled for review/i,
                    t('reabilitadoParaAnalise')
                );
        }

        const userName =
            log.userName ||
            (log.userId ? getUsuarioNome(log.userId) : 'Sistema');

        const translatedLog = {
            ...log,
            description: descTranslated,
            userName: userName,
        };

        if (log.userId) {
            const key = translatedLog.userName;
            if (!groups[key]) groups[key] = [];
            groups[key].push(translatedLog);
        } else {
            others.push(translatedLog);
        }
    });

    const modLogsList = document.getElementById('modLogsList');
    if (!modLogsList) return;

    let html = '';

    for (let key in groups) {
        let logs = groups[key];
        let first = logs[0];
        let remaining = logs.slice(1);

        html += `<div class="mod-log-group">
            <p class="mod-log-summary">
                <strong>${first.date || t('nenhumRegistro')}</strong>: ${
            first.description || t('nenhumRegistro')
        }
                ${
                    remaining.length > 0
                        ? `<span style="color: var(--accent-color);"> (+${
                              remaining.length
                          } ${t('mais')})</span>`
                        : ''
                }
                <small> - ${key}</small>
            </p>`;

        if (remaining.length > 0) {
            html += `<div class="mod-log-details">`;
            remaining.forEach((log) => {
                html += `<p><strong>${
                    log.date || t('nenhumRegistro')
                }</strong>: ${log.description || t('nenhumRegistro')}</p>`;
            });
            html += `</div>`;
        }

        html += `</div>`;
    }

    others.forEach((log) => {
        html += `<p><strong>${log.date || t('nenhumRegistro')}</strong>: ${
            log.description || t('nenhumRegistro')
        }</p>`;
    });

    modLogsList.innerHTML = html || `<p>${t('nenhumRegistro')}</p>`;

    // Event listeners para mostrar/ocultar detalhes
    document.querySelectorAll('.mod-log-summary').forEach((summary) => {
        summary.addEventListener('click', () => {
            const details =
                summary.parentElement.querySelector('.mod-log-details');
            if (details) {
                details.style.display =
                    details.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
}

// =================== FUNÇÕES AUXILIARES ===================
function mostrarLoader(mostrar) {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = mostrar ? 'flex' : 'none';
    }
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}

function alterarSenha() {
    const current = document.getElementById('currentPassword')?.value;
    const nova = document.getElementById('newPassword')?.value;
    const confirm = document.getElementById('confirmPassword')?.value;

    if (!current || !nova || !confirm) {
        showNotification(t('camposObrigatorios'), 'error');
        return;
    }

    if (nova !== confirm) {
        showNotification(t('senhasNaoCoincidem'), 'error');
        return;
    }

    let senhaAdmin = localStorage.getItem('senhaAdmin') || 'admin123';
    if (current !== senhaAdmin) {
        showNotification(t('senhaAtualIncorreta'), 'error');
        return;
    }

    localStorage.setItem('senhaAdmin', nova);
    showNotification(t('senhaAlteradaSucesso'), 'success');
    logModification(t('senhaAdminAlterada'));

    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';

    const changePassForm = document.getElementById('changePasswordForm');
    const toggleBtn = document.getElementById('toggleChangePassword');

    if (changePassForm && toggleBtn) {
        changePassForm.style.display = 'none';
        toggleBtn.textContent = t('changePasswordBtn');
    }
}

function logout() {
    logExit();

    Swal.fire({
        icon: 'info',
        title: t('logoutTitle'),
        text: t('logoutText'),
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
    }).then(() => {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
    });
}

// =================== EVENTOS E INICIALIZAÇÃO ===================
document.addEventListener('DOMContentLoaded', () => {
    // Configurar idioma inicial
    setLanguage(lang);

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    // Se não estiver logado ou não for admin, redireciona para o index.
    if (
        !usuarioLogado ||
        (usuarioLogado.tipoUsuario !== 'admin' &&
            usuarioLogado.tipoUsuario !== 'administrador')
    ) {
        window.location.href = 'index.html';
        return;
    }

    // Menu mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const adminSidebar = document.getElementById('adminSidebar');

    if (mobileMenuBtn && adminSidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            adminSidebar.classList.toggle('open');
        });
    }

    // Alteração de senha
    const toggleBtn = document.getElementById('toggleChangePassword');
    const changePassForm = document.getElementById('changePasswordForm');

    if (toggleBtn && changePassForm) {
        toggleBtn.addEventListener('click', () => {
            if (
                changePassForm.style.display === 'none' ||
                changePassForm.style.display === ''
            ) {
                changePassForm.style.display = 'block';
                toggleBtn.textContent = t('cancelChangePassword');
            } else {
                changePassForm.style.display = 'none';
                toggleBtn.textContent = t('changePasswordBtn');
            }
        });
    }

    // Confirmação de alteração de senha
    const confirmChangeBtn = document.getElementById('confirmChangeBtn');
    if (confirmChangeBtn) {
        confirmChangeBtn.addEventListener('click', alterarSenha);
    }

    // Navegação
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');

            navItems.forEach((nav) => nav.classList.remove('active'));
            item.classList.add('active');

            const adminTitle = document.getElementById('adminTitle');
            if (adminTitle) {
                adminTitle.textContent = t(section) || t('dashboard');
                adminTitle.setAttribute('data-section', section);
            }

            document.querySelectorAll('.admin-section').forEach((sec) => {
                sec.style.display = 'none';
            });

            const sectionElement = document.getElementById(section);
            if (sectionElement) {
                sectionElement.style.display = 'block';
            }

            // Carregar dados específicos da seção
            switch (section) {
                case 'veiculos':
                    listarVeiculosPorUsuario();
                    break;
                case 'configuracoes':
                    atualizarAccessLogs();
                    atualizarModificationLogs();
                    break;
                case 'usuarios':
                    listarUsuarios();
                    break;
                case 'locacoes':
                    aplicarFiltroLocacoes();
                    break;
                case 'relatorios':
                    aplicarFiltroRelatorios();
                    break;
            }

            if (window.innerWidth <= 992 && adminSidebar) {
                adminSidebar.classList.remove('open');
            }
        });
    });

    // Event listeners para filtros
    document
        .getElementById('aplicarFiltroBtn')
        ?.addEventListener('click', aplicarFiltroUsuarios);
    document
        .getElementById('aplicarFiltroLocacoesBtn')
        ?.addEventListener('click', aplicarFiltroLocacoes);
    document
        .getElementById('aplicarFiltroVeiculosBtn')
        ?.addEventListener('click', aplicarFiltroVeiculos);
    document
        .getElementById('aplicarFiltroRelatoriosBtn')
        ?.addEventListener('click', aplicarFiltroRelatorios);

    // Event listeners para exportação
    document
        .getElementById('exportarCSV')
        ?.addEventListener('click', exportarCSV);
    document
        .getElementById('exportarPDF')
        ?.addEventListener('click', exportarPDF);

    // Event listener para logout
    document.getElementById('logoutBtn')?.addEventListener('click', logout);

    // Event listeners para visualizador de imagens
    document
        .getElementById('fecharVisualizador')
        ?.addEventListener('click', fecharVisualizador);
    document
        .getElementById('anteriorImagem')
        ?.addEventListener('click', () => mudarImagem(-1));
    document
        .getElementById('proximaImagem')
        ?.addEventListener('click', () => mudarImagem(1));

    // Carregar dados iniciais
    logAccess();
    carregarDados();
});

function carregarDados() {
    mostrarLoader(true);

    setTimeout(() => {
        listarUsuarios();
        listarVeiculosPorUsuario();
        aplicarFiltroLocacoes();
        atualizarDashboard();
        gerarGraficos();
        atualizarAccessLogs();
        atualizarModificationLogs();

        mostrarLoader(false);
    }, 1000);
}
