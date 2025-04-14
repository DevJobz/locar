// Variáveis globais para o visualizador de imagens
let imagensAtuais = [];
let indiceImagemAtual = 0;
let secaoAtiva = 'meuPerfil';
let etapaAtualCadastro = 1;
const totalEtapasCadastro = 6;
let veiculoRascunho = null;
let datasIndisponiveis = [];
let calendarioInstance = null;
let modoEdicao = false;

// Dados para preenchimento dos selects
const marcasPorTipo = {
    carro: [
        'Ford',
        'Volkswagen',
        'Fiat',
        'Chevrolet',
        'Toyota',
        'Honda',
        'Hyundai',
        'Renault',
        'Jeep',
        'Nissan',
        'BMW',
        'Mercedes-Benz',
        'Audi',
        'Volvo',
        'Kia',
        'Citroën',
        'Peugeot',
        'Mitsubishi',
        'Subaru',
        'Land Rover',
        'Jaguar',
        'Porsche',
        'Lexus',
        'Chery',
        'Jac',
    ],
    moto: [
        'Honda',
        'Yamaha',
        'Suzuki',
        'Kawasaki',
        'Dafra',
        'Shineray',
        'BMW',
        'Ducati',
        'Harley-Davidson',
        'KTM',
        'Triumph',
        'Royal Enfield',
        'Bajaj',
        'Kymco',
        'Kasinski',
    ],
    van: [
        'Mercedes-Benz',
        'Volkswagen',
        'Fiat',
        'Renault',
        'Ford',
        'Peugeot',
        'Citroën',
        'Toyota',
        'Hyundai',
        'Kia',
    ],
    bicicleta: [
        'Caloi',
        'Monark',
        'Sense',
        'KSW',
        'OGGI',
        'Shimano',
        'Trek',
        'Specialized',
        'Cannondale',
        'Giant',
        'Scott',
        'Bianchi',
        'GT',
        'Focus',
        'Soul',
    ],
    patinete: [
        'Xiaomi',
        'Ninebot',
        'Scoo',
        'Blitzwolf',
        'Dafra',
        'Voltz',
        'Ecox',
        'iScooter',
        'Hiboy',
        'Razor',
    ],
    scooter: [
        'Honda',
        'Yamaha',
        'Dafra',
        'Shineray',
        'Suzuki',
        'Vespa',
        'Kymco',
        'Sym',
        'BMW',
        'Voltz',
    ],
};

const modelosPorMarca = {
    // Carros
    Ford: [
        'Fiesta',
        'Ka',
        'EcoSport',
        'Focus',
        'Fusion',
        'Ranger',
        'Mustang',
        'Edge',
        'Territory',
        'Bronco',
    ],
    Volkswagen: [
        'Gol',
        'Polo',
        'Virtus',
        'T-Cross',
        'Nivus',
        'Taos',
        'Jetta',
        'Saveiro',
        'Amarok',
        'Tiguan',
    ],
    Fiat: [
        'Uno',
        'Mobi',
        'Argo',
        'Cronos',
        'Toro',
        'Strada',
        'Pulse',
        'Fiorino',
        'Ducato',
    ],
    // ... (adicionar mais modelos conforme necessário)
};

const tiposCarroceria = {
    carro: [
        'Hatch',
        'Sedã',
        'SUV',
        'Picape',
        'Crossover',
        'Perua',
        'Minivan',
        'Esportivo',
        'Outro',
    ],
    moto: [
        'Street',
        'Custom',
        'Esportiva',
        'Trail',
        'Scooter',
        'Big Trail',
        'Naked',
        'Off-road',
        'Outro',
    ],
    van: ['Minivan', 'Van Passageiros', 'Van Carga', 'Van Mista', 'Outro'],
    bicicleta: [
        'Urbana',
        'Mountain Bike',
        'Speed',
        'Dobrável',
        'Elétrica',
        'Infantil',
        'Outro',
    ],
    patinete: [
        'Elétrico Padrão',
        'Elétrico Off-road',
        'Elétrico Dobrável',
        'Outro',
    ],
    scooter: [
        'Elétrico Padrão',
        'Elétrico Potente',
        'Elétrico Dobrável',
        'Outro',
    ],
};

document.addEventListener('DOMContentLoaded', () => {
    verificarStatusConta();
    listarVeiculos();
    listarSolicitacoes();
    listarFeedbacks();
    configurarCadastroVeiculo();
    carregarPerfil();

    // Event listeners para verificação de CNH
    document
        .getElementById('profileBirthDate')
        .addEventListener('change', verificarValidadeCNH);
    document
        .getElementById('profileDocIssue')
        .addEventListener('change', verificarValidadeCNH);
    document
        .getElementById('profileDocExpiry')
        .addEventListener('change', verificarValidadeCNH);

    // Configuração do CEP
    document
        .getElementById('profileCEP')
        .addEventListener('blur', buscarEnderecoPorCEP);
    document
        .getElementById('profileCEP')
        .addEventListener('input', formatarCEP);

    // Adicionar evento para CEP do veículo
    document
        .getElementById('cepVeiculo')
        .addEventListener('blur', buscarEnderecoPorCEPVeiculo);
    document
        .getElementById('cepVeiculo')
        .addEventListener('input', formatarCEP);

    // Menu mobile
    document
        .getElementById('mobileMenuBtn')
        .addEventListener('click', toggleSidebar);

    // Configuração do cadastro de veículos
    document
        .getElementById('tipoVeiculo')
        .addEventListener('change', function () {
            atualizarSubtipos();
            atualizarMarcas();
            atualizarTiposCarroceria();
        });

    document
        .getElementById('subtipoVeiculo')
        .addEventListener('change', atualizarSubtipos);

    document
        .getElementById('especieVeiculo')
        .addEventListener('change', atualizarCapacidades);
    document
        .getElementById('marcaVeiculo')
        .addEventListener('change', atualizarModelos);
    document
        .getElementById('periodoDisponibilidade')
        .addEventListener('change', atualizarHorarios);

    // Configuração dos checkboxes
    document
        .querySelectorAll('input[name="combustivel"]')
        .forEach((checkbox) => {
            checkbox.addEventListener('change', function () {
                const checkboxes = document.querySelectorAll(
                    'input[name="combustivel"]:checked'
                );
                const preferenciaContainer = document.getElementById(
                    'preferenciaCombustivelContainer'
                );
                const preferenciaSelect = document.getElementById(
                    'preferenciaCombustivel'
                );

                if (checkboxes.length > 1) {
                    preferenciaContainer.style.display = 'block';
                    preferenciaSelect.innerHTML = '';

                    checkboxes.forEach((cb) => {
                        const option = document.createElement('option');
                        option.value = cb.value;
                        option.textContent =
                            {
                                gasolina: 'Gasolina',
                                etanol: 'Etanol',
                                s10: 'S-10',
                                s500: 'S-500',
                            }[cb.value] || cb.value;
                        preferenciaSelect.appendChild(option);
                    });
                } else {
                    preferenciaContainer.style.display = 'none';
                }
            });
        });

    // Configure os campos de preço
    document
        .querySelectorAll('input[name="metodoCobranca"]')
        .forEach((checkbox) => {
            checkbox.addEventListener('change', function () {
                const priceInput =
                    this.closest('label').querySelector('.price-input');
                priceInput.disabled = !this.checked;
                if (!this.checked) priceInput.value = '';
            });
        });

    // Inicialmente desabilite todos os inputs de preço
    document.querySelectorAll('.price-input').forEach((input) => {
        input.disabled = true;
    });

    // Termos e condições
    document
        .getElementById('termosCondicoes')
        .addEventListener('click', function (e) {
            if (e.target.type === 'checkbox') {
                abrirTermosCondicoes();
            }
        });

    // Configurar input de foto
    document
        .getElementById('photoInput')
        .addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const preview = document.getElementById('photoPreview');
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                    document.getElementById('savePhotoBtn').disabled = false;
                };
                reader.readAsDataURL(file);
            }
        });

    // Mostrar seção inicial
    mostrarSecao(secaoAtiva);
});

// Função para exibir notificações
function showNotification(message, type) {
    Swal.fire({
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 1500,
    });
}

document.getElementById('cepVeiculo').addEventListener('input', function (e) {
    const cep = e.target.value || ''; // Garante que não seja undefined
    const cepFormatado = formatarCEP(cep);
    if (cepFormatado !== cep) {
        e.target.value = cepFormatado;
    }
});

// Função para mostrar erros em campos do formulário
function mostrarErro(campoId, mensagem) {
    let campo = document.getElementById(campoId);

    // Se não encontrar por ID, tenta por name
    if (!campo) {
        const campos = document.getElementsByName(campoId);
        if (campos.length > 0) campo = campos[0];
    }

    if (!campo) {
        console.error(`Campo ${campoId} não encontrado`);
        return;
    }

    // Mostra o campo se estiver oculto
    if (campo.offsetParent === null) {
        campo.closest('.etapa-cadastro').style.display = 'block';
        etapaAtualCadastro = parseInt(
            campo.closest('.etapa-cadastro').id.replace('etapa', '')
        );
        atualizarProgressoCadastro();
    }

    const erroAnterior = campo.parentNode.querySelector('.error-message');
    if (erroAnterior) erroAnterior.remove();

    const erro = document.createElement('div');
    erro.className = 'error-message';
    erro.textContent = mensagem;

    campo.parentNode.insertBefore(erro, campo.nextSibling);
    campo.classList.add('input-invalid', 'shake');

    setTimeout(() => {
        campo.classList.remove('shake');
    }, 500);
}

// Toggle do sidebar
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Mudar de seção
function mostrarSecao(secao) {
    document.querySelectorAll('.locador-section').forEach((sec) => {
        sec.style.display = 'none';
    });
    document.getElementById(secao).style.display = 'block';

    document.querySelectorAll('.nav-item').forEach((item) => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(secao)) {
            item.classList.add('active');
        }
    });

    // Se a seção for 'notificacoes', forçar a exibição das notificações
    if (secao === 'notificacoes') {
        displayNotifications();
    }

    secaoAtiva = secao;
}

// Fix by ensuring cep is a string
function formatarCEP(event) {
    let cep = event.target.value || '';
    if (typeof cep !== 'string') {
        cep = String(cep);
    }
    // Then continue with replace operations
    cep = cep.replace(/\D/g, '');
    cep = cep.replace(/^(\d{5})(\d)/, '\\$1-\\$2');
    event.target.value = cep;
}

// Funções de perfil
function carregarPerfil() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    // Informações Pessoais
    document.getElementById('profileName').textContent =
        usuarioLogado.nome || 'Locador';
    document.getElementById('profileFullName').value = usuarioLogado.nome || '';
    document.getElementById('profileCPF').value = usuarioLogado.cpf
        ? formatarCPF(usuarioLogado.cpf)
        : '';
    document.getElementById('profilePhone').value = usuarioLogado.celular
        ? formatarTelefone(usuarioLogado.celular)
        : '';
    document.getElementById('profileBirthDate').value =
        usuarioLogado.dataNascimento || '';

    // Endereço
    document.getElementById('profileCEP').value = formatarCEP(
        usuarioLogado.cep || ''
    );
    document.getElementById('profileAddress').value =
        usuarioLogado.endereco || '';

    // Documentos
    document.getElementById('profileDocNumber').value = usuarioLogado.cnh || '';
    document.getElementById('profileDocIssue').value =
        usuarioLogado.cnhExpedicao || '';
    document.getElementById('profileDocExpiry').value =
        usuarioLogado.cnhValidade || '';

    // Foto de perfil
    const profilePicture = document.getElementById('profilePicture');
    if (usuarioLogado.fotoPerfil) {
        profilePicture.innerHTML = '';
        profilePicture.style.background = 'none';
        const img = document.createElement('img');
        img.src = usuarioLogado.fotoPerfil;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        profilePicture.appendChild(img);
    } else {
        profilePicture.innerHTML =
            '<span style="color: white; font-size: 14px;">Adicione uma foto</span>';
        profilePicture.style.background = '#1e293b';
    }

    // Status da conta
    const statusElement = document.getElementById('profileStatus');
    if (usuarioLogado.status === 'aprovado') {
        statusElement.textContent = 'Conta Ativa';
        statusElement.className = 'profile-status status-active';
    } else if (usuarioLogado.status === 'pendente') {
        statusElement.textContent = 'Em Análise';
        statusElement.className = 'profile-status status-pending';
    }

    toggleEdicaoPerfil(false);
    verificarValidadeCNH();
}

// Formatações corrigidas - remova as barras invertidas extras
function formatarCPF(cpf) {
    if (!cpf) return '';
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone) {
    if (!telefone) return '';
    telefone = telefone.replace(/\D/g, '');
    if (telefone.length === 11) {
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
}

function formatarCEP(cep) {
    if (typeof cep !== 'string') {
        cep = String(cep);
    }
    cep = cep.replace(/\D/g, '');
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

// Formatação de moeda
function formatarMoeda(input) {
    if (!input.value) return;

    let valor = input.value.replace(/\D/g, '');

    // Se não houver valor, apenas sai da função
    if (valor === '') {
        input.value = '';
        return;
    }

    // Converte para número e formata como moeda
    valor = parseFloat(valor) / 100;
    input.value = valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

function desformatarMoeda(input) {
    if (!input.value) return;

    // Remove tudo que não é número
    let valor = input.value.replace(/\D/g, '');

    // Se for um valor formatado, converte para número
    if (valor) {
        valor = (parseInt(valor) / 100).toString();
        input.value = valor;
    }
}

// Update the togglePrecoInput function
function togglePrecoInput(checkbox) {
    const priceInput = checkbox.closest('label').querySelector('.price-input');
    if (priceInput) {
        priceInput.disabled = !checkbox.checked;
        if (!checkbox.checked) {
            priceInput.value = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialize price inputs
    initializePriceInputs();

    // Add null checks for these elements
    const btnNovoVeiculo = document.getElementById('btnNovoVeiculo');
    if (btnNovoVeiculo) {
        btnNovoVeiculo.addEventListener('click', initializePriceInputs);
    }

    const btnCancelar = document.getElementById('btnCancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', initializePriceInputs);
    }

    // For the edit vehicle operation
    if (typeof window.editarVeiculo === 'function') {
        const originalEditarVeiculo = window.editarVeiculo;
        window.editarVeiculo = function (veiculoId) {
            originalEditarVeiculo(veiculoId);

            // After loading vehicle data, ensure price inputs are properly set
            setTimeout(function () {
                document
                    .querySelectorAll(
                        'input[type="checkbox"][name="metodologiaCobranca"]'
                    )
                    .forEach((checkbox) => {
                        togglePrecoInput(checkbox);
                    });
            }, 100);
        };
    }
});

function formatarValorMoeda(valor) {
    if (!valor) return '';

    // Se for string, converte para número
    if (typeof valor === 'string') {
        valor = parseFloat(valor.replace(/[^\d,.]/g, '').replace(',', '.'));
    }

    // Formata como moeda brasileira
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

// Edição de perfil
function toggleEdicaoPerfil(editar) {
    const camposEditaveis = [
        'profileFullName',
        'profilePhone',
        'profileBirthDate',
        'profileCEP',
        'profileAddress',
        'profileDocNumber',
        'profileDocIssue',
        'profileDocExpiry',
    ];

    camposEditaveis.forEach((id) => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.disabled = !editar;
            campo.classList.toggle('editing', editar);
        }
    });

    document.querySelector('.action-buttons').style.display = editar
        ? 'flex'
        : 'none';

    if (!document.getElementById('editProfileBtn')) {
        const editBtn = document.createElement('button');
        editBtn.id = 'editProfileBtn';
        editBtn.className = 'btn btn-primary';
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Editar Perfil';
        editBtn.onclick = () => toggleEdicaoPerfil(true);
        document.querySelector('.profile-info').appendChild(editBtn);
    }

    document.getElementById('editProfileBtn').style.display = editar
        ? 'none'
        : 'block';
}

// Verificar validade CNH
function verificarValidadeCNH() {
    const expiryDate = document.getElementById('profileDocExpiry').value;
    const issueDate = document.getElementById('profileDocIssue').value;
    const birthDate = document.getElementById('profileBirthDate').value;
    const expiryField = document.getElementById('profileDocExpiry');
    const warningElement = document.getElementById('cnhExpiryWarning');
    const statusElement = document.querySelector('.profile-status');

    if (!expiryDate || !issueDate || !birthDate) return;

    const today = new Date();
    const expiry = new Date(expiryDate);
    const issue = new Date(issueDate);
    const birth = new Date(birthDate);

    // Calcula a idade
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    const adjustedAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    // Validade máxima baseada na idade
    const maxYears = adjustedAge >= 50 ? 5 : 10;
    const maxExpiry = new Date(issue);
    maxExpiry.setFullYear(maxExpiry.getFullYear() + maxYears);

    if (expiry > maxExpiry) {
        expiryField.classList.add('input-invalid');
        warningElement.textContent = `Validade máxima para sua idade é de ${maxYears} anos (até ${maxExpiry.toLocaleDateString()})`;
        warningElement.style.display = 'block';
    } else {
        expiryField.classList.remove('input-invalid');
        warningElement.style.display = 'none';
    }

    // Verifica se está vencida
    const isExpired = expiry < today;
    if (isExpired) {
        expiryField.classList.add('input-invalid');
        warningElement.textContent = 'CNH vencida!';
        warningElement.style.display = 'block';

        if (!document.getElementById('cnhStatus')) {
            const span = document.createElement('span');
            span.id = 'cnhStatus';
            span.className = 'status-cnh-expired';
            span.textContent = 'CNH Vencida';
            statusElement.parentNode.insertBefore(
                span,
                statusElement.nextSibling
            );
        }
    } else {
        const cnhStatus = document.getElementById('cnhStatus');
        if (cnhStatus) cnhStatus.remove();
    }
}

// Buscar endereço por CEP
async function buscarEnderecoPorCEP() {
    const cep = document.getElementById('profileCEP').value.replace(/\D/g, '');
    if (cep.length !== 8) {
        mostrarErro('profileCEP', 'CEP inválido');
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            mostrarErro('profileCEP', 'CEP não encontrado');
            return;
        }

        let endereco = '';
        if (data.logradouro) endereco += data.logradouro;
        if (data.bairro) endereco += (endereco ? ', ' : '') + data.bairro;
        if (data.localidade)
            endereco += (endereco ? ', ' : '') + data.localidade;
        if (data.uf) endereco += (endereco ? ' - ' : '') + data.uf;

        document.getElementById('profileAddress').value = endereco;
    } catch (error) {
        mostrarErro('profileCEP', 'Erro ao buscar CEP');
    }
}

async function buscarEnderecoPorCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length !== 8) return null;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        return data.erro ? null : data;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        return null;
    }
}

// Buscar endereço por CEP do veículo
async function buscarEnderecoPorCEPVeiculo() {
    const cep = document.getElementById('cepVeiculo').value.replace(/\D/g, '');
    if (cep.length !== 8) {
        mostrarErro('cepVeiculo', 'CEP inválido');
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            mostrarErro('cepVeiculo', 'CEP não encontrado');
            return;
        }

        let endereco = '';
        if (data.logradouro) endereco += data.logradouro;
        if (data.bairro) endereco += (endereco ? ', ' : '') + data.bairro;
        if (data.localidade)
            endereco += (endereco ? ', ' : '') + data.localidade;
        if (data.uf) endereco += (endereco ? ' - ' : '') + data.uf;

        document.getElementById('enderecoVeiculo').value = endereco;
    } catch (error) {
        mostrarErro('cepVeiculo', 'Erro ao buscar CEP');
    }
}

// Funções de foto de perfil
function abrirModalFoto() {
    const modal = document.getElementById('photoModal');
    modal.style.display = 'flex';

    const preview = document.getElementById('photoPreview');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (usuarioLogado?.fotoPerfil) {
        preview.src = usuarioLogado.fotoPerfil;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }

    document.getElementById('photoInput').value = '';
    document.getElementById('savePhotoBtn').disabled = true;

    // Adiciona/remove botão de remover foto
    const photoActions = document.querySelector('.photo-actions');
    if (usuarioLogado?.fotoPerfil) {
        if (!document.getElementById('removePhotoBtn')) {
            const removeBtn = document.createElement('button');
            removeBtn.id = 'removePhotoBtn';
            removeBtn.className = 'btn btn-danger';
            removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remover';
            removeBtn.onclick = removerFoto;
            photoActions.insertBefore(removeBtn, photoActions.firstChild);
        }
    } else if (document.getElementById('removePhotoBtn')) {
        document.getElementById('removePhotoBtn').remove();
    }
}

function fecharModalFoto() {
    document.getElementById('photoModal').style.display = 'none';
}

function removerFoto() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (usuarioLogado) {
        delete usuarioLogado.fotoPerfil;
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const index = usuarios.findIndex((u) => u.id === usuarioLogado.id);
        if (index !== -1) {
            usuarios[index] = { ...usuarioLogado };
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }

        carregarPerfil();
        fecharModalFoto();
        showNotification('Foto removida com sucesso!', 'success');
    }
}

function salvarFoto() {
    const preview = document.getElementById('photoPreview');
    if (preview.src && preview.style.display !== 'none') {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (usuarioLogado) {
            usuarioLogado.fotoPerfil = preview.src;
            localStorage.setItem(
                'usuarioLogado',
                JSON.stringify(usuarioLogado)
            );

            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const index = usuarios.findIndex((u) => u.id === usuarioLogado.id);
            if (index !== -1) {
                usuarios[index] = { ...usuarioLogado };
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
            }

            showNotification(
                'Foto de perfil atualizada com sucesso!',
                'success'
            );
            carregarPerfil();
        }

        fecharModalFoto();
    }
}

function salvarPerfil() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    // Coleta os dados editados
    usuarioLogado.nome = document.getElementById('profileFullName').value;
    usuarioLogado.celular = document
        .getElementById('profilePhone')
        .value.replace(/\D/g, '');
    usuarioLogado.dataNascimento =
        document.getElementById('profileBirthDate').value;
    usuarioLogado.cep = document
        .getElementById('profileCEP')
        .value.replace(/\D/g, '');
    usuarioLogado.endereco = document.getElementById('profileAddress').value;
    usuarioLogado.cnh = document.getElementById('profileDocNumber').value;
    usuarioLogado.cnhExpedicao =
        document.getElementById('profileDocIssue').value;
    usuarioLogado.cnhValidade =
        document.getElementById('profileDocExpiry').value;

    // Atualiza no localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuarios.findIndex((u) => u.id === usuarioLogado.id);
    if (index !== -1) {
        usuarios[index] = usuarioLogado;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

    showNotification('Perfil atualizado com sucesso!', 'success');
    toggleEdicaoPerfil(false);
    verificarValidadeCNH();
}

function cancelarEdicao() {
    carregarPerfil();
    showNotification('Alterações descartadas.', 'info');
}

// Funções de veículos
function configurarCadastroVeiculo() {
    const formCadastro = document.getElementById('formCadastroVeiculo');
    formCadastro.addEventListener('submit', salvarVeiculo);
}

function salvarVeiculo(e) {
    e.preventDefault();
    processarVeiculo();
}

function iniciarCadastroVeiculo(editMode = false) {
    // Reset all form fields to default values
    document.getElementById('formCadastroVeiculo').reset();

    // Ensure the horariosContainer is hidden by default
    const horariosContainer = document.getElementById('horariosContainer');
    if (horariosContainer) {
        horariosContainer.style.display = 'none';
    }
    etapaAtualCadastro = 1;
    atualizarProgressoCadastro();
    document.getElementById('modalCadastroVeiculo').style.display = 'flex';
    modoEdicao = editMode;

    // Atualiza o texto dos botões com base no modo (edição ou criação)
    const saveButton = document.getElementById('btnSalvarVeiculo');
    const laterButton = document.getElementById('btnContinuarDepois');

    if (editMode) {
        saveButton.innerHTML = '<i class="fas fa-check"></i> Salvar Edição';
        laterButton.innerHTML =
            '<i class="fas fa-save"></i> Continuar Edição Depois';
    } else {
        saveButton.innerHTML = '<i class="fas fa-check"></i> Salvar Veículo';
        laterButton.innerHTML = '<i class="fas fa-save"></i> Continuar Depois';
    }

    // Mostra a primeira etapa
    document.querySelectorAll('.etapa-cadastro').forEach((etapa) => {
        etapa.style.display = 'none';
    });
    document.getElementById('etapa1').style.display = 'block';

    // Preenche o select de anos
    const anoAtual = new Date().getFullYear();
    const selectAno = document.getElementById('anoVeiculo');
    selectAno.innerHTML = '<option value="">Selecione</option>';
    for (let ano = anoAtual; ano >= 1900; ano--) {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        selectAno.appendChild(option);
    }

    // Configura os eventos para upload de imagens
    configurarUploadImagens();

    // Se não for modo de edição, verifica se há um rascunho salvo
    if (!editMode) {
        verificarRascunho();
    }
}

function configurarUploadImagens() {
    const tiposImagem = [
        'Frontal',
        'LateralDireita',
        'LateralEsquerda',
        'Traseira',
        'Interior',
    ];

    tiposImagem.forEach((tipo) => {
        const input = document.getElementById(`imagem${tipo}`);
        const preview = document.getElementById(`preview${tipo}`);

        input.addEventListener('change', function (e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                    preview.parentNode.querySelector('i').style.display =
                        'none';
                    preview.parentNode.querySelector('span').style.display =
                        'none';
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    });
}

function atualizarProgressoCadastro() {
    const progressPercentage =
        ((etapaAtualCadastro - 1) / (totalEtapasCadastro - 1)) * 100;
    document.getElementById(
        'progressBarVeiculo'
    ).style.width = `${progressPercentage}%`;
    document.getElementById(
        'progressTextVeiculo'
    ).textContent = `Etapa ${etapaAtualCadastro} de ${totalEtapasCadastro}`;
}

function proximaEtapa(etapa) {
    if (!validarEtapaAtual(etapaAtualCadastro)) {
        return;
    }

    document.getElementById(`etapa${etapaAtualCadastro}`).style.display =
        'none';
    etapaAtualCadastro = etapa;
    document.getElementById(`etapa${etapaAtualCadastro}`).style.display =
        'block';
    atualizarProgressoCadastro();
    document.querySelector('.modal-content').scrollTop = 0;
}

function voltarEtapa(etapa) {
    document.getElementById(`etapa${etapaAtualCadastro}`).style.display =
        'none';
    etapaAtualCadastro = etapa;
    document.getElementById(`etapa${etapaAtualCadastro}`).style.display =
        'block';
    atualizarProgressoCadastro();
    document.querySelector('.modal-content').scrollTop = 0;
}

function validarEtapaAtual(etapa) {
    let isValid = true;

    // Limpar erros anteriores
    document.querySelectorAll('.error-message').forEach((el) => el.remove());
    document
        .querySelectorAll('.input-invalid')
        .forEach((el) => el.classList.remove('input-invalid'));

    // Validar conforme a etapa
    switch (etapa) {
        case 1:
            if (!document.getElementById('tipoVeiculo').value) {
                mostrarErro('tipoVeiculo', 'Selecione o tipo de veículo');
                isValid = false;
            }
            break;

        case 2:
            if (!document.getElementById('subtipoVeiculo').value) {
                mostrarErro('subtipoVeiculo', 'Selecione o subtipo do veículo');
                isValid = false;
            }
            break;

        case 3:
            if (!document.getElementById('tipoCarroceria').value) {
                mostrarErro('tipoCarroceria', 'Selecione o tipo de carroceria');
                isValid = false;
            }
            if (!document.getElementById('especieVeiculo').value) {
                mostrarErro('especieVeiculo', 'Selecione a espécie do veículo');
                isValid = false;
            }

            // Validação condicional baseada na espécie
            const especie = document.getElementById('especieVeiculo').value;
            if (especie === 'passageiros') {
                if (!document.getElementById('quantidadePassageiros').value) {
                    mostrarErro(
                        'quantidadePassageiros',
                        'Informe a quantidade de passageiros'
                    );
                    isValid = false;
                }
            } else if (especie === 'carga') {
                if (!document.getElementById('capacidadeCarga').value) {
                    mostrarErro(
                        'capacidadeCarga',
                        'Informe a capacidade de carga'
                    );
                    isValid = false;
                }
            }
            break;

        case 4:
            if (!document.getElementById('marcaVeiculo').value) {
                mostrarErro('marcaVeiculo', 'Selecione a marca do veículo');
                isValid = false;
            }
            if (!document.getElementById('modeloVeiculo').value) {
                mostrarErro('modeloVeiculo', 'Selecione o modelo do veículo');
                isValid = false;
            }
            if (!document.getElementById('anoVeiculo').value) {
                mostrarErro('anoVeiculo', 'Selecione o ano do veículo');
                isValid = false;
            }
            // Verifica se há um documento novo OU um documento já salvo
            const docInput = document.getElementById('documentoVeiculo');
            const docPreview = document.getElementById('documentoPreview');
            const docBase64 = document.getElementById('documentoBase64');

            const temNovoDoc = docInput.files && docInput.files.length > 0;
            const temDocSalvo =
                (docPreview && docPreview.innerHTML !== '') || docBase64;

            if (!temNovoDoc && !temDocSalvo && !modoEdicao) {
                mostrarErro(
                    'documentoVeiculo',
                    'Selecione o documento do veículo'
                );
                isValid = false;
            }
            break;

        case 5:
            // Validação do CEP
            const cep = document
                .getElementById('cepVeiculo')
                .value.replace(/\D/g, '');
            if (cep.length !== 8) {
                mostrarErro('cepVeiculo', 'CEP inválido');
                isValid = false;
            }

            // Validação do endereço
            if (!document.getElementById('enderecoVeiculo').value) {
                mostrarErro('enderecoVeiculo', 'Informe o endereço');
                isValid = false;
            }

            // Validação das imagens (mantida como estava)
            if (!modoEdicao) {
                const tiposImagemObrigatorios = [
                    'Frontal',
                    'LateralDireita',
                    'LateralEsquerda',
                    'Traseira',
                ];
                tiposImagemObrigatorios.forEach((tipo) => {
                    const input = document.getElementById(`imagem${tipo}`);
                    const preview = document.getElementById(`preview${tipo}`);
                    const temNovaImagem = input.files && input.files.length > 0;
                    const temImagemPreview =
                        preview && preview.style.display !== 'none';

                    if (!temNovaImagem && !temImagemPreview) {
                        mostrarErro(
                            `imagem${tipo}`,
                            `Imagem ${tipo} é obrigatória`
                        );
                        isValid = false;
                    }
                });
            }
            break;

        case 6:
            // Validar dias da semana
            if (
                document.querySelectorAll('input[name="diasSemana"]:checked')
                    .length === 0
            ) {
                mostrarErro('diasSemana', 'Selecione pelo menos um dia');
                isValid = false;
            }

            // Validar métodos de cobrança
            const metodosSelecionados = document.querySelectorAll(
                'input[name="metodoCobranca"]:checked'
            );
            if (metodosSelecionados.length === 0) {
                mostrarErro(
                    'metodoCobranca',
                    'Selecione pelo menos um método de cobrança'
                );
                isValid = false;
            } else {
                metodosSelecionados.forEach((checkbox) => {
                    const priceInput = checkbox
                        .closest('label')
                        .querySelector('.price-input');
                    if (!priceInput.value) {
                        mostrarErro(
                            priceInput.name || 'price-input',
                            'Informe o valor'
                        );
                        isValid = false;
                    }
                });
            }

            // Validar termos
            if (!document.getElementById('termosCondicoes').checked) {
                mostrarErro(
                    'termosCondicoes',
                    'Você deve aceitar os termos e condições'
                );
                isValid = false;
            }
            break;
    }

    return isValid;
}

// Replace or add this function
function initializePriceInputs() {
    // Disable all price inputs initially
    document.querySelectorAll('.price-input').forEach((input) => {
        input.disabled = true;
        input.value = '';
    });

    // Enable only those with checked checkboxes
    document
        .querySelectorAll(
            'input[type="checkbox"][name="metodologiaCobranca"]:checked'
        )
        .forEach((checkbox) => {
            const priceInput = checkbox
                .closest('label')
                .querySelector('.price-input');
            if (priceInput) {
                priceInput.disabled = false;
            }
        });
}

function atualizarSubtipos() {
    const tipoVeiculo = document.getElementById('tipoVeiculo').value;
    const subtipoContainer = document.getElementById('subtipoContainer');
    const subtipoVeiculo = document.getElementById('subtipoVeiculo');

    if (!tipoVeiculo) {
        subtipoContainer.style.display = 'none';
        return;
    }

    subtipoContainer.style.display = 'block';

    // Salvar seleção atual
    const selecaoAtual = subtipoVeiculo.value;

    // Limpar opções
    subtipoVeiculo.innerHTML = '';

    let subtipos = [];

    switch (tipoVeiculo) {
        case 'carro':
        case 'moto':
        case 'van':
            subtipos = [
                {
                    value: 'combustao',
                    text: 'Motorizado a Combustão',
                },
                { value: 'eletrico', text: 'Motorizado Elétrico' },
                { value: 'hibrido', text: 'Motorizado Híbrido' },
            ];
            break;
        case 'bicicleta':
            subtipos = [
                { value: 'mecanico', text: 'Mecânico' },
                {
                    value: 'combustao',
                    text: 'Motorizado a Combustão',
                },
                { value: 'eletrico', text: 'Motorizado Elétrico' },
            ];
            break;
        case 'patinete':
        case 'scooter':
            subtipos = [{ value: 'eletrico', text: 'Motorizado Elétrico' }];
            break;
    }

    subtipos.forEach((subtipo) => {
        const option = document.createElement('option');
        option.value = subtipo.value;
        option.textContent = subtipo.text;
        subtipoVeiculo.appendChild(option);
    });

    // Restaurar seleção anterior se possível
    if (selecaoAtual) {
        const existe = Array.from(subtipoVeiculo.options).some(
            (opt) => opt.value === selecaoAtual
        );
        if (existe) subtipoVeiculo.value = selecaoAtual;
    }

    // Mostrar containers conforme subtipo
    const subtipo = subtipoVeiculo.value;
    document.getElementById('combustaoContainer').style.display =
        subtipo === 'combustao' || subtipo === 'hibrido' ? 'block' : 'none';
    document.getElementById('eletricoContainer').style.display =
        subtipo === 'eletrico' || subtipo === 'hibrido' ? 'block' : 'none';

    // Mostrar motorização e câmbio quando relevante
    const tipo = document.getElementById('tipoVeiculo').value;
    document.getElementById('motorizacaoContainer').style.display =
        subtipo === 'combustao' || subtipo === 'hibrido' ? 'block' : 'none';
    document.getElementById('cambioContainer').style.display =
        tipo !== 'bicicleta' && tipo !== 'patinete' && tipo !== 'scooter'
            ? 'block'
            : 'none';

    // Atualizar opções
    atualizarMotorizacao();
    atualizarCambio();
}

function atualizarTiposCarroceria() {
    const tipoVeiculo = document.getElementById('tipoVeiculo').value;
    const tipoCarroceria = document.getElementById('tipoCarroceria');

    tipoCarroceria.innerHTML = '<option value="">Selecione</option>';

    if (!tipoVeiculo) return;

    tiposCarroceria[tipoVeiculo].forEach((tipo) => {
        const option = document.createElement('option');
        option.value = tipo.toLowerCase().replace(' ', '-');
        option.textContent = tipo;
        tipoCarroceria.appendChild(option);
    });
}

function atualizarMotorizacao() {
    const tipoVeiculo = document.getElementById('tipoVeiculo').value;
    const motorizacao = document.getElementById('motorizacao');

    // Guardar seleção atual se houver
    const selecaoAtual = motorizacao.value;

    motorizacao.innerHTML = '<option value="">Selecione</option>';

    if (!tipoVeiculo) return;

    let motorizacoes = [];

    switch (tipoVeiculo) {
        case 'carro':
        case 'van':
            motorizacoes = ['1.0', '1.4', '1.6', '1.8', '2.0', 'Outro'];
            break;
        case 'moto':
            motorizacoes = [
                '75cc',
                '100cc',
                '125cc',
                '150cc',
                '160cc',
                '250cc',
                '300cc',
                '350cc',
                '400cc',
                '500cc',
                '600cc',
                '750cc',
                '1000cc',
                '1200cc',
            ];
            break;
        case 'bicicleta':
            motorizacoes = ['50cc', '65cc', '75cc', '80cc', '100cc'];
            break;
    }

    motorizacoes.forEach((motor) => {
        const option = document.createElement('option');
        option.value = motor;
        option.textContent = motor;
        motorizacao.appendChild(option);
    });

    // Restaurar seleção anterior se possível
    if (selecaoAtual) {
        const existe = Array.from(motorizacao.options).some(
            (opt) => opt.value === selecaoAtual
        );
        if (existe) motorizacao.value = selecaoAtual;
    }
}

function atualizarCambio() {
    const tipoVeiculo = document.getElementById('tipoVeiculo').value;
    const tipoCambio = document.getElementById('tipoCambio');

    // Guardar seleção atual se houver
    const selecaoAtual = tipoCambio.value;

    tipoCambio.innerHTML = '<option value="">Selecione</option>';

    if (!tipoVeiculo) return;

    let cambios = [];

    switch (tipoVeiculo) {
        case 'carro':
        case 'van':
            cambios = ['Manual', 'Automático'];
            break;
        case 'moto':
            cambios = ['Manual', 'Automático', 'Semi-automático'];
            break;
        case 'bicicleta':
            cambios = [
                'Sem marchas',
                '18 marchas',
                '21 marchas',
                '24 marchas',
                '27 marchas',
                '30 marchas',
            ];
            break;
    }

    cambios.forEach((cambio) => {
        const option = document.createElement('option');
        option.value = cambio.toLowerCase().replace(' ', '-');
        option.textContent = cambio;
        tipoCambio.appendChild(option);
    });

    // Restaurar seleção anterior se possível
    if (selecaoAtual) {
        const existe = Array.from(tipoCambio.options).some(
            (opt) => opt.value === selecaoAtual
        );
        if (existe) tipoCambio.value = selecaoAtual;
    }
}

function atualizarCapacidades() {
    const especieVeiculo = document.getElementById('especieVeiculo').value;

    document.getElementById('passageirosContainer').style.display = 'none';
    document.getElementById('cargaContainer').style.display = 'none';

    if (especieVeiculo === 'passageiros' || especieVeiculo === 'misto') {
        document.getElementById('passageirosContainer').style.display = 'block';
    }

    if (especieVeiculo === 'carga' || especieVeiculo === 'misto') {
        document.getElementById('cargaContainer').style.display = 'block';
    }
}

function atualizarMarcas() {
    const tipoVeiculo = document.getElementById('tipoVeiculo').value;
    const marcaVeiculo = document.getElementById('marcaVeiculo');

    // Guardar seleção atual se houver
    const selecaoAtual = marcaVeiculo.value;

    marcaVeiculo.innerHTML = '<option value="">Selecione</option>';

    if (!tipoVeiculo) return;

    marcasPorTipo[tipoVeiculo].forEach((marca) => {
        const option = document.createElement('option');
        option.value = marca.toLowerCase().replace(' ', '-');
        option.textContent = marca;
        marcaVeiculo.appendChild(option);
    });

    // Restaurar seleção anterior se possível
    if (selecaoAtual) {
        const existe = Array.from(marcaVeiculo.options).some(
            (opt) => opt.value === selecaoAtual
        );
        if (existe) marcaVeiculo.value = selecaoAtual;
    }
}

function atualizarModelos() {
    const marcaVeiculo = document.getElementById('marcaVeiculo').value;
    const modeloVeiculo = document.getElementById('modeloVeiculo');

    // Guardar seleção atual se houver
    const selecaoAtual = modeloVeiculo.value;

    // Remover qualquer input personalizado existente
    const customInputs = document.querySelectorAll('#modeloCustom');
    customInputs.forEach((input) => input.remove());

    modeloVeiculo.innerHTML =
        '<option value="">Selecione a marca primeiro</option>';

    if (!marcaVeiculo) return;

    const marcaFormatada = marcaVeiculo
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-');

    if (modelosPorMarca[marcaFormatada]) {
        modelosPorMarca[marcaFormatada].forEach((modelo) => {
            const option = document.createElement('option');
            option.value = modelo.toLowerCase().replace(' ', '-');
            option.textContent = modelo;
            modeloVeiculo.appendChild(option);
        });

        // Adiciona opção "Outro" ao final
        const option = document.createElement('option');
        option.value = 'outro';
        option.textContent = 'Outro (especificar)';
        modeloVeiculo.appendChild(option);
    } else {
        modeloVeiculo.innerHTML =
            '<option value="outro">Outro (especificar)</option>';
    }

    // Se selecionar "Outro", mostrar campo para digitar
    modeloVeiculo.addEventListener('change', function () {
        const existingCustomInput = document.getElementById('modeloCustom');
        if (this.value === 'outro') {
            if (!existingCustomInput) {
                const input = document.createElement('input');
                input.type = 'text';
                input.id = 'modeloCustom';
                input.placeholder = 'Digite o modelo';
                input.className = 'input-field';
                input.style.marginTop = '0.5rem';
                modeloVeiculo.parentNode.appendChild(input);
            }
        } else if (existingCustomInput) {
            existingCustomInput.remove();
        }
    });

    // Restaurar seleção anterior se possível
    if (selecaoAtual) {
        const existe = Array.from(modeloVeiculo.options).some(
            (opt) => opt.value === selecaoAtual
        );
        if (existe) {
            modeloVeiculo.value = selecaoAtual;
            // Se era "outro", também restaurar o campo de input
            if (selecaoAtual === 'outro') {
                const input = document.createElement('input');
                input.type = 'text';
                input.id = 'modeloCustom';
                input.placeholder = 'Digite o modelo';
                input.className = 'input-field';
                input.style.marginTop = '0.5rem';
                modeloVeiculo.parentNode.appendChild(input);
            }
        }
    }
}

function atualizarHorarios() {
    const periodo = document.getElementById('periodoDisponibilidade').value;
    document.getElementById('horariosContainer').style.display =
        periodo === 'parcial' ? 'block' : 'none';
}

function adicionarHorario() {
    const container = document.getElementById('horariosAdicionados');
    const div = document.createElement('div');
    div.className = 'horario-item';
    div.innerHTML = `
                                <select class="periodo-select" onchange="ajustarHorarios(this)">
                                    <option value="manha">Manhã (06h-12h)</option>
                                    <option value="tarde">Tarde (13h-18h)</option>
                                    <option value="noite">Noite (19h-23h)</option>
                                    <option value="madrugada">Madrugada (00h-05h)</option>
                                </select>
                                <input type="time" class="inicio-time" min="06:00" max="12:00">
                                <span>às</span>
                                <input type="time" class="fim-time" min="06:00" max="12:00">
                                <button type="button" class="btn btn-danger" onclick="removerHorario(this)">
                                    <i class="fas fa-times"></i>
                                </button>
                            `;
    container.appendChild(div);
    ajustarHorarios(div.querySelector('.periodo-select'));
}

function ajustarHorarios(select) {
    const periodo = select.value;
    const horarioItem = select.closest('.horario-item');
    const inicioInput = horarioItem.querySelector('.inicio-time');
    const fimInput = horarioItem.querySelector('.fim-time');

    switch (periodo) {
        case 'manha':
            inicioInput.min = '06:00';
            inicioInput.max = '12:00';
            fimInput.min = '06:00';
            fimInput.max = '12:00';
            inicioInput.value = '06:00';
            fimInput.value = '12:00';
            break;
        case 'tarde':
            inicioInput.min = '13:00';
            inicioInput.max = '18:00';
            fimInput.min = '13:00';
            fimInput.max = '18:00';
            inicioInput.value = '13:00';
            fimInput.value = '18:00';
            break;
        case 'noite':
            inicioInput.min = '19:00';
            inicioInput.max = '23:00';
            fimInput.min = '19:00';
            fimInput.max = '23:00';
            inicioInput.value = '19:00';
            fimInput.value = '23:00';
            break;
        case 'madrugada':
            inicioInput.min = '00:00';
            inicioInput.max = '05:00';
            fimInput.min = '00:00';
            fimInput.max = '05:00';
            inicioInput.value = '00:00';
            fimInput.value = '05:00';
            break;
    }
}

function removerHorario(btn) {
    btn.parentNode.remove();
}

function abrirTermosCondicoes() {
    document.getElementById('modalTermos').style.display = 'flex';
}

function aceitarTermos() {
    document.getElementById('termosCondicoes').checked = true;
    document.getElementById('modalTermos').style.display = 'none';
}

function verificarRascunho() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const rascunhos = veiculos.filter(
        (v) => v.locadorId === usuarioLogado.id && v.status === 'rascunho'
    );

    if (rascunhos.length > 0) {
        const rascunhoMaisRecente = rascunhos.reduce((prev, current) =>
            new Date(prev.dataCadastro) > new Date(current.dataCadastro)
                ? prev
                : current
        );

        Swal.fire({
            title: 'Rascunho encontrado',
            text: 'Você tem um cadastro de veículo não finalizado. Deseja continuar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Começar novo',
        }).then((result) => {
            if (result.isConfirmed) {
                preencherFormularioComRascunho(rascunhoMaisRecente);
            } else {
                localStorage.setItem(
                    'veiculos',
                    JSON.stringify(
                        veiculos.filter((v) => v.id !== rascunhoMaisRecente.id)
                    )
                );
            }
        });
    }
}

function preencherFormularioComRascunho(rascunho) {
    // Marcar como modo de edição se o rascunho não for de estado pendente
    if (rascunho.status !== 'rascunho') {
        modoEdicao = true;
        const saveButton = document.getElementById('btnSalvarVeiculo');
        const laterButton = document.getElementById('btnContinuarDepois');

        saveButton.innerHTML = '<i class="fas fa-check"></i> Salvar Edição';
        laterButton.innerHTML =
            '<i class="fas fa-save"></i> Continuar Edição Depois';
    }

    // Preenche etapa 1
    document.getElementById('tipoVeiculo').value = rascunho.tipo;
    atualizarSubtipos();
    document.getElementById('subtipoVeiculo').value = rascunho.subtipo;

    // Preenche etapa 2
    if (
        rascunho.combustiveis &&
        (rascunho.subtipo === 'combustao' || rascunho.subtipo === 'hibrido')
    ) {
        rascunho.combustiveis.forEach((comb) => {
            const checkbox = document.querySelector(
                `input[name="combustivel"][value="${comb}"]`
            );
            if (checkbox) checkbox.checked = true;
        });

        // Mostrar e configurar combustível preferencial se houver múltiplos combustíveis
        if (rascunho.combustiveis.length > 1) {
            document.getElementById(
                'preferenciaCombustivelContainer'
            ).style.display = 'block';
            const preferenciaSelect = document.getElementById(
                'preferenciaCombustivel'
            );
            preferenciaSelect.innerHTML = '';

            rascunho.combustiveis.forEach((comb) => {
                const option = document.createElement('option');
                option.value = comb;
                option.textContent =
                    {
                        gasolina: 'Gasolina',
                        etanol: 'Etanol',
                        s10: 'S-10',
                        s500: 'S-500',
                    }[comb] || comb;
                preferenciaSelect.appendChild(option);
            });

            if (rascunho.preferenciaCombustivel) {
                preferenciaSelect.value = rascunho.preferenciaCombustivel;
            }
        }
    }

    if (
        rascunho.tensoes &&
        (rascunho.subtipo === 'eletrico' || rascunho.subtipo === 'hibrido')
    ) {
        rascunho.tensoes.forEach((tensao) => {
            const checkbox = document.querySelector(
                `input[name="tensao"][value="${tensao}"]`
            );
            if (checkbox) checkbox.checked = true;
        });
    }

    if (rascunho.motorizacao) {
        const motorizacaoSelect = document.getElementById('motorizacao');
        if (
            motorizacaoSelect.querySelector(
                `option[value="${rascunho.motorizacao}"]`
            )
        ) {
            motorizacaoSelect.value = rascunho.motorizacao;
        } else {
            // Se a opção não existir, adiciona
            const option = document.createElement('option');
            option.value = rascunho.motorizacao;
            option.textContent = rascunho.motorizacao;
            motorizacaoSelect.appendChild(option);
            motorizacaoSelect.value = rascunho.motorizacao;
        }
    }

    if (rascunho.tipoCambio) {
        const cambioSelect = document.getElementById('tipoCambio');
        if (
            cambioSelect.querySelector(`option[value="${rascunho.tipoCambio}"]`)
        ) {
            cambioSelect.value = rascunho.tipoCambio;
        } else {
            // Se a opção não existir, adiciona
            const option = document.createElement('option');
            option.value = rascunho.tipoCambio;
            option.textContent =
                rascunho.tipoCambio.charAt(0).toUpperCase() +
                rascunho.tipoCambio.slice(1).replace('-', ' ');
            cambioSelect.appendChild(option);
            cambioSelect.value = rascunho.tipoCambio;
        }
    }

    // Preenche etapa 3
    atualizarTiposCarroceria();
    document.getElementById('tipoCarroceria').value = rascunho.tipoCarroceria;

    document.getElementById('especieVeiculo').value = rascunho.especie;
    atualizarCapacidades();

    if (rascunho.passageiros) {
        document.getElementById('quantidadePassageiros').value =
            rascunho.passageiros;
    }
    if (rascunho.capacidadeCarga) {
        document.getElementById('capacidadeCarga').value =
            rascunho.capacidadeCarga;
    }

    // Preenche etapa 4
    atualizarMarcas();
    document.getElementById('marcaVeiculo').value = rascunho.marca;
    atualizarModelos();

    // Se o modelo for personalizado (outro)
    if (
        rascunho.modelo === 'outro' &&
        document.getElementById('modeloCustom')
    ) {
        document.getElementById('modeloVeiculo').value = 'outro';
        document.getElementById('modeloCustom').value =
            rascunho.modeloCustom || '';
    } else {
        document.getElementById('modeloVeiculo').value = rascunho.modelo;
    }

    document.getElementById('anoVeiculo').value = rascunho.ano;

    // Restaurar documento se existir
    if (rascunho.documento) {
        const docContainer =
            document.getElementById('documentoVeiculo').parentNode;

        // Remover preview existente se houver
        const existingPreview = document.getElementById('documentoPreview');
        if (existingPreview) existingPreview.remove();

        const docPreview = document.createElement('div');
        docPreview.id = 'documentoPreview';
        docPreview.innerHTML = `
                                    <p>Documento previamente carregado: ${
                                        rascunho.documento.nome || 'Documento'
                                    }</p>
                                    <input type="hidden" id="documentoBase64" value="${
                                        rascunho.documento.src
                                    }">
                                `;
        docContainer.appendChild(docPreview);
    }

    // Preenche etapa 5
    document.getElementById('cepVeiculo').value = rascunho.cep;
    document.getElementById('enderecoVeiculo').value = rascunho.endereco;

    // Carrega as imagens
    if (rascunho.imagens && rascunho.imagens.length > 0) {
        rascunho.imagens.forEach((imagem) => {
            let tipo = imagem.tipo;
            // Formatar o tipo para coincidir com os IDs
            if (tipo === 'frontal') tipo = 'Frontal';
            else if (tipo === 'lateraldireita') tipo = 'LateralDireita';
            else if (tipo === 'lateralesquerda') tipo = 'LateralEsquerda';
            else if (tipo === 'traseira') tipo = 'Traseira';
            else if (tipo === 'interior') tipo = 'Interior';

            const preview = document.getElementById(`preview${tipo}`);
            if (preview) {
                preview.src = imagem.src;
                preview.style.display = 'block';
                preview.parentNode.querySelector('i').style.display = 'none';
                preview.parentNode.querySelector('span').style.display = 'none';
            }
        });
    }

    // Preenche etapa 6
    if (rascunho.diasDisponiveis) {
        rascunho.diasDisponiveis.forEach((dia) => {
            const checkbox = document.querySelector(
                `input[name="diasSemana"][value="${dia}"]`
            );
            if (checkbox) checkbox.checked = true;
        });
    }

    document.getElementById('periodoDisponibilidade').value =
        rascunho.periodoDisponibilidade || 'integral';
    atualizarHorarios(); // Atualiza a exibição do container de horários

    // Restaurar horários disponíveis se forem parciais
    if (
        rascunho.periodoDisponibilidade === 'parcial' &&
        rascunho.horariosDisponiveis
    ) {
        const horariosContainer = document.getElementById(
            'horariosAdicionados'
        );
        horariosContainer.innerHTML = '';

        rascunho.horariosDisponiveis.forEach((horario) => {
            const div = document.createElement('div');
            div.className = 'horario-item';
            div.innerHTML = `
                                        <select class="periodo-select" onchange="ajustarHorarios(this)">
                                            <option value="manha" ${
                                                horario.periodo === 'manha'
                                                    ? 'selected'
                                                    : ''
                                            }>Manhã (06h-12h)</option>
                                            <option value="tarde" ${
                                                horario.periodo === 'tarde'
                                                    ? 'selected'
                                                    : ''
                                            }>Tarde (13h-18h)</option>
                                            <option value="noite" ${
                                                horario.periodo === 'noite'
                                                    ? 'selected'
                                                    : ''
                                            }>Noite (19h-23h)</option>
                                            <option value="madrugada" ${
                                                horario.periodo === 'madrugada'
                                                    ? 'selected'
                                                    : ''
                                            }>Madrugada (00h-05h)</option>
                                        </select>
                                        <input type="time" class="inicio-time" value="${
                                            horario.inicio
                                        }">
                                        <span>às</span>
                                        <input type="time" class="fim-time" value="${
                                            horario.fim
                                        }">
                                        <button type="button" class="btn btn-danger" onclick="removerHorario(this)">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    `;
            horariosContainer.appendChild(div);
        });
    }

    if (rascunho.metodosCobranca) {
        rascunho.metodosCobranca.forEach((metodo) => {
            const checkbox = document.querySelector(
                `input[name="metodoCobranca"][value="${metodo.tipo}"]`
            );
            if (checkbox) {
                checkbox.checked = true;
                const priceInput = checkbox
                    .closest('label')
                    .querySelector('.price-input');
                priceInput.disabled = false;
                priceInput.value = formatarValorMoeda(metodo.valor);
            }
        });
    }

    document.getElementById('tanqueCheio').checked = true;
    document.getElementById('termosCondicoes').checked = true;

    // Salva o ID do rascunho para atualização
    document.getElementById('formCadastroVeiculo').dataset.rascunhoId =
        rascunho.id;
}

function fecharCadastroVeiculo() {
    document.getElementById('modalCadastroVeiculo').style.display = 'none';
    document.getElementById('formCadastroVeiculo').reset();
    document
        .getElementById('formCadastroVeiculo')
        .removeAttribute('data-rascunho-id');
    modoEdicao = false;

    // Limpa as pré-visualizações de imagens
    const tiposImagem = [
        'Frontal',
        'LateralDireita',
        'LateralEsquerda',
        'Traseira',
        'Interior',
    ];
    tiposImagem.forEach((tipo) => {
        const preview = document.getElementById(`preview${tipo}`);
        preview.src = '';
        preview.style.display = 'none';
        preview.parentNode.querySelector('i').style.display = 'block';
        preview.parentNode.querySelector('span').style.display = 'block';
    });

    // Remover preview do documento
    const docPreview = document.getElementById('documentoPreview');
    if (docPreview) docPreview.remove();

    // Restaurar textos dos botões
    document.getElementById('btnSalvarVeiculo').innerHTML =
        '<i class="fas fa-check"></i> Salvar Veículo';
    document.getElementById('btnContinuarDepois').innerHTML =
        '<i class="fas fa-save"></i> Continuar Depois';
}

function salvarRascunho() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const veiculo = coletarDadosVeiculo();
    veiculo.status = 'rascunho';
    veiculo.dataAtualizacao = new Date().toISOString();

    // Processar o rascunho com um ID único para não sobrescrever outros veículos
    const processarRascunho = async () => {
        // Determinar se é um rascunho existente ou novo
        const rascunhoId = document.getElementById('formCadastroVeiculo')
            .dataset.rascunhoId;
        if (rascunhoId) {
            veiculo.id = rascunhoId; // Manter o mesmo ID quando atualizar
        } else {
            veiculo.id =
                'veic_' +
                Date.now() +
                '_' +
                Math.random().toString(36).substr(2, 9); // Gerar ID único
        }

        // Processar o documento
        const docInput = document.getElementById('documentoVeiculo');
        if (docInput.files && docInput.files[0]) {
            try {
                const docBase64 = await converterParaBase64(docInput.files[0]);
                veiculo.documento = {
                    nome: docInput.files[0].name,
                    src: docBase64,
                };
            } catch (error) {
                console.error('Erro ao processar documento:', error);
            }
        } else {
            // Se não tem arquivo, verifica se já tinha um documento salvo
            const docBase64 = document.getElementById('documentoBase64');
            if (docBase64) {
                veiculo.documento = {
                    nome: 'Documento salvo anteriormente',
                    src: docBase64.value,
                };
            }
        }

        // Processar imagens
        const tiposImagem = [
            'Frontal',
            'LateralDireita',
            'LateralEsquerda',
            'Traseira',
            'Interior',
        ];
        veiculo.imagens = [];

        // Coletar imagens de inputs
        for (const tipo of tiposImagem) {
            const input = document.getElementById(`imagem${tipo}`);
            if (input.files && input.files[0]) {
                try {
                    const base64 = await converterParaBase64(input.files[0]);
                    veiculo.imagens.push({
                        tipo: tipo.toLowerCase(),
                        src: base64,
                    });
                } catch (error) {
                    console.error(`Erro ao processar imagem ${tipo}:`, error);
                }
            }
        }

        // Coletar imagens já visualizadas (para edição)
        for (const tipo of tiposImagem) {
            const preview = document.getElementById(`preview${tipo}`);
            if (
                preview.style.display !== 'none' &&
                !veiculo.imagens.some((img) => img.tipo === tipo.toLowerCase())
            ) {
                veiculo.imagens.push({
                    tipo: tipo.toLowerCase(),
                    src: preview.src,
                });
            }
        }

        // Salvar horários disponíveis
        if (veiculo.periodoDisponibilidade === 'parcial') {
            veiculo.horariosDisponiveis = [];
            document
                .querySelectorAll('#horariosAdicionados .horario-item')
                .forEach((item) => {
                    veiculo.horariosDisponiveis.push({
                        periodo: item.querySelector('.periodo-select').value,
                        inicio: item.querySelector('.inicio-time').value,
                        fim: item.querySelector('.fim-time').value,
                    });
                });
        }

        // Salvar o veículo
        salvarVeiculoNoStorage(veiculo);
    };

    processarRascunho();
}

function converterParaBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

function salvarVeiculoNoStorage(veiculo) {
    let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const rascunhoId = document.getElementById('formCadastroVeiculo').dataset
        .rascunhoId;

    if (rascunhoId) {
        // Atualizar rascunho existente
        const index = veiculos.findIndex((v) => v.id === rascunhoId);
        if (index !== -1) {
            veiculos[index] = veiculo;
        }
    } else {
        // Adicionar novo rascunho
        veiculos.push(veiculo);
    }

    localStorage.setItem('veiculos', JSON.stringify(veiculos));
    showNotification(
        'Rascunho salvo com sucesso! Você pode continuar depois.',
        'success'
    );
    fecharCadastroVeiculo();
    listarVeiculos();
}

function formatarCEP(cep) {
    if (typeof cep !== 'string') {
        cep = String(cep); // Converte para string se não for
    }
    cep = cep.replace(/\D/g, '');
    if (cep.length > 5) {
        cep = cep.substring(0, 5) + '-' + cep.substring(5, 8);
    }
    return cep;
}

function coletarDadosVeiculo() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const tipoVeiculo = document.getElementById('tipoVeiculo').value;
    const subtipoVeiculo = document.getElementById('subtipoVeiculo').value;

    // Verificar se há um modelo personalizado
    let modeloVeiculo = document.getElementById('modeloVeiculo').value;
    let modeloCustom = '';

    if (modeloVeiculo === 'outro') {
        const modeloCustomInput = document.getElementById('modeloCustom');
        if (modeloCustomInput && modeloCustomInput.value.trim() !== '') {
            modeloCustom = modeloCustomInput.value.trim();
        }
    }

    // Coleta os métodos de cobrança
    const metodosCobranca = [];
    document
        .querySelectorAll('input[name="metodoCobranca"]:checked')
        .forEach((checkbox) => {
            const priceInput = checkbox
                .closest('label')
                .querySelector('.price-input');
            metodosCobranca.push({
                tipo: checkbox.value,
                valor: priceInput.value,
            });
        });

    // Coleta os dias da semana
    const diasSemana = [];
    document
        .querySelectorAll('input[name="diasSemana"]:checked')
        .forEach((checkbox) => {
            diasSemana.push(checkbox.value);
        });

    // Cria o objeto do veículo
    const veiculo = {
        id:
            document.getElementById('formCadastroVeiculo').dataset.rascunhoId ||
            'veic_' +
                Date.now() +
                '_' +
                Math.random().toString(36).substr(2, 9),
        locadorId: usuarioLogado.id,
        tipo: tipoVeiculo,
        subtipo: subtipoVeiculo,
        marca: document.getElementById('marcaVeiculo').value,
        modelo: modeloVeiculo,
        modeloCustom: modeloCustom, // Armazena modelo personalizado se houver
        ano: document.getElementById('anoVeiculo').value,
        tipoCarroceria: document.getElementById('tipoCarroceria').value,
        especie: document.getElementById('especieVeiculo').value,
        passageiros:
            document.getElementById('quantidadePassageiros').value || null,
        capacidadeCarga:
            document.getElementById('capacidadeCarga').value || null,
        cep: document.getElementById('cepVeiculo').value,
        endereco: document.getElementById('enderecoVeiculo').value,
        metodosCobranca: metodosCobranca,
        diasDisponiveis: diasSemana,
        periodoDisponibilidade: document.getElementById(
            'periodoDisponibilidade'
        ).value,
        dataCadastro: new Date().toISOString(),
        ativo: true,
    };

    // Adiciona detalhes técnicos específicos
    if (subtipoVeiculo === 'combustao' || subtipoVeiculo === 'hibrido') {
        const combustiveis = [];
        document
            .querySelectorAll('input[name="combustivel"]:checked')
            .forEach((checkbox) => {
                combustiveis.push(checkbox.value);
            });

        veiculo.combustiveis = combustiveis;
        veiculo.preferenciaCombustivel = document.getElementById(
            'preferenciaCombustivel'
        ).value;
        veiculo.motorizacao = document.getElementById('motorizacao').value;
    }

    if (subtipoVeiculo === 'eletrico' || subtipoVeiculo === 'hibrido') {
        const tensoes = [];
        document
            .querySelectorAll('input[name="tensao"]:checked')
            .forEach((checkbox) => {
                tensoes.push(checkbox.value);
            });

        veiculo.tensoes = tensoes;
    }

    if (
        tipoVeiculo !== 'bicicleta' &&
        tipoVeiculo !== 'patinete' &&
        tipoVeiculo !== 'scooter'
    ) {
        veiculo.tipoCambio = document.getElementById('tipoCambio').value;
    }

    return veiculo;
}

// Função para buscar coordenadas usando Nominatim com timeout aumentado
async function buscarCoordenadasNoNominatim(query) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // Aumentei timeout

        // Se for CEP, tenta expandir para endereço completo
        if (/^\d{5}-?\d{3}$/.test(query)) {
            const cepData = await buscarEnderecoPorCEP(query);
            if (cepData) {
                // Constrói query mais específica usando cidade e estado
                query = `${cepData.localidade}, ${cepData.uf}, Brasil`;
            }
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
        )}&limit=1&addressdetails=1`;

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'LoCarApp/1.0 (contato@locar.com)',
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
                endereco: data[0].display_name,
            };
        }

        return null;
    } catch (error) {
        console.error('Erro ao buscar no Nominatim:', error);
        return null;
    }
}

document
    .getElementById('cepVeiculo')
    .addEventListener('blur', async function () {
        const cep = this.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        const data = await buscarEnderecoPorCEP(cep);
        if (data) {
            let endereco = '';
            if (data.logradouro) endereco += data.logradouro;
            if (data.bairro) endereco += (endereco ? ', ' : '') + data.bairro;
            if (data.localidade)
                endereco += (endereco ? ', ' : '') + data.localidade;
            if (data.uf) endereco += (endereco ? ' - ' : '') + data.uf;

            document.getElementById('enderecoVeiculo').value = endereco;

            // Busca coordenadas automaticamente
            const coords = await buscarCoordenadasNoNominatim(cep);
            if (coords) {
                // Pode armazenar as coordenadas em campos ocultos se necessário
                console.log('Coordenadas encontradas:', coords);
            }
        }
    });

const processarVeiculo = async () => {
    try {
        // Crie o objeto "veiculo" com os dados do formulário
        let veiculo = coletarDadosVeiculo(); // ou, se preferir, iniciar com um objeto vazio: let veiculo = {};

        // Processar documento
        const docInput = document.getElementById('documentoVeiculo');
        if (docInput && docInput.files && docInput.files[0]) {
            veiculo.documento = {
                nome: docInput.files[0].name,
                src: await converterParaBase64(docInput.files[0]),
            };
        } else {
            // Se já houver um documento salvo:
            const docBase64 = document.getElementById('documentoBase64');
            if (docBase64) {
                veiculo.documento = {
                    nome: 'Documento salvo anteriormente',
                    src: docBase64.value,
                };
            }
        }

        // Por esta versão simplificada:
        veiculo.imagens = [];
        const tiposImagem = [
            'Frontal',
            'LateralDireita',
            'LateralEsquerda',
            'Traseira',
            'Interior',
        ];
        for (const tipo of tiposImagem) {
            const input = document.getElementById(`imagem${tipo}`);
            if (input && input.files && input.files[0]) {
                const base64 = await converterParaBase64(input.files[0]);
                veiculo.imagens.push(base64); // Armazena apenas a string base64
            } else {
                const preview = document.getElementById(`preview${tipo}`);
                if (
                    preview &&
                    preview.style.display !== 'none' &&
                    preview.src
                ) {
                    veiculo.imagens.push(preview.src); // Armazena diretamente a URL
                }
            }
        }

        // Obter as coordenadas a partir do endereço
        // (Exemplo: adiciona ", Brasil" caso não esteja incluso)
        // Na função processarVeiculo, substitua a parte de coordenadas por:
        const cep = document.getElementById('cepVeiculo').value;
        if (cep) {
            const coords = await buscarCoordenadasNoNominatim(cep);
            if (coords) {
                veiculo.latitude = coords.latitude;
                veiculo.longitude = coords.longitude;
                veiculo.enderecoCompleto = coords.endereco; // Armazena o endereço formatado
            } else {
                console.warn(
                    'Não foi possível obter coordenadas para o CEP:',
                    cep
                );
                // Tenta com o endereço manual como fallback
                const enderecoManual =
                    document.getElementById('enderecoVeiculo').value;
                if (enderecoManual) {
                    const coordsManual = await buscarCoordenadasNoNominatim(
                        enderecoManual + ', Brasil'
                    );
                    if (coordsManual) {
                        veiculo.latitude = coordsManual.latitude;
                        veiculo.longitude = coordsManual.longitude;
                        veiculo.enderecoCompleto = coordsManual.endereco;
                    }
                }
            }
        }

        // Salvar o veículo (atualizando se estiver em modo edição ou adicionando novo)
        let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
        if (modoEdicao) {
            const index = veiculos.findIndex((v) => v.id === veiculo.id);
            if (index !== -1) {
                veiculos[index] = veiculo;
            }
        } else {
            veiculos.push(veiculo);
        }
        localStorage.setItem('veiculos', JSON.stringify(veiculos));

        showNotification(
            modoEdicao
                ? 'Veículo atualizado com sucesso!'
                : 'Veículo cadastrado com sucesso!',
            'success'
        );
        fecharCadastroVeiculo();
        listarVeiculos();
    } catch (error) {
        console.error('Erro ao processar veículo:', error);
        showNotification('Erro ao salvar veículo. Tente novamente.', 'error');
    }
};

// Adicione esta função para validar o formulário corretamente
function validarFormulario() {
    const form = document.getElementById('formCadastroVeiculo');
    if (!form) {
        console.error('Formulário não encontrado');
        return false;
    }

    const requiredInputs = form.querySelectorAll('[required]');
    let valid = true;

    requiredInputs.forEach((input) => {
        // Verificar se é um input de arquivo com arquivo existente
        if (input.type === 'file') {
            const existenteEl = document.getElementById(`${input.id}Existente`);
            if (existenteEl && existenteEl.value === 'true') {
                // Arquivo já existe, não precisa validar
                return;
            }
        }

        if (!input.value) {
            valid = false;
            input.classList.add('input-invalid');
        } else {
            input.classList.remove('input-invalid');
        }
    });

    return valid;
}

// Funções para veículos
function obterImagemTipoVeiculo(tipo) {
    const svgs = {
        carro: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="50" width="60" height="30" fill="#2563eb"/><rect x="25" y="30" width="50" height="20" fill="#38bdf8"/><circle cx="35" cy="80" r="10" fill="#333"/><circle cx="65" cy="80" r="10" fill="#333"/></svg>`,
        moto: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M30,60 L40,40 L60,40 L70,60" stroke="#333" fill="none" stroke-width="3"/><circle cx="40" cy="70" r="10" fill="#333"/><circle cx="60" cy="70" r="10" fill="#333"/></svg>`,
        bicicleta: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="30" cy="70" r="15" fill="none" stroke="#333" stroke-width="3"/><circle cx="70" cy="70" r="15" fill="none" stroke="#333" stroke-width="3"/><path d="M30,70 L50,40 L70,70" stroke="#333" fill="none" stroke-width="3"/></svg>`,
        patinete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="30" y="40" width="40" height="10" fill="#333"/><rect x="50" y="50" width="5" height="30" fill="#333"/><circle cx="40" cy="80" r="5" fill="#333"/></svg>`,
        van: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="15" y="50" width="70" height="30" fill="#2563eb"/><rect x="20" y="35" width="60" height="15" fill="#38bdf8"/><circle cx="30" cy="80" r="8" fill="#333"/><circle cx="70" cy="80" r="8" fill="#333"/></svg>`,
        scooter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="30" y="40" width="40" height="10" fill="#333"/><rect x="50" y="50" width="5" height="30" fill="#333"/><circle cx="40" cy="80" r="7" fill="#333"/><circle cx="60" cy="80" r="7" fill="#333"/></svg>`,
        default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="50" width="60" height="30" fill="#666"/><circle cx="35" cy="80" r="10" fill="#333"/><circle cx="65" cy="80" r="10" fill="#333"/></svg>`,
    };

    return `data:image/svg+xml;utf8,${encodeURIComponent(
        svgs[tipo] || svgs.default
    )}`;
}

function formatarTipoVeiculo(tipo) {
    const tipos = {
        carro: 'Carro',
        moto: 'Moto',
        van: 'Van',
        bicicleta: 'Bicicleta',
        patinete: 'Patinete',
        scooter: 'Scooter',
    };
    return tipos[tipo] || tipo;
}

function formatarMetodoCobranca(tipo) {
    const metodos = {
        minutagem: 'Por Minuto',
        hora: 'Por Hora',
        diaria: 'Diária',
        semanal: 'Semanal',
        mensal: 'Mensal',
        bimestral: 'Bimestral',
        trimestral: 'Trimestral',
        anual: 'Anual',
    };
    return metodos[tipo] || tipo;
}

function formatarDiaSemana(dia) {
    const dias = {
        segunda: 'Segunda',
        terca: 'Terça',
        quarta: 'Quarta',
        quinta: 'Quinta',
        sexta: 'Sexta',
        sabado: 'Sábado',
        domingo: 'Domingo',
    };
    return dias[dia] || dia;
}

function formatarTipoImagem(tipo) {
    // Se tipo for undefined, null ou string vazia, retorna o padrão
    if (!tipo) return 'Imagem Padrão';

    const tipos = {
        frontal: 'Frontal',
        lateraldireita: 'Lateral Direita',
        lateralesquerda: 'Lateral Esquerda',
        traseira: 'Traseira',
        interior: 'Interior',
        padrao: 'Imagem Padrão',
    };

    // Converte para string e depois para minúsculas
    return tipos[String(tipo).toLowerCase()] || tipo;
}

function listarVeiculos() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const listaVeiculos = document.getElementById('listaVeiculos');

    if (!usuarioLogado) return;

    listaVeiculos.innerHTML = '';

    // Log para depuração
    if (veiculos.length > 0) {
        console.log('Estrutura do primeiro veículo:', veiculos[0]);
    }

    // Obter todos os veículos do usuário, incluindo rascunhos
    const veiculosLocador = veiculos.filter(
        (v) => v.locadorId === usuarioLogado.id
    );

    if (veiculosLocador.length === 0) {
        listaVeiculos.innerHTML = '<p>Você ainda não cadastrou veículos.</p>';
        return;
    }

    // Função auxiliar para obter URL da imagem com segurança
    function getImageUrl(imagens) {
        if (!imagens || imagens.length === 0) return null;

        const primeiraImagem = imagens[0];

        // Verifica diferentes formatos possíveis
        if (typeof primeiraImagem === 'string') {
            return primeiraImagem; // URL direta
        } else if (primeiraImagem.src) {
            return primeiraImagem.src; // Objeto com propriedade src
        } else if (primeiraImagem.url) {
            return primeiraImagem.url; // Objeto com propriedade url
        } else if (primeiraImagem.caminho) {
            return primeiraImagem.caminho; // Objeto com propriedade caminho
        }

        return null;
    }

    // Primeiro exibir os rascunhos
    const rascunhos = veiculosLocador.filter((v) => v.status === 'rascunho');
    if (rascunhos.length > 0) {
        rascunhos.forEach((veiculo) => {
            const card = document.createElement('div');
            card.className = 'veiculo-card';
            card.dataset.id = veiculo.id;

            // Usar imagem padrão ou a primeira imagem disponível
            const imagemUrl = getImageUrl(veiculo.imagens);
            const imagemPadrao = obterImagemTipoVeiculo(
                veiculo.tipo || 'default'
            );
            const imagemPrincipal = imagemUrl || imagemPadrao;

            card.innerHTML = `
                <div class="card-imagem">
                    <img src="${imagemPrincipal}" alt="Veículo em rascunho" onerror="this.src='${imagemPadrao}'"/>
                </div>
                <div class="card-info">
                    <h3>${veiculo.marca || 'Nova'} ${
                veiculo.modelo || 'Veículo'
            }</h3>
                    <p><strong>Status:</strong> <span style="color: orange;">Cadastro Pendente</span></p>
                    <p><small>Última atualização: ${new Date(
                        veiculo.dataAtualizacao || veiculo.dataCadastro
                    ).toLocaleDateString()}</small></p>
                    <div class="botoes-acoes">
                        <button class="btn btn-primary btn-continuar">
                            <i class="fas fa-edit"></i> Continuar Cadastro
                        </button>
                        <button class="btn btn-danger btn-excluir-rascunho">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
            `;

            listaVeiculos.appendChild(card);

            // Adicionar event listeners
            card.querySelector('.btn-continuar').addEventListener(
                'click',
                function () {
                    editarVeiculo(veiculo.id);
                }
            );

            card.querySelector('.btn-excluir-rascunho').addEventListener(
                'click',
                function () {
                    excluirVeiculo(veiculo.id);
                }
            );
        });
    }

    // Em seguida exibir os veículos ativos
    const veiculosAtivos = veiculosLocador.filter(
        (v) => v.status !== 'rascunho'
    );

    veiculosAtivos.forEach((veiculo) => {
        const card = document.createElement('div');
        card.className = 'veiculo-card';
        card.dataset.id = veiculo.id; // Armazena o ID como atributo data

        // Log das imagens para este veículo
        console.log(`Veículo ${veiculo.id} - imagens:`, veiculo.imagens);

        // Prepara a imagem principal com melhor tratamento de erros
        const imagemUrl = getImageUrl(veiculo.imagens);
        const imagemPadrao = obterImagemTipoVeiculo(veiculo.tipo || 'default');
        const imagemPrincipal = imagemUrl || imagemPadrao;

        card.innerHTML = `
            <div class="card-imagem">
                <img src="${imagemPrincipal}" alt="${
            veiculo.tipo
        }" onerror="this.src='${imagemPadrao}'"/>
                ${
                    veiculo.imagens && veiculo.imagens.length > 1
                        ? `<small>+${
                              veiculo.imagens.length - 1
                          } imagens</small>`
                        : ''
                }
            </div>
            <div class="card-info">
                <h3>${veiculo.marca} ${
            veiculo.modelo === 'outro' ? veiculo.modeloCustom : veiculo.modelo
        }</h3>
                <p><strong>Ano:</strong> ${veiculo.ano}</p>
                <p><strong>Tipo:</strong> ${formatarTipoVeiculo(
                    veiculo.tipo
                )}</p>
                <p><strong>Status:</strong> ${
                    veiculo.ativo
                        ? '<span class="status-ativo">Ativo</span>'
                        : '<span class="status-pausado">Pausado</span>'
                }
                </p>

                <div class="botoes-acoes">
                    <button class="btn btn-info btn-detalhes">
                        <i class="fas fa-eye"></i> Detalhes
                    </button>
                    <button class="btn btn-primary btn-editar">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-secondary btn-disponibilidade">
                        <i class="fas fa-calendar-alt"></i> Disponibilidade
                    </button>
                    <button class="btn btn-accent btn-reajuste">
                        <i class="fas fa-percentage"></i> Reajustar
                    </button>
                    <button class="btn btn-danger btn-excluir">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `;

        listaVeiculos.appendChild(card);

        // Adiciona os event listeners APÓS adicionar ao DOM
        card.querySelector('.card-imagem img').addEventListener(
            'click',
            function () {
                abrirVisualizador(veiculo.id);
            }
        );

        card.querySelector('.btn-detalhes').addEventListener(
            'click',
            function () {
                visualizarDadosVeiculo(veiculo.id);
            }
        );

        card.querySelector('.btn-editar').addEventListener(
            'click',
            function () {
                editarVeiculo(veiculo.id);
            }
        );

        card.querySelector('.btn-disponibilidade').addEventListener(
            'click',
            function () {
                gerenciarDisponibilidade(veiculo.id);
            }
        );

        card.querySelector('.btn-reajuste').addEventListener(
            'click',
            function () {
                mostrarModalReajuste(veiculo.id);
            }
        );

        card.querySelector('.btn-excluir').addEventListener(
            'click',
            function () {
                excluirVeiculo(veiculo.id);
            }
        );
    });
}

// Função de apoio para obter SVG com base no tipo de veículo
function getVehicleTypeSVG(tipo) {
    const svgs = {
        carro: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="50" width="60" height="30" fill="#2563eb"/><rect x="25" y="30" width="50" height="20" fill="#38bdf8"/><circle cx="35" cy="80" r="10" fill="#333"/><circle cx="65" cy="80" r="10" fill="#333"/></svg>',
        moto: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M30,60 L40,40 L60,40 L70,60" stroke="#333" fill="none" stroke-width="3"/><circle cx="40" cy="70" r="10" fill="#333"/><circle cx="60" cy="70" r="10" fill="#333"/></svg>',
    };

    return encodeURIComponent(svgs[tipo] || svgs.carro);
}

function editarVeiculo(veiculoId) {
    // Cria campo de ID do veículo se ele não existir
    let veiculoIdField = document.getElementById('veiculoId');
    if (!veiculoIdField) {
        veiculoIdField = document.createElement('input');
        veiculoIdField.type = 'hidden';
        veiculoIdField.id = 'veiculoId';
        const form = document.getElementById('formCadastroVeiculo');
        if (form) {
            form.appendChild(veiculoIdField);
        } else {
            console.warn(
                'Formulário do veículo não encontrado, não é possível adicionar o campo ID'
            );
        }
    }

    // Em seguida, defina seu valor
    if (veiculoIdField) {
        veiculoIdField.value = veiculoId;
    }

    // Restante da função...
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculo = veiculos.find((v) => v.id === veiculoId);

    if (!veiculo) {
        showNotification('Veículo não encontrado', 'error');
        return;
    }

    // Inicia o cadastro em modo de edição e preenche o formulário
    iniciarCadastroVeiculo(true);
    document.getElementById('formCadastroVeiculo').dataset.rascunhoId =
        veiculo.id;
    preencherFormularioComRascunho(veiculo);

    // Fix for attachments - ADD NULL CHECK HERE
    const attachmentPreviewContainer =
        document.getElementById('attachmentPreview');
    if (attachmentPreviewContainer) {
        // Add this null check
        attachmentPreviewContainer.innerHTML = ''; // Clear previous previews

        if (veiculo.anexos && veiculo.anexos.length > 0) {
            veiculo.anexos.forEach((anexo, index) => {
                const previewDiv = document.createElement('div');
                previewDiv.className = 'attachment-preview';

                if (anexo.tipo.startsWith('image/')) {
                    previewDiv.innerHTML = `
                            <img src="${anexo.dados}" alt="Anexo ${index + 1}">
                            <button type="button" class="remove-attachment" onclick="removerAnexoExistente(${index})">
                                <i class="fas fa-times"></i>
                            </button>`;
                } else {
                    previewDiv.innerHTML = `
                            <div class="file-icon"><i class="fas fa-file"></i></div>
                            <span>${anexo.nome || 'Anexo ' + (index + 1)}</span>
                            <button type="button" class="remove-attachment" onclick="removerAnexoExistente(${index})">
                                <i class="fas fa-times"></i>
                            </button>`;
                }

                attachmentPreviewContainer.appendChild(previewDiv);
            });

            // Store original attachments in a hidden input or data attribute
            const veiculoForm = document.getElementById('veiculoForm');
            if (veiculoForm) {
                veiculoForm.dataset.originalAnexos = JSON.stringify(
                    veiculo.anexos
                );
            }
        }
    }

    // Add this function to handle removing existing attachments
    window.removerAnexoExistente = function (index) {
        const veiculoForm = document.getElementById('veiculoForm');
        if (!veiculoForm) return;

        const originalAnexos = JSON.parse(
            veiculoForm.dataset.originalAnexos || '[]'
        );
        originalAnexos.splice(index, 1);
        veiculoForm.dataset.originalAnexos = JSON.stringify(originalAnexos);

        // Update UI
        const previews = document.querySelectorAll(
            '#attachmentPreview .attachment-preview'
        );
        if (previews[index]) {
            previews[index].remove();
        }
    };

    // Safely check these elements too
    const veiculoFormContainer = document.getElementById(
        'veiculoFormContainer'
    );
    if (veiculoFormContainer) {
        veiculoFormContainer.style.display = 'block';
    }

    const veiculoListContainer = document.getElementById(
        'veiculoListContainer'
    );
    if (veiculoListContainer) {
        veiculoListContainer.style.display = 'none';
    }
}

function excluirVeiculo(id) {
    Swal.fire({
        title: 'Confirmar exclusão',
        text: 'Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
    }).then((result) => {
        if (result.isConfirmed) {
            let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
            veiculos = veiculos.filter((v) => v.id !== id);
            localStorage.setItem('veiculos', JSON.stringify(veiculos));

            // Fechar todos os modais abertos
            fecharModalDetalhes();
            fecharModalDisponibilidade();
            fecharModalReajuste();
            fecharModalCalendario();
            fecharCadastroVeiculo();

            showNotification('Veículo excluído com sucesso!', 'success');
            listarVeiculos();
        }
    });
}

// Funções de visualização de veículo
function visualizarDadosVeiculo(veiculoId) {
    console.log('Visualizando dados do veículo:', veiculoId);
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculo = veiculos.find((v) => v.id === veiculoId);

    if (!veiculo) return;

    // Prepara HTML para datas indisponíveis se existirem
    let datasIndisponiveisHTML = '';
    if (veiculo.datasIndisponiveis && veiculo.datasIndisponiveis.length > 0) {
        datasIndisponiveisHTML = `
                                    <div class="datas-selecionadas" style="margin-top: 15px;">
                                        <h3>Datas Indisponíveis</h3>
                                        <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                                            ${veiculo.datasIndisponiveis
                                                .map((dataStr) => {
                                                    const data = new Date(
                                                        dataStr
                                                    );
                                                    return `<div class="data-indisponivel">${data.toLocaleDateString(
                                                        'pt-BR'
                                                    )}</div>`;
                                                })
                                                .join('')}
                                        </div>
                                    </div>
                                `;
    }

    // Adicionar HTML para horários disponíveis se existirem
    let horariosDisponiveisHTML = '';
    if (
        veiculo.periodoDisponibilidade === 'parcial' &&
        veiculo.horariosDisponiveis &&
        veiculo.horariosDisponiveis.length > 0
    ) {
        horariosDisponiveisHTML = `
                    <div class="datas-selecionadas" style="margin-top: 15px;">
                        <h3>Horários Disponíveis</h3>
                        <div>
                            ${veiculo.horariosDisponiveis
                                .map(
                                    (horario) => `
                                <p>${formatarPeriodo(horario.periodo)}: ${
                                        horario.inicio
                                    } às ${horario.fim}</p>
                            `
                                )
                                .join('')}
                        </div>
                    </div>
                `;
    }

    // Helper function to format period names
    function formatarPeriodo(periodo) {
        const periodos = {
            manha: 'Manhã',
            tarde: 'Tarde',
            noite: 'Noite',
            madrugada: 'Madrugada',
        };
        return periodos[periodo] || periodo;
    }

    // Cria o modal de visualização
    const modalHTML = `
                                <div class="modal-veiculo-detalhes" id="detalheVeiculoModal">
                                    <div class="modal-content">
                                        <span class="close" onclick="fecharModalDetalhes()">&times;</span>
                                        <h2>${veiculo.marca} ${
        veiculo.modelo === 'outro' ? veiculo.modeloCustom : veiculo.modelo
    } - ${veiculo.ano}</h2>

                                        <div class="detalhes-container">
                                            <div class="detalhes-coluna">
                                                <h3>Informações Básicas</h3>
                                                <p><strong>Tipo:</strong> ${formatarTipoVeiculo(
                                                    veiculo.tipo
                                                )}</p>
                                                <p><strong>Subtipo:</strong> ${
                                                    veiculo.subtipo
                                                }</p>
                                                <p><strong>Carroceria:</strong> ${
                                                    veiculo.tipoCarroceria
                                                }</p>
                                                <p><strong>Espécie:</strong> ${
                                                    veiculo.especie
                                                }</p>
                                                ${
                                                    veiculo.passageiros
                                                        ? `<p><strong>Passageiros:</strong> ${veiculo.passageiros}</p>`
                                                        : ''
                                                }
                                                ${
                                                    veiculo.capacidadeCarga
                                                        ? `<p><strong>Capacidade de Carga:</strong> ${veiculo.capacidadeCarga} kg</p>`
                                                        : ''
                                                }
                                            </div>

                                            <div class="detalhes-coluna">
                                                <h3>Localização</h3>
                                                <p><strong>CEP:</strong> ${
                                                    veiculo.cep
                                                }</p>
                                                <p><strong>Endereço:</strong> ${
                                                    veiculo.endereco
                                                }</p>

                                                <h3>Disponibilidade</h3>
                                                <p><strong>Dias:</strong> ${
                                                    veiculo.diasDisponiveis
                                                        ?.map((dia) =>
                                                            formatarDiaSemana(
                                                                dia
                                                            )
                                                        )
                                                        .join(', ') ||
                                                    'Não definido'
                                                }</p>
                                                <p><strong>Período:</strong> ${
                                                    veiculo.periodoDisponibilidade ===
                                                    'integral'
                                                        ? 'Integral (24h)'
                                                        : 'Parcial'
                                                }</p>
                                                ${datasIndisponiveisHTML}
                                            </div>

                                            <div class="detalhes-coluna">
                                                <h3>Métodos de Cobrança</h3>
                                                ${
                                                    veiculo.metodosCobranca
                                                        ?.map(
                                                            (m) => `
                                                    <p><strong>${formatarMetodoCobranca(
                                                        m.tipo
                                                    )}:</strong> ${m.valor}</p>
                                                `
                                                        )
                                                        .join('') ||
                                                    'Nenhum método definido'
                                                }
                                            </div>
                                        </div>

                                        <div class="botoes-acoes">
                                            <button onclick="editarVeiculo('${
                                                veiculo.id
                                            }')" class="btn btn-primary">
                                                <i class="fas fa-edit"></i> Editar
                                            </button>
                                            <button onclick="alternarStatusVeiculo('${
                                                veiculo.id
                                            }')" class="btn btn-secondary">
                                                <i class="fas fa-pause"></i> ${
                                                    veiculo.ativo
                                                        ? 'Pausar'
                                                        : 'Ativar'
                                                }
                                            </button>
                                            <button onclick="excluirVeiculo('${
                                                veiculo.id
                                            }')" class="btn btn-danger">
                                                <i class="fas fa-trash"></i> Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mostrar o modal após criá-lo
    document.getElementById('detalheVeiculoModal').style.display = 'block';
}

function fecharModalDetalhes() {
    const modal = document.querySelector('.modal-veiculo-detalhes');
    if (modal) modal.remove();
}

function alternarStatusVeiculo(id) {
    let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const index = veiculos.findIndex((v) => v.id === id);

    if (index !== -1) {
        veiculos[index].ativo = !veiculos[index].ativo;
        localStorage.setItem('veiculos', JSON.stringify(veiculos));

        showNotification(
            `Veículo ${
                veiculos[index].ativo ? 'ativado' : 'pausado'
            } com sucesso!`,
            'success'
        );
        listarVeiculos();

        // Fechar modal se aberto
        fecharModalDetalhes();
    }
}

// Funções de disponibilidade
function gerenciarDisponibilidade(veiculoId) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculo = veiculos.find((v) => v.id === veiculoId);

    if (!veiculo) return;

    // Prepara HTML para datas indisponíveis se existirem
    let datasIndisponiveisHTML = '';
    if (veiculo.datasIndisponiveis && veiculo.datasIndisponiveis.length > 0) {
        datasIndisponiveisHTML = `
                                    <div class="form-group">
                                        <h3>Datas Indisponíveis</h3>
                                        <div class="datas-selecionadas">
                                            ${veiculo.datasIndisponiveis
                                                .map((dataStr) => {
                                                    const data = new Date(
                                                        dataStr
                                                    );
                                                    return `<div class="data-indisponivel">${data.toLocaleDateString(
                                                        'pt-BR'
                                                    )}</div>`;
                                                })
                                                .join('')}
                                        </div>
                                    </div>
                                `;
    } else {
        datasIndisponiveisHTML = `
                                    <div class="form-group">
                                        <h3>Datas Indisponíveis</h3>
                                        <p>Nenhuma data indisponível selecionada</p>
                                    </div>
                                `;
    }

    // Cria o modal de gerenciamento
    const modalHTML = `
                                <div class="modal-disponibilidade" id="dispModal">
                                    <div class="modal-content">
                                        <span class="close" onclick="fecharModalDisponibilidade()">&times;</span>
                                        <h2>Gerenciar Disponibilidade</h2>

                                        <div class="toggle-container">
                                            <label>Status do Veículo:</label>
                                            <label class="switch">
                                                <input type="checkbox" id="toggleAtivo" ${
                                                    veiculo.ativo
                                                        ? 'checked'
                                                        : ''
                                                }>
                                                <span class="slider round"></span>
                                            </label>
                                            <span>${
                                                veiculo.ativo
                                                    ? 'Ativo'
                                                    : 'Pausado'
                                            }</span>
                                        </div>

                                        <div class="form-group">
                                            <label for="periodoDisponibilidade">Período de Disponibilidade:</label>
                                            <select id="periodoDisponibilidade" class="form-control" onchange="toggleHorariosContainer()">
                                                <option value="integral" ${
                                                    veiculo.periodoDisponibilidade ===
                                                    'integral'
                                                        ? 'selected'
                                                        : ''
                                                }>Integral (24h)</option>
                                                <option value="parcial" ${
                                                    veiculo.periodoDisponibilidade ===
                                                    'parcial'
                                                        ? 'selected'
                                                        : ''
                                                }>Parcial (Horários específicos)</option>
                                            </select>
                                        </div>

                                        <div id="horariosDisponibilidadeContainer" style="${
                                            veiculo.periodoDisponibilidade ===
                                            'integral'
                                                ? 'display: none;'
                                                : ''
                                        }">
                                            <h3>Horários Disponíveis</h3>
                                            <div id="horariosDisponibilidadeAdicionados">
                                                ${
                                                    veiculo.horariosDisponiveis
                                                        ?.map(
                                                            (horario) => `
                                                    <div class="horario-item">
                                                        <select class="periodo-select" onchange="ajustarHorarios(this)">
                                                            <option value="manha" ${
                                                                horario.periodo ===
                                                                'manha'
                                                                    ? 'selected'
                                                                    : ''
                                                            }>Manhã (06h-12h)</option>
                                                            <option value="tarde" ${
                                                                horario.periodo ===
                                                                'tarde'
                                                                    ? 'selected'
                                                                    : ''
                                                            }>Tarde (13h-18h)</option>
                                                            <option value="noite" ${
                                                                horario.periodo ===
                                                                'noite'
                                                                    ? 'selected'
                                                                    : ''
                                                            }>Noite (19h-23h)</option>
                                                            <option value="madrugada" ${
                                                                horario.periodo ===
                                                                'madrugada'
                                                                    ? 'selected'
                                                                    : ''
                                                            }>Madrugada (00h-05h)</option>
                                                        </select>
                                                        <input type="time" class="inicio-time" value="${
                                                            horario.inicio
                                                        }">
                                                        <span>às</span>
                                                        <input type="time" class="fim-time" value="${
                                                            horario.fim
                                                        }">
                                                        <button type="button" class="btn btn-danger" onclick="removerHorario(this)">
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                `
                                                        )
                                                        .join('') ||
                                                    '<p>Nenhum horário definido</p>'
                                                }
                                            </div>
                                            <button type="button" class="btn btn-accent" onclick="adicionarHorarioDisponibilidade()">
                                                <i class="fas fa-plus"></i> Adicionar Horário
                                            </button>
                                        </div>

                                        <div class="form-group">
                                            <h3>Dias da Semana Disponíveis</h3>
                                            <div class="dias-semana-container">
                                                ${[
                                                    'segunda',
                                                    'terca',
                                                    'quarta',
                                                    'quinta',
                                                    'sexta',
                                                    'sabado',
                                                    'domingo',
                                                ]
                                                    .map(
                                                        (dia) => `
                                                    <label class="checkbox-container">
                                                        <input type="checkbox" name="diasSemanaDisp" value="${dia}"
                                                            ${
                                                                veiculo.diasDisponiveis?.includes(
                                                                    dia
                                                                )
                                                                    ? 'checked'
                                                                    : ''
                                                            }>
                                                        <span class="checkmark"></span>
                                                        ${formatarDiaSemana(
                                                            dia
                                                        )}
                                                    </label>
                                                `
                                                    )
                                                    .join('')}
                                            </div>
                                        </div>

                                        ${datasIndisponiveisHTML}

                                        <div class="form-group">
                                            <button type="button" class="btn btn-primary" onclick="mostrarCalendarioDisponibilidade('${
                                                veiculo.id
                                            }')">
                                                <i class="fas fa-calendar-alt"></i> Gerenciar Datas Específicas
                                            </button>
                                        </div>

                                        <div class="botoes-acoes">
                                            <button onclick="salvarDisponibilidade('${
                                                veiculo.id
                                            }')" class="btn btn-primary">
                                                <i class="fas fa-save"></i> Salvar
                                            </button>
                                            <button onclick="fecharModalDisponibilidade()" class="btn btn-secondary">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Após criar o modal, configure corretamente os horários
    document.getElementById('dispModal').style.display = 'block';

    // Configurar eventos
    document
        .getElementById('toggleAtivo')
        .addEventListener('change', function () {
            const statusText = this.parentElement.nextElementSibling;
            statusText.textContent = this.checked ? 'Ativo' : 'Pausado';
        });

    // Configurar o evento de mudança no select de período
    const periodoSelect = document.getElementById('periodoDisponibilidade');
    if (periodoSelect) {
        periodoSelect.addEventListener('change', toggleHorariosContainer);
        // Chamar uma vez para definir o estado inicial
        toggleHorariosContainer();
    }

    // Exibir horários existentes se houver
    // Add to the gerenciarDisponibilidade function after creating modal
    if (
        veiculo.periodoDisponibilidade === 'parcial' &&
        veiculo.horariosDisponiveis &&
        veiculo.horariosDisponiveis.length > 0
    ) {
        const horariosContainer = document.getElementById(
            'horariosDisponibilidadeAdicionados'
        );
        horariosContainer.innerHTML = ''; // Clear default content

        veiculo.horariosDisponiveis.forEach((horario) => {
            const div = document.createElement('div');
            div.className = 'horario-item';
            div.innerHTML = `
                    <select class="periodo-select" onchange="ajustarHorarios(this)">
                        <option value="manha" ${
                            horario.periodo === 'manha' ? 'selected' : ''
                        }>Manhã (06h-12h)</option>
                        <option value="tarde" ${
                            horario.periodo === 'tarde' ? 'selected' : ''
                        }>Tarde (13h-18h)</option>
                        <option value="noite" ${
                            horario.periodo === 'noite' ? 'selected' : ''
                        }>Noite (19h-23h)</option>
                        <option value="madrugada" ${
                            horario.periodo === 'madrugada' ? 'selected' : ''
                        }>Madrugada (00h-05h)</option>
                    </select>
                    <input type="time" class="inicio-time" value="${
                        horario.inicio
                    }">
                    <span>às</span>
                    <input type="time" class="fim-time" value="${horario.fim}">
                    <button type="button" class="btn btn-danger" onclick="removerHorario(this)">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            horariosContainer.appendChild(div);
            ajustarHorarios(div.querySelector('.periodo-select'));
        });
    }
}

function toggleHorariosContainer() {
    const periodoDisponibilidade = document.getElementById(
        'periodoDisponibilidade'
    );

    // Try availability modal container first, then fallback to registration form
    let horariosContainer = document.getElementById(
        'horariosDisponibilidadeContainer'
    );
    if (!horariosContainer) {
        horariosContainer = document.getElementById('horariosContainer');
    }

    if (!periodoDisponibilidade || !horariosContainer) {
        console.error('Elementos não encontrados para toggleHorariosContainer');
        return;
    }

    horariosContainer.style.display =
        periodoDisponibilidade.value === 'parcial' ? 'block' : 'none';
}

// Adicione isto para garantir que o evento seja configurado corretamente
document.addEventListener('DOMContentLoaded', function () {
    // Configurar event listener para o dropdown de período
    const periodoDisponibilidade = document.getElementById(
        'periodoDisponibilidade'
    );
    if (periodoDisponibilidade) {
        periodoDisponibilidade.addEventListener(
            'change',
            toggleHorariosContainer
        );
    }
});

// Garantir que eventos sejam limpos ao fechar modais
function fecharModalDisponibilidade() {
    const modal = document.querySelector('.modal-disponibilidade');
    if (modal) modal.remove();
    // Isso remove o modal e todos os event listeners associados
}

function adicionarHorarioDisponibilidade() {
    const container = document.getElementById(
        'horariosDisponibilidadeAdicionados'
    );

    // Remove o texto "Nenhum horário definido" se existir
    const nenhumHorario = container.querySelector('p');
    if (nenhumHorario) {
        nenhumHorario.remove();
    }

    const div = document.createElement('div');
    div.className = 'horario-item';
    div.innerHTML = `
                                <select class="periodo-select" onchange="ajustarHorarios(this)">
                                    <option value="manha">Manhã (06h-12h)</option>
                                    <option value="tarde">Tarde (13h-18h)</option>
                                    <option value="noite">Noite (19h-23h)</option>
                                    <option value="madrugada">Madrugada (00h-05h)</option>
                                </select>
                                <input type="time" class="inicio-time" min="06:00" max="12:00">
                                <span>às</span>
                                <input type="time" class="fim-time" min="06:00" max="12:00">
                                <button type="button" class="btn btn-danger" onclick="removerHorario(this)">
                                    <i class="fas fa-times"></i>
                                </button>
                            `;
    container.appendChild(div);
    ajustarHorarios(div.querySelector('.periodo-select'));
}

function fecharModalDisponibilidade() {
    const modal = document.querySelector('.modal-disponibilidade');
    if (modal) modal.remove();
}

function salvarDisponibilidade(veiculoId) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculoIndex = veiculos.findIndex((v) => v.id === veiculoId);

    if (veiculoIndex === -1) {
        showNotification('Veículo não encontrado', 'error');
        return;
    }

    const veiculo = veiculos[veiculoIndex];

    // Update status
    veiculo.ativo = document.getElementById('toggleAtivo').checked;

    // Update availability period
    veiculo.periodoDisponibilidade = document.getElementById(
        'periodoDisponibilidade'
    ).value;

    // Update days of week - THIS WAS MISSING
    veiculo.diasDisponiveis = [];
    document
        .querySelectorAll('input[name="diasSemanaDisp"]:checked')
        .forEach((checkbox) => {
            veiculo.diasDisponiveis.push(checkbox.value);
        });

    // Update available hours as before
    veiculo.horariosDisponiveis = [];

    if (veiculo.periodoDisponibilidade === 'parcial') {
        const horasItems = document.querySelectorAll(
            '#horariosDisponibilidadeAdicionados .horario-item'
        );

        if (horasItems.length > 0) {
            horasItems.forEach((item) => {
                const periodoSelect = item.querySelector('.periodo-select');
                const inicioInput = item.querySelector('.inicio-time');
                const fimInput = item.querySelector('.fim-time');

                if (periodoSelect && inicioInput && fimInput) {
                    veiculo.horariosDisponiveis.push({
                        periodo: periodoSelect.value,
                        inicio: inicioInput.value,
                        fim: fimInput.value,
                    });
                }
            });
        } else {
            // Default if none defined
            veiculo.horariosDisponiveis.push({
                periodo: 'manha',
                inicio: '08:00',
                fim: '12:00',
            });
        }
    }

    veiculos[veiculoIndex] = veiculo;
    localStorage.setItem('veiculos', JSON.stringify(veiculos));

    showNotification('Disponibilidade atualizada com sucesso!', 'success');
    fecharModalDisponibilidade();
    listarVeiculos();
}

// Funções para gerenciar calendário
function mostrarCalendarioDisponibilidade(veiculoId) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculo = veiculos.find((v) => v.id === veiculoId);

    if (!veiculo) return;

    // Prepara a lista de datas indisponíveis ou usa array vazio
    datasIndisponiveis = veiculo.datasIndisponiveis
        ? veiculo.datasIndisponiveis.map((data) => new Date(data))
        : [];

    // Cria a modal
    const modalHTML = `
                                <div class="modal-calendario" id="calModal">
                                    <div class="modal-content">
                                        <span class="close" onclick="fecharModalCalendario()">&times;</span>
                                        <h2>Datas Indisponíveis</h2>
                                        <p>Selecione as datas em que o veículo NÃO estará disponível para locação:</p>

                                        <div id="calendario-container">
                                            <div id="calendario" class="calendario-claro"></div>
                                        </div>

                                        <div class="datas-selecionadas">
                                            <h3>Datas indisponíveis selecionadas:</h3>
                                            <div id="lista-datas-indisponiveis"></div>
                                        </div>

                                        <div class="botoes-acoes">
                                            <button onclick="salvarDatasIndisponiveis('${veiculoId}')" class="btn btn-primary">
                                                <i class="fas fa-save"></i> Salvar
                                            </button>
                                            <button onclick="fecharModalCalendario()" class="btn btn-secondary">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mostrar o modal após criá-lo
    document.getElementById('calModal').style.display = 'block';

    // Adicionar estilos para melhorar a visibilidade do calendário
    const style = document.createElement('style');
    style.textContent = `
                                .calendario-claro .flatpickr-calendar {
                                    background: #fff;
                                }
                                .calendario-claro .flatpickr-day {
                                    color: #333;
                                }
                                .calendario-claro .flatpickr-day.selected {
                                    background: #dc3545;
                                    border-color: #dc3545;
                                    color: white;
                                }
                                .calendario-claro .flatpickr-day.today {
                                    border-color: #007bff;
                                }
                                .calendario-claro .flatpickr-months .flatpickr-month {
                                    color: #333;
                                    fill: #333;
                                }
                                .calendario-claro .flatpickr-weekday {
                                    color: #333;
                                }
                                .calendario-claro .flatpickr-current-month .flatpickr-monthDropdown-months {
                                    color: #333;
                                }
                                .calendario-claro .flatpickr-current-month input.cur-year {
                                    color: #333;
                                }
                                .calendario-claro .arrowUp,
                                .calendario-claro .arrowDown {
                                    border-bottom-color: #333;
                                }
                                .calendario-claro .flatpickr-months .flatpickr-prev-month,
                                .calendario-claro .flatpickr-months .flatpickr-next-month {
                                    color: #333;
                                    fill: #333;
                                }
                            `;
    document.head.appendChild(style);

    // Inicializa o calendário com flatpickr
    setTimeout(() => {
        inicializarCalendario(datasIndisponiveis);
        atualizarListaDatasIndisponiveis(veiculoId);
    }, 100);
}

function inicializarCalendario(datas) {
    const calendario = document.getElementById('calendario');
    if (!calendario) return;

    // Converte as datas para formato de string aceito pelo flatpickr
    const datasFormatadas = datas.map((data) => {
        const d = new Date(data);
        return d.toISOString().split('T')[0];
    });

    // Inicializa o flatpickr
    calendarioInstance = flatpickr(calendario, {
        mode: 'multiple',
        dateFormat: 'd/m/Y',
        defaultDate: datasFormatadas,
        locale: 'pt',
        inline: true,
        onChange: function (selectedDates) {
            datasIndisponiveis = selectedDates;
            atualizarListaDatasIndisponiveis();
        },
    });
}

// Função para configurar propulsão
function configurarSelecaoPropulsao() {
    const tipoVeiculo = document.getElementById('tipoVeiculo');
    const tipoPropulsao = document.getElementById('subtipoVeiculo');

    if (!tipoVeiculo || !tipoPropulsao) return;

    // Salvar seleção atual
    const selecaoAtual = tipoPropulsao.value;

    // Limpar opções
    tipoPropulsao.innerHTML = '';

    // Definir opções por tipo
    let opcoes = [];

    switch (tipoVeiculo.value) {
        case 'carro':
        case 'utilitario':
        case 'van':
        case 'caminhao':
            opcoes = [
                {
                    valor: 'combustao',
                    texto: 'Motorizado a Combustão',
                },
                { valor: 'eletrico', texto: 'Motorizado Elétrico' },
                { valor: 'hibrido', texto: 'Motorizado Híbrido' },
            ];
            break;
        case 'moto':
        case 'triciclo':
            opcoes = [
                {
                    valor: 'combustao',
                    texto: 'Motorizado a Combustão',
                },
                { valor: 'eletrico', texto: 'Motorizado Elétrico' },
            ];
            break;
        case 'bicicleta':
        case 'patinete':
            opcoes = [
                { valor: 'humana', texto: 'Propulsão Humana' },
                { valor: 'eletrico', texto: 'Motorizado Elétrico' },
            ];
            break;
        default:
            opcoes = [
                {
                    valor: 'combustao',
                    texto: 'Motorizado a Combustão',
                },
                { valor: 'eletrico', texto: 'Motorizado Elétrico' },
                { valor: 'hibrido', texto: 'Motorizado Híbrido' },
                { valor: 'humana', texto: 'Propulsão Humana' },
                { valor: 'outro', texto: 'Outro' },
            ];
    }

    // Adicionar opções
    opcoes.forEach((opcao) => {
        const option = document.createElement('option');
        option.value = opcao.valor;
        option.textContent = opcao.texto;
        tipoPropulsao.appendChild(option);
    });

    // Restaurar seleção se possível
    if (selecaoAtual) {
        const existe = Array.from(tipoPropulsao.options).some(
            (opt) => opt.value === selecaoAtual
        );
        if (existe) tipoPropulsao.value = selecaoAtual;
    }

    // Atualizar campos dependentes da propulsão
    atualizarCamposCombustivel();
}

// Nova função para atualizar campos de combustível com base na propulsão
function atualizarCamposCombustivel() {
    const tipoPropulsao = document.getElementById('subtipoVeiculo');
    const campoCombustivel = document.getElementById('combustivelVeiculo');
    const campoPreferencial = document.getElementById(
        'combustivelPreferencial'
    );

    if (!tipoPropulsao) return;

    if (tipoPropulsao.value === 'eletrico') {
        // Desabilitar campos de combustível para veículos elétricos
        if (campoCombustivel) {
            campoCombustivel.value = '';
            campoCombustivel.disabled = true;
            campoCombustivel.parentElement.style.opacity = '0.5';
        }

        if (campoPreferencial) {
            campoPreferencial.value = '';
            campoPreferencial.disabled = true;
            campoPreferencial.parentElement.style.opacity = '0.5';
        }
    } else {
        // Habilitar campos de combustível para outros tipos de propulsão
        if (campoCombustivel) {
            campoCombustivel.disabled = false;
            campoCombustivel.parentElement.style.opacity = '1';
        }

        if (campoPreferencial) {
            campoPreferencial.disabled = false;
            campoPreferencial.parentElement.style.opacity = '1';
        }
    }
}

function atualizarListaDatasIndisponiveis() {
    const listaElement = document.getElementById('lista-datas-indisponiveis');
    if (!listaElement) return;

    listaElement.innerHTML = '';

    if (datasIndisponiveis.length === 0) {
        listaElement.innerHTML = '<p>Nenhuma data selecionada</p>';
        return;
    }

    datasIndisponiveis
        .sort((a, b) => a - b)
        .forEach((data, index) => {
            const dataFormatada = data.toLocaleDateString('pt-BR');
            const divData = document.createElement('div');
            divData.className = 'data-indisponivel';
            divData.innerHTML = `
                                    ${dataFormatada}
                                    <button class="btn-remover-data" onclick="removerDataIndisponivel(${index})">×</button>
                                `;
            listaElement.appendChild(divData);
        });
}

function removerDataIndisponivel(index) {
    if (index >= 0 && index < datasIndisponiveis.length) {
        datasIndisponiveis.splice(index, 1);

        // Atualiza o calendário
        if (calendarioInstance) {
            calendarioInstance.setDate(datasIndisponiveis);
        }

        // Atualiza a lista
        atualizarListaDatasIndisponiveis();
    }
}

function salvarDatasIndisponiveis(veiculoId) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const index = veiculos.findIndex((v) => v.id === veiculoId);

    if (index !== -1) {
        // Salva as datas como strings ISO
        veiculos[index].datasIndisponiveis = datasIndisponiveis.map((data) =>
            data.toISOString()
        );
        localStorage.setItem('veiculos', JSON.stringify(veiculos));

        showNotification('Datas indisponíveis salvas com sucesso!', 'success');
        fecharModalCalendario();

        // Atualizar a lista de veículos para refletir as mudanças
        listarVeiculos();
    }
}

function fecharModalCalendario() {
    const modal = document.querySelector('.modal-calendario');
    if (modal) modal.remove();

    // Limpa a instância do calendário
    if (calendarioInstance) {
        calendarioInstance.destroy();
        calendarioInstance = null;
    }
}

// Funções de reajuste
function mostrarModalReajuste(veiculoId) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculo = veiculos.find((v) => v.id === veiculoId);

    if (!veiculo) {
        showNotification('Veículo não encontrado', 'error');
        return;
    }

    // Verificar se existem métodos de cobrança configurados
    if (!veiculo.metodosCobranca || veiculo.metodosCobranca.length === 0) {
        showNotification(
            'Este veículo não possui métodos de cobrança definidos',
            'warning'
        );
        return;
    }

    // Preparar a exibição dinâmica dos métodos existentes
    let valoresAtuaisHTML = '';
    let valoresNovosHTML = '';

    veiculo.metodosCobranca.forEach((metodo) => {
        // Extrair valor numérico para cálculo
        let valorNumerico;
        if (typeof metodo.valor === 'string') {
            valorNumerico = parseFloat(
                metodo.valor.replace(/[^\d,.]/g, '').replace(',', '.')
            );
        } else {
            valorNumerico = parseFloat(metodo.valor);
        }

        if (isNaN(valorNumerico)) valorNumerico = 0;

        // Adicionar ao HTML de valores atuais
        valoresAtuaisHTML += `
                    <div class="valor-linha">
                        <span class="valor-nome">${formatarMetodoCobranca(
                            metodo.tipo
                        )}:</span>
                        <span class="valor-atual">${metodo.valor}</span>
                    </div>
                `;

        // Adicionar ao HTML de novos valores
        valoresNovosHTML += `
                    <div class="valor-linha">
                        <span class="valor-nome">${formatarMetodoCobranca(
                            metodo.tipo
                        )}:</span>
                        <span class="valor-ajustado" id="novo_${metodo.tipo}">${
            metodo.valor
        }</span>
                    </div>
                `;
    });

    const modalHTML = `
                <div class="modal-reajuste" id="reajModal">
                    <div class="modal-content">
                        <span class="close" onclick="fecharModalReajuste()">&times;</span>
                        <h2>Aplicar Reajuste</h2>

                        <div class="valores-atuais">
                            <h3>Valores Atuais:</h3>
                            ${valoresAtuaisHTML}
                        </div>

                        <div class="valores-novos" id="valoresNovos" style="display: none;">
                            <h3>Novos Valores:</h3>
                            ${valoresNovosHTML}
                        </div>

                        <div class="form-group">
                            <label for="percentualReajuste">Percentual de Reajuste:</label>
                            <div class="percentual-container">
                                <input type="number" id="percentualReajuste" step="0.01"
                                       placeholder="Ex: 10 para aumento de 10%">
                                <span>%</span>
                            </div>
                            <small class="text-muted">Use valores negativos para redução (ex: -10 para redução de 10%)</small>
                        </div>

                        <div class="botoes-acoes mt-3">
                            <button onclick="confirmarReajuste('${veiculoId}')" class="btn btn-primary">
                                <i class="fas fa-percentage"></i> Aplicar
                            </button>
                            <button onclick="fecharModalReajuste()" class="btn btn-secondary">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('reajModal').style.display = 'block';

    // Adicionar evento para calcular e mostrar novos valores ao digitar
    document
        .getElementById('percentualReajuste')
        .addEventListener('input', function () {
            const percentual = parseFloat(this.value) || 0;
            const fatorReajuste = 1 + percentual / 100;

            // Atualizar cada valor com o reajuste
            veiculo.metodosCobranca.forEach((metodo) => {
                let valorNumerico;
                if (typeof metodo.valor === 'string') {
                    valorNumerico = parseFloat(
                        metodo.valor.replace(/[^\d,.]/g, '').replace(',', '.')
                    );
                } else {
                    valorNumerico = parseFloat(metodo.valor);
                }

                if (isNaN(valorNumerico)) valorNumerico = 0;

                const novoValor = valorNumerico * fatorReajuste;
                const elementoValor = document.getElementById(
                    `novo_${metodo.tipo}`
                );

                if (elementoValor) {
                    elementoValor.textContent = novoValor.toLocaleString(
                        'pt-BR',
                        {
                            style: 'currency',
                            currency: 'BRL',
                        }
                    );
                }
            });

            // Mostrar a seção de novos valores
            document.getElementById('valoresNovos').style.display = 'block';
        });
}

function fecharModalReajuste() {
    const modal = document.querySelector('.modal-reajuste');
    if (modal) modal.remove();
}

function confirmarReajuste(veiculoId) {
    const percentualInput = document.getElementById('percentualReajuste');
    const percentual = parseFloat(percentualInput.value);

    if (isNaN(percentual)) {
        showNotification('Por favor, insira um valor válido', 'error');
        return;
    }

    aplicarReajuste(veiculoId, percentual);
    fecharModalReajuste();
}

function aplicarReajuste(veiculoId, percentual) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const index = veiculos.findIndex((v) => v.id === veiculoId);

    if (index !== -1) {
        const veiculo = veiculos[index];
        const fatorReajuste = 1 + percentual / 100;

        // Aplicar reajuste em todos os tipos de valores
        if (veiculo.valorDiaria !== undefined) {
            veiculo.valorDiaria = parseFloat(
                (veiculo.valorDiaria * fatorReajuste).toFixed(2)
            );
        }

        if (veiculo.valorSemanal !== undefined) {
            veiculo.valorSemanal = parseFloat(
                (veiculo.valorSemanal * fatorReajuste).toFixed(2)
            );
        }

        if (veiculo.valorMensal !== undefined) {
            veiculo.valorMensal = parseFloat(
                (veiculo.valorMensal * fatorReajuste).toFixed(2)
            );
        }

        // Compatibilidade com o formato antigo de metodosCobranca
        if (veiculo.metodosCobranca && veiculo.metodosCobranca.length > 0) {
            veiculo.metodosCobranca.forEach((metodo) => {
                // Extrai o valor numérico
                let valorNumerico;
                if (typeof metodo.valor === 'string') {
                    valorNumerico = parseFloat(
                        metodo.valor.replace(/[^\d,.]/g, '').replace(',', '.')
                    );
                } else {
                    valorNumerico = parseFloat(metodo.valor);
                }

                if (!isNaN(valorNumerico)) {
                    const novoValor = valorNumerico * fatorReajuste;
                    metodo.valor = novoValor.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    });
                }
            });
        }

        veiculos[index] = veiculo;
        localStorage.setItem('veiculos', JSON.stringify(veiculos));

        showNotification(
            `Reajuste de ${percentual}% aplicado com sucesso!`,
            'success'
        );
        listarVeiculos();
        return true;
    }
    return false;
}

// Funções de visualização de imagens
function abrirVisualizador(veiculoId) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculo = veiculos.find((v) => v.id === veiculoId);

    if (!veiculo) return;

    // Verifica se as imagens estão no formato antigo (array de strings) ou novo (array de objetos)
    if (!veiculo.imagens || veiculo.imagens.length === 0) {
        imagensAtuais = [
            {
                src: obterImagemTipoVeiculo(veiculo.tipo),
                tipo: 'padrao',
            },
        ];
    } else {
        // Converte para o formato padrão (array de objetos)
        imagensAtuais = veiculo.imagens.map((img) => {
            if (typeof img === 'string') {
                return { src: img, tipo: 'padrao' };
            }
            return img;
        });
    }

    indiceImagemAtual = 0;
    const imagem = imagensAtuais[indiceImagemAtual];

    document.getElementById('imagemVisualizador').src = imagem.src;
    document.getElementById('tituloImagem').textContent = formatarTipoImagem(
        imagem.tipo
    );
    document.getElementById('visualizadorImagens').style.display = 'flex';
}

function fecharVisualizador() {
    document.getElementById('visualizadorImagens').style.display = 'none';
}

function mudarImagem(direcao) {
    indiceImagemAtual += direcao;

    if (indiceImagemAtual < 0) {
        indiceImagemAtual = imagensAtuais.length - 1;
    } else if (indiceImagemAtual >= imagensAtuais.length) {
        indiceImagemAtual = 0;
    }

    const imagem = imagensAtuais[indiceImagemAtual];
    document.getElementById('imagemVisualizador').src = imagem.src;
    document.getElementById('tituloImagem').textContent = formatarTipoImagem(
        imagem.tipo
    );
}

// Funções de solicitações e feedbacks
function listarSolicitacoes() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const solicitacoesList = document.getElementById('solicitacoesList');

    if (!usuarioLogado) return;

    solicitacoesList.innerHTML = '';

    const minhasSolicitacoes = solicitacoes.filter(
        (solic) => solic.locadorId === usuarioLogado.id
    );

    if (minhasSolicitacoes.length === 0) {
        solicitacoesList.innerHTML = '<p>Não há solicitações no momento.</p>';
        return;
    }

    minhasSolicitacoes.forEach((solic) => {
        const locatario = usuarios.find((u) => u.id === solic.locatarioId);
        const veiculo = veiculos.find((v) => v.id === solic.veiculoId);

        const card = document.createElement('div');
        card.className = 'solicitacao-card';

        const botaoChat =
            solic.status === 'aceito'
                ? `<button onclick="abrirChat('${solic.id}')" class="btn-chat">
                                        <span class="icon-chat"></span> Chat
                                    </button>`
                : '';

        card.innerHTML = `
                                    <p><strong>Locatário:</strong> ${
                                        locatario?.nome ||
                                        'Usuário desconhecido'
                                    }</p>
                                    <p><strong>Veículo:</strong> ${
                                        veiculo?.modelo ||
                                        'Veículo desconhecido'
                                    }</p>
                                    <p><strong>Status:</strong> ${formatarStatus(
                                        solic.status
                                    )}</p>
                                    ${botaoChat}
                                    ${
                                        solic.status === 'pendente'
                                            ? `
                                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                            <button onclick="aceitarSolicitacao('${solic.id}')" class="btn btn-success">
                                                <i class="fas fa-check"></i> Aceitar
                                            </button>
                                            <button onclick="recusarSolicitacao('${solic.id}')" class="btn btn-danger">
                                                <i class="fas fa-times"></i> Recusar
                                            </button>
                                        </div>
                                    `
                                            : ''
                                    }
                                `;

        solicitacoesList.appendChild(card);
    });
}

function formatarStatus(status) {
    const statusMap = {
        pendente:
            '<span style="color: #ffc107;"><i class="fas fa-clock"></i> Pendente</span>',
        aceito: '<span style="color: #28a745;"><i class="fas fa-check-circle"></i> Aceito</span>',
        recusado:
            '<span style="color: #dc3545;"><i class="fas fa-times-circle"></i> Recusado</span>',
    };
    return statusMap[status] || status;
}

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
        listarSolicitacoes();

        // Abrir o chat automaticamente
        abrirChat(idSolicitacao);
    }
}

function recusarSolicitacao(idSolicitacao) {
    const motivo = prompt('Informe o motivo da recusa:');
    if (!motivo || motivo.trim() === '') {
        showNotification('Você deve informar o motivo para recusar.', 'error');
        return;
    }

    const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
    const index = solicitacoes.findIndex((s) => s.id === idSolicitacao);

    if (index !== -1) {
        solicitacoes[index].status = 'recusado';
        solicitacoes[index].respostaLocador = motivo.trim();
        localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
        showNotification('Solicitação recusada.', 'info');
        listarSolicitacoes();
    }
}

function listarFeedbacks() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const feedbacksList = document.getElementById('feedbacksList');
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (!usuarioLogado) return;

    feedbacksList.innerHTML = '';

    const minhasAvaliacoes = avaliacoes.filter(
        (avaliacao) => avaliacao.locadorId === usuarioLogado.id
    );

    if (minhasAvaliacoes.length === 0) {
        feedbacksList.innerHTML = '<p>Você ainda não recebeu avaliações.</p>';
        return;
    }

    minhasAvaliacoes.forEach((avaliacao) => {
        const locatario = usuarios.find((u) => u.id === avaliacao.locatarioId);

        const card = document.createElement('div');
        card.className = 'feedback-card';
        card.innerHTML = `
                                    <p><strong>Locatário:</strong> ${
                                        locatario?.nome ||
                                        'Usuário desconhecido'
                                    }</p>
                                    <p><strong>Nota:</strong> ${'⭐'.repeat(
                                        avaliacao.nota
                                    )}</p>
                                    <p><strong>Comentário:</strong> ${
                                        avaliacao.comentario || 'Sem comentário'
                                    }</p>
                                    <p><small><i class="far fa-clock"></i> ${new Date(
                                        avaliacao.dataAvaliacao
                                    ).toLocaleDateString()}</small></p>
                                `;

        feedbacksList.appendChild(card);
    });
}

// Função para salvar novos veículos sem sobrescrever os existentes
function salvarNovoVeiculo(veiculoData) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];

    // Verifica se já existe um veículo com esse ID
    const existeIndex = veiculos.findIndex((v) => v.id === veiculoData.id);

    if (existeIndex !== -1) {
        // Se existe, atualiza o veículo existente
        veiculos[existeIndex] = veiculoData;
    } else {
        // Se não existe, adiciona um novo veículo
        if (!veiculoData.id) {
            veiculoData.id = generateId(); // Garante que tem um ID único
        }
        veiculos.push(veiculoData);
    }

    localStorage.setItem('veiculos', JSON.stringify(veiculos));
    return veiculoData.id;
}

// Verifica se o status deve ser "pendente" baseado na origem da ação
function definirStatusVeiculo(veiculoId, acao) {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const index = veiculos.findIndex((v) => v.id === veiculoId);

    if (index !== -1) {
        // Se está editando um veículo existente, manter o status atual
        if (acao === 'editar') {
            return veiculos[index].status || 'ativo';
        }
        // Se está continuando um cadastro, verificar se já foi salvo antes
        else if (
            acao === 'continuar' &&
            veiculos[index].status &&
            veiculos[index].status !== 'pendente'
        ) {
            return veiculos[index].status;
        }
    }

    // Para novo veículo ou continuação de cadastro pendente
    return 'pendente';
}

// Funções gerais do sistema
function verificarStatusConta() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const statusConta = document.getElementById('statusConta');

    if (!usuarioLogado || usuarioLogado.tipoUsuario !== 'locador') {
        window.location.href = 'index.html';
        return;
    }

    statusConta.className = 'status-conta';

    if (usuarioLogado.status === 'pendente') {
        statusConta.classList.add('status-pendente');
        statusConta.innerHTML =
            '<p><i class="fas fa-clock"></i> Seu cadastro ainda está em análise. Aguarde aprovação.</p>';
    } else if (usuarioLogado.status === 'aprovado') {
        statusConta.classList.add('status-aprovado');
    } else {
        statusConta.classList.add('status-recusado');
        statusConta.innerHTML =
            '<p><i class="fas fa-times-circle"></i> Conta bloqueada ou recusada. Contate o suporte.</p>';
    }
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// Inicializar eventos para propulsão e combustível
const tipoPropulsao = document.getElementById('subtipoVeiculo');
if (tipoPropulsao) {
    tipoPropulsao.addEventListener('change', atualizarCamposCombustivel);
}

// Atualizar textos dos botões em modais de edição
const botoesEditar = document.querySelectorAll('.btn-editar-veiculo');
botoesEditar.forEach((botao) => {
    if (botao.dataset.modo === 'editar') {
        const btnContinuar = botao
            .closest('.modal')
            .querySelector('.btn-continuar');
        const btnSalvar = botao.closest('.modal').querySelector('.btn-salvar');

        if (btnContinuar) btnContinuar.textContent = 'Continuar Edição Depois';
        if (btnSalvar) btnSalvar.textContent = 'Salvar Edição';
    }
});

// Adicione ao seu JavaScript antes de fechar o script
document.addEventListener('DOMContentLoaded', function () {
    // Configurar event listener para o dropdown de período
    const periodoDisponibilidade = document.getElementById(
        'periodoDisponibilidade'
    );
    if (periodoDisponibilidade) {
        periodoDisponibilidade.addEventListener(
            'change',
            toggleHorariosContainer
        );
    }
});

// Notification System Functions for Landlord Panel
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
        type: type,
        title: title,
        message: message,
        timestamp: new Date().toISOString(),
        read: false,
        userId: usuarioLogado.id,
        relatedId: relatedId,
    };

    const notifications = getNotifications();
    notifications.push(notification);
    saveNotifications(notifications);

    updateNotificationBadge();

    if (
        document.getElementById('notificacoes') &&
        document.getElementById('notificacoes').classList.contains('active')
    ) {
        displayNotifications();
    }

    return notification;
}

// Missing notification utility functions
function updateNotificationBadge() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const notifications = getNotifications();
    const unreadCount = notifications.filter(
        (n) => n.userId === usuarioLogado.id && !n.read
    ).length;

    // Find the notifications menu item
    const notificationItem = document.querySelector(
        '.nav-item[onclick*="notificacoes"]'
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
        if (notification.type === 'new_request') icon = 'calendar-check';
        if (notification.type === 'payment_confirmed') icon = 'money-bill';

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
                    notification.relatedId &&
                    (notification.type === 'message' ||
                        notification.type === 'new_request')
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
// Function to check for new messages - Landlord version
function checkForNewMessages() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    // Obter mensagens já notificadas
    const notifiedMessageIds = JSON.parse(
        localStorage.getItem('notifiedMessageIds') || '[]'
    );

    const solicitacoes = JSON.parse(
        localStorage.getItem('solicitacoes') || '[]'
    );
    const minhasSolicitacoes = solicitacoes.filter(
        (s) => s.locadorId === usuarioLogado.id
    );

    let hasNewMessages = false;
    const newlyNotifiedMessageIds = [];

    minhasSolicitacoes.forEach((solicitacao) => {
        if (!solicitacao.mensagens) return;

        // Filtrar mensagens não lidas e que não são do usuário logado
        const newMessages = solicitacao.mensagens.filter((msg) => {
            // Verificar se a mensagem já foi notificada
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

            newMessages.forEach((msg) => {
                const senderId = msg.remetenteId;
                const sender = usuarios.find((u) => u.id === senderId);
                const veiculo = veiculos.find(
                    (v) => v.id === solicitacao.veiculoId
                );

                const senderName = sender ? sender.nome : 'Usuário';
                const veiculoName = veiculo
                    ? `${veiculo.marca} ${veiculo.modelo}`
                    : 'veículo';

                createNotification(
                    'message',
                    'Nova mensagem',
                    `${senderName} enviou uma mensagem sobre o ${veiculoName}.`,
                    solicitacao.id
                );

                // Adicionar ID da mensagem à lista de notificadas
                const messageId = `${solicitacao.id}_${msg.id}`;
                newlyNotifiedMessageIds.push(messageId);
            });
        }
    });

    // Atualizar lista de mensagens já notificadas
    if (newlyNotifiedMessageIds.length > 0) {
        localStorage.setItem(
            'notifiedMessageIds',
            JSON.stringify([...notifiedMessageIds, ...newlyNotifiedMessageIds])
        );
    }

    return hasNewMessages;
}

// Chamar a função de inicialização quando o documento for carregado
document.addEventListener('DOMContentLoaded', function () {
    initializeNotifications();
});

// Modificação na função checkForNewRequests para melhorar detecção
function checkForNewRequests() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    console.log('Verificando novas solicitações...');

    // Obter todas as solicitações
    const solicitacoes = JSON.parse(
        localStorage.getItem('solicitacoes') || '[]'
    );
    const minhasSolicitacoes = solicitacoes.filter(
        (s) => s.locadorId === usuarioLogado.id
    );

    // Obter IDs de solicitações já notificadas
    const notifiedRequestIds = JSON.parse(
        localStorage.getItem('notifiedRequestIds') || '[]'
    );

    // Encontrar solicitações que ainda não foram notificadas
    const novasSolicitacoes = minhasSolicitacoes.filter(
        (s) => !notifiedRequestIds.includes(s.id)
    );

    console.log(`Encontradas ${novasSolicitacoes.length} novas solicitações`);

    // Criar notificações para novas solicitações
    if (novasSolicitacoes.length > 0) {
        // Array para armazenar IDs de solicitações que serão notificadas nesta execução
        const newlyNotifiedIds = [];

        novasSolicitacoes.forEach((solicitacao) => {
            // Obter informações do locatário e veículo
            const usuarios = JSON.parse(
                localStorage.getItem('usuarios') || '[]'
            );
            const veiculos = JSON.parse(
                localStorage.getItem('veiculos') || '[]'
            );

            const locatario = usuarios.find(
                (u) => u.id === solicitacao.locatarioId
            );
            const veiculo = veiculos.find(
                (v) => v.id === solicitacao.veiculoId
            );

            const locatarioName = locatario ? locatario.nome : 'Usuário';
            const veiculoName = veiculo
                ? `${veiculo.marca} ${veiculo.modelo}`
                : 'veículo';

            // Criar notificação
            createNotification(
                'new_request',
                'Nova solicitação de locação',
                `${locatarioName} solicitou o ${veiculoName}.`,
                solicitacao.id
            );

            // Adicionar ID à lista de notificados nesta execução
            newlyNotifiedIds.push(solicitacao.id);
        });

        // Atualizar a lista de IDs já notificados
        localStorage.setItem(
            'notifiedRequestIds',
            JSON.stringify([...notifiedRequestIds, ...newlyNotifiedIds])
        );
    }

    return novasSolicitacoes.length > 0;
}

// Function to check for payment confirmations - Landlord specific
function checkForPaymentUpdates() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    const solicitacoes = JSON.parse(
        localStorage.getItem('solicitacoes') || '[]'
    );
    const minhasSolicitacoes = solicitacoes.filter(
        (s) => s.locadorId === usuarioLogado.id
    );

    // Get last known payment states
    const lastPaymentStates = JSON.parse(
        localStorage.getItem('lastPaymentStates') || '{}'
    );
    const currentPaymentStates = {};

    let hasPaymentChanges = false;

    minhasSolicitacoes.forEach((solicitacao) => {
        // Store the current payment status
        const currentPaymentStatus =
            solicitacao.pagamento?.status || 'pendente';
        currentPaymentStates[solicitacao.id] = currentPaymentStatus;

        // Get previous payment status
        const previousPaymentStatus = lastPaymentStates[solicitacao.id];

        // Check if payment status changed to confirmed
        if (
            previousPaymentStatus &&
            previousPaymentStatus !== currentPaymentStatus &&
            currentPaymentStatus.toLowerCase() === 'confirmado'
        ) {
            hasPaymentChanges = true;

            // Get information about the vehicle and tenant
            const veiculos = JSON.parse(
                localStorage.getItem('veiculos') || '[]'
            );
            const usuarios = JSON.parse(
                localStorage.getItem('usuarios') || '[]'
            );

            const veiculo = veiculos.find(
                (v) => v.id === solicitacao.veiculoId
            );
            const locatario = usuarios.find(
                (u) => u.id === solicitacao.locatarioId
            );

            const veiculoName = veiculo
                ? `${veiculo.marca} ${veiculo.modelo}`
                : 'veículo';
            const locatarioName = locatario ? locatario.nome : 'Cliente';

            // Create notification for payment confirmation
            createNotification(
                'payment_confirmed',
                'Pagamento confirmado',
                `${locatarioName} confirmou o pagamento para o ${veiculoName}.`,
                solicitacao.id
            );
        }
    });

    // Save current payment states
    localStorage.setItem(
        'lastPaymentStates',
        JSON.stringify(currentPaymentStates)
    );

    return hasPaymentChanges;
}

// Function to check for all types of landlord notifications
function checkNotifications() {
    const hasNewMessages = checkForNewMessages();
    const hasNewRequests = checkForNewRequests();
    const hasPaymentChanges = checkForPaymentUpdates();

    // If there are new notifications, update the badge
    if (hasNewMessages || hasNewRequests || hasPaymentChanges) {
        updateNotificationBadge();

        if (
            document.getElementById('notificacoes') &&
            document.getElementById('notificacoes').classList.contains('active')
        ) {
            displayNotifications();
        }
    }
}

// Initialize notifications
function initializeNotifications() {
    updateNotificationBadge();

    const notificationTab = document.querySelector(
        '.menu-item[data-tab="notificacoes"]'
    );
    if (notificationTab) {
        notificationTab.addEventListener('click', function () {
            displayNotifications();
        });
    }

    // Check for notifications periodically (every 30 seconds)
    setInterval(checkNotifications, 30000);

    // Check immediately
    checkNotifications();

    // REMOVER ESTA LINHA! Ela está causando o loop infinito
    // document.addEventListener('DOMContentLoaded', initializeNotifications);
}
