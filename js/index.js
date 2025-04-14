// Armazenar o idioma selecionado no localStorage
function getStoredLanguage() {
    return localStorage.getItem('lang') || 'pt';
}

function storeLanguage(l) {
    localStorage.setItem('lang', l);
}

// Textos dinâmicos para o efeito de digitação
let textos = {
    pt: [
        'seu transporte ideal!',
        'seu carro...',
        'seu patinete...',
        'sua bike...',
    ],
    en: ['your ideal ride!', 'your car...', 'your scooter...', 'your bike...'],
    es: [
        'tu transporte ideal!',
        'tu coche...',
        'tu patinete...',
        'tu bicicleta...',
    ],
};

// Traduções para os textos da interface
let traducoes = {
    pt: {
        welcome: 'Bem-vindo ao ',
        emailLabel: 'E-mail',
        senhaLabel: 'Senha',
        btnEntrar: 'Entrar',
        footer: 'Ainda não tem conta? ',
        footerCadastro: 'Já tem uma conta? ',
        btnCadastrar: 'Cadastrar',
        btnVoltarLogin: 'Voltar para Login',
        formTitle: 'Crie sua conta',
        tipoUsuario: 'Você é:',
        locador: 'Locador',
        locatario: 'Locatário',
        nome: 'Nome completo',
        celular: 'Celular',
        cpf: 'CPF',
        cep: 'CEP',
        endereco: 'Endereço',
        cnh: 'CNH',
        confirmarSenha: 'Confirmar senha',
        proximo: 'Próximo',
        voltar: 'Voltar',
        cadastrar: 'Cadastre',
        entrar: 'Entrar',
        de: 'de',
        localize: 'Localize',
        cadastre: 'Cadastre',
        // Mensagens de alerta
        loginSuccess: 'Login realizado com sucesso!',
        cadastroSuccess: 'Cadastro realizado com sucesso!',
        emailRequired: 'E-mail é obrigatório',
        emailInvalid: 'E-mail inválido',
        emailExists: 'Este e-mail já está cadastrado',
        passwordRequired: 'Senha é obrigatória',
        passwordInvalid:
            'Senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial',
        passwordMatch: 'As senhas não coincidem',
        nameRequired: 'Nome é obrigatório',
        nameInvalid:
            'Nome deve ter pelo menos 7 caracteres e não pode conter caracteres especiais',
        phoneRequired: 'Celular é obrigatório',
        phoneInvalid: 'Celular inválido (formato: (99) 99999-9999)',
        cpfRequired: 'CPF é obrigatório',
        cpfInvalid: 'CPF inválido',
        cpfExists: 'Este CPF já está cadastrado',
        cepRequired: 'CEP é obrigatório',
        cepInvalid: 'CEP inválido',
        addressRequired: 'Endereço é obrigatório',
        cnhRequired: 'CNH é obrigatória',
        cnhInvalid: 'CNH inválida (deve ter 11 dígitos)',
        cnhExists: 'Esta CNH já está cadastrada',
        userTypeRequired: 'Selecione o tipo de usuário',
        weakPassword: 'Senha fraca',
        mediumPassword: 'Senha média',
        strongPassword: 'Senha forte',
        // Mensagens de erro de login
        loginError: 'Erro ao fazer login',
        userNotFound: 'Usuário não encontrado',
        wrongPassword: 'Senha incorreta',
        accountNotFound: 'Conta não encontrada',
        invalidEmailFormat: 'Formato de e-mail inválido',
        userNotAuthorizedPending:
            'Seu cadastro ainda está pendente de aprovação. Por favor, aguarde.',
        userRejected:
            'Seu cadastro foi recusado. Entre em contato com o suporte.',
        userNotAuthorized: 'Usuário não autorizado.',

        emailExists: 'Este e-mail já está cadastrado.',
        cpfExists: 'Este CPF já está cadastrado.',
        phoneExists: 'Este número de telefone já está cadastrado.',
        cnhExists: 'Esta CNH já está cadastrada.',
        nameInvalid:
            'Nome deve ter pelo menos 7 caracteres e não pode conter caracteres especiais',
        cpfInvalid: 'CPF inválido',
        cepInvalid: 'CEP inválido',
        cnhInvalid: 'CNH inválida (deve ter 11 dígitos)',
        phoneInvalid: 'Celular inválido (formato: (99) 99999-9999)',
    },
    en: {
        welcome: 'Welcome to ',
        emailLabel: 'Email',
        senhaLabel: 'Password',
        btnEntrar: 'Login',
        footer: "Don't have an account? ",
        footerCadastro: 'Already have an account? ',
        btnCadastrar: 'Register',
        btnVoltarLogin: 'Back to Login',
        formTitle: 'Create your account',
        tipoUsuario: 'You are:',
        locador: 'Renter',
        locatario: 'Lessee',
        nome: 'Full name',
        celular: 'Phone',
        cpf: 'CPF',
        cep: 'ZIP Code',
        endereco: 'Address',
        cnh: "Driver's License",
        confirmarSenha: 'Confirm password',
        proximo: 'Next',
        voltar: 'Back',
        cadastrar: 'Register',
        entrar: 'Login',
        de: 'of',
        localize: 'Find',
        cadastre: 'Register',
        // Mensagens de alerta
        loginSuccess: 'Login successful!',
        cadastroSuccess: 'Registration successful!',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email',
        emailExists: 'This email is already registered',
        passwordRequired: 'Password is required',
        passwordInvalid:
            'Password must have at least 8 characters, one uppercase letter, one number and one special character',
        passwordMatch: "Passwords don't match",
        nameRequired: 'Name is required',
        nameInvalid:
            'Name must have at least 7 characters and cannot contain special characters',
        phoneRequired: 'Phone is required',
        phoneInvalid: 'Invalid phone (format: (99) 99999-9999)',
        cpfRequired: 'CPF is required',
        cpfInvalid: 'Invalid CPF',
        cpfExists: 'This CPF is already registered',
        cepRequired: 'ZIP Code is required',
        cepInvalid: 'Invalid ZIP Code',
        addressRequired: 'Address is required',
        cnhRequired: "Driver's License is required",
        cnhInvalid: "Invalid Driver's License (must have 11 digits)",
        cnhExists: "This Driver's License is already registered",
        userTypeRequired: 'Select user type',
        weakPassword: 'Weak password',
        mediumPassword: 'Medium password',
        strongPassword: 'Strong password',
        // Mensagens de erro de login
        loginError: 'Login error',
        userNotFound: 'User not found',
        wrongPassword: 'Wrong password',
        accountNotFound: 'Account not found',
        invalidEmailFormat: 'Invalid email format',

        userNotAuthorizedPending:
            'Your registration is still pending approval. Please wait.',
        userRejected:
            'Your registration has been rejected. Please contact support.',
        userNotAuthorized: 'User not authorized.',

        emailExists: 'This email is already registered.',
        cpfExists: 'This CPF is already registered.',
        phoneExists: 'This phone number is already registered.',
        cnhExists: 'This CNH is already registered.',
        nameInvalid:
            'Name must have at least 7 characters and cannot contain special characters',
        cpfInvalid: 'Invalid CPF',
        cepInvalid: 'Invalid ZIP Code',
        cnhInvalid: "Invalid Driver's License (must have 11 digits)",
        phoneInvalid: 'Invalid phone (format: (99) 99999-9999)',
    },
    es: {
        welcome: 'Bienvenido a ',
        emailLabel: 'Correo',
        senhaLabel: 'Contraseña',
        btnEntrar: 'Entrar',
        footer: '¿No tienes cuenta? ',
        footerCadastro: '¿Ya tienes una cuenta? ',
        btnCadastrar: 'Registrar',
        btnVoltarLogin: 'Volver a Iniciar sesión',
        formTitle: 'Crea tu cuenta',
        tipoUsuario: 'Eres:',
        locador: 'Arrendador',
        locatario: 'Arrendatario',
        nome: 'Nombre completo',
        celular: 'Teléfono',
        cpf: 'CPF',
        cep: 'Código Postal',
        endereco: 'Dirección',
        cnh: 'Licencia de conducir',
        confirmarSenha: 'Confirmar contraseña',
        proximo: 'Siguiente',
        voltar: 'Atrás',
        cadastrar: 'Registrar',
        entrar: 'Iniciar sesión',
        de: 'de',
        localize: 'Localiza',
        cadastre: 'Regístrate',
        // Mensagens de alerta
        loginSuccess: '¡Inicio de sesión exitoso!',
        cadastroSuccess: '¡Registro exitoso!',
        emailRequired: 'El correo es obligatorio',
        emailInvalid: 'Correo inválido',
        emailExists: 'Este correo ya está registrado',
        passwordRequired: 'La contraseña es obligatoria',
        passwordInvalid:
            'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial',
        passwordMatch: 'Las contraseñas no coinciden',
        nameRequired: 'El nombre es obligatorio',
        nameInvalid:
            'El nombre debe tener al menos 7 caracteres y no puede contener caracteres especiales',
        phoneRequired: 'El teléfono es obligatorio',
        phoneInvalid: 'Teléfono inválido (formato: (99) 99999-9999)',
        cpfRequired: 'El CPF es obligatorio',
        cpfInvalid: 'CPF inválido',
        cpfExists: 'Este CPF ya está registrado',
        cepRequired: 'El código postal es obligatorio',
        cepInvalid: 'Código postal inválido',
        addressRequired: 'La dirección es obligatoria',
        cnhRequired: 'La licencia de conducir es obligatoria',
        cnhInvalid: 'Licencia de conducir inválida (debe tener 11 dígitos)',
        cnhExists: 'Esta licencia de conducir ya está registrada',
        userTypeRequired: 'Selecciona el tipo de usuario',
        weakPassword: 'Contraseña débil',
        mediumPassword: 'Contraseña media',
        strongPassword: 'Contraseña fuerte',
        // Mensagens de erro de login
        loginError: 'Error al iniciar sesión',
        userNotFound: 'Usuario no encontrado',
        wrongPassword: 'Contraseña incorrecta',
        accountNotFound: 'Cuenta no encontrada',
        invalidEmailFormat: 'Formato de correo inválido',

        userNotAuthorizedPending:
            'Tu registro aún está pendiente de aprobación. Por favor, espera.',
        userRejected:
            'Tu registro ha sido rechazado. Por favor, contacta con soporte.',
        userNotAuthorized: 'Usuario no autorizado.',

        emailExists: 'Este correo electrónico ya está registrado.',
        cpfExists: 'Este CPF ya está registrado.',
        phoneExists: 'Este número de teléfono ya está registrado.',
        cnhExists: 'Esta CNH ya está registrada.',
        nameInvalid:
            'El nombre debe tener al menos 7 caracteres y no puede contener caracteres especiales',
        cpfInvalid: 'CPF inválido',
        cepInvalid: 'Código postal inválido',
        cnhInvalid: 'Licencia de conducir inválida (debe tener 11 dígitos)',
        phoneInvalid: 'Teléfono inválido (formato: (99) 99999-9999)',
    },
};

// Variáveis iniciais e para o efeito de digitação
let lang = getStoredLanguage();
let palavraIndex = 0;
let letraIndex = 0;
let interval;

// Variáveis para o cadastro em múltiplas etapas
let currentStep = 1;
const totalSteps = 3;

// Domínios de e-mail sugeridos
const emailDomains = [
    'gmail.com',
    'gmail.com.br',
    'yahoo.com',
    'yahoo.com.br',
    'hotmail.com',
    'hotmail.com.br',
    'outlook.com',
    'outlook.com.br',
    'icloud.com',
    'protonmail.com',
];

// Função para efeito de digitação
function escrever() {
    clearTimeout(interval);
    const fraseAtual = textos[lang][palavraIndex];
    if (letraIndex <= fraseAtual.length) {
        document.getElementById('textChange').textContent =
            fraseAtual.substring(0, letraIndex);
        letraIndex++;
        interval = setTimeout(escrever, 100);
    } else {
        interval = setTimeout(apagar, 2000);
    }
}

function apagar() {
    clearTimeout(interval);
    const fraseAtual = textos[lang][palavraIndex];
    if (letraIndex > 0) {
        document.getElementById('textChange').textContent =
            fraseAtual.substring(0, letraIndex - 1);
        letraIndex--;
        interval = setTimeout(apagar, 50);
    } else {
        palavraIndex = (palavraIndex + 1) % textos[lang].length;
        interval = setTimeout(escrever, 500);
    }
}

// Função para mostrar/ocultar senha
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.nextElementSibling;

    if (field.type === 'password') {
        field.type = 'text';
        toggle.textContent = '👁';
    } else {
        field.type = 'password';
        toggle.textContent = '👁';
    }
}

// Função para mostrar sugestões de e-mail
function showEmailSuggestions(input, suggestionsContainer) {
    const value = input.value.toLowerCase();
    const atIndex = value.indexOf('@');

    if (atIndex === -1 || atIndex === value.length - 1) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const domainPart = value.substring(atIndex + 1);
    const filteredDomains = emailDomains.filter((domain) =>
        domain.startsWith(domainPart)
    );

    if (filteredDomains.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    suggestionsContainer.innerHTML = '';
    filteredDomains.forEach((domain) => {
        const fullEmail = value.substring(0, atIndex + 1) + domain;
        const suggestion = document.createElement('div');
        suggestion.className = 'email-suggestion';
        suggestion.textContent = fullEmail;
        suggestion.onclick = () => {
            input.value = fullEmail;
            suggestionsContainer.style.display = 'none';
        };
        suggestionsContainer.appendChild(suggestion);
    });

    suggestionsContainer.style.display = 'block';
}

// Função para mudar idioma e atualizar textos
function setLanguage(l) {
    lang = l;
    storeLanguage(lang);
    palavraIndex = 0;
    letraIndex = 0;

    // Atualiza textos estáticos...
    document.getElementById(
        'welcomeText'
    ).innerHTML = `${traducoes[lang].welcome}<span style="color:white;">Lo</span><span style="color:var(--accent-color);">Car</span>`;
    document.getElementById('labelEmail').textContent =
        traducoes[lang].emailLabel;
    document.getElementById('labelSenha').textContent =
        traducoes[lang].senhaLabel;
    document.getElementById('btnEntrar').textContent =
        traducoes[lang].btnEntrar;
    document.getElementById('email').placeholder = traducoes[lang].emailLabel;
    document.getElementById('senha').placeholder = traducoes[lang].senhaLabel;
    document.getElementById(
        'footerText'
    ).innerHTML = `${traducoes[lang].footer}<a href="#" class="form-link" onclick="mostrarCadastro()">${traducoes[lang].btnCadastrar}</a>`;

    // Atualiza o texto dinâmico baseado no contexto
    if (document.getElementById('formCadastro')) {
        const tipoUsuario = document.querySelector(
            'input[name="tipoUsuario"]:checked'
        );
        if (tipoUsuario && tipoUsuario.value === 'locador') {
            document.querySelector('#dynamicText strong').textContent =
                traducoes[lang].cadastre;
        } else {
            document.querySelector('#dynamicText strong').textContent =
                traducoes[lang].localize;
        }
    } else {
        document.querySelector('#dynamicText strong').textContent =
            traducoes[lang].localize;
    }

    // Atualiza textos do cadastro se visível
    if (document.getElementById('formCadastro')) {
        atualizarTextosCadastro();

        // Atualiza a força da senha e mensagens de confirmação
        if (document.getElementById('cadastroSenha')) {
            updatePasswordStrength();
            checkPasswordMatch();
        }
    }

    // Após atualizar os textos, atualiza também as mensagens de erro, caso haja
    updateErrorMessagesOnLanguageChange();

    escrever();
}

// Função para mostrar o formulário de cadastro
function mostrarCadastro() {
    // Reinicia a etapa para o início
    currentStep = 1;
    atualizarProgresso();

    const rightPanel = document.querySelector('.right-panel');
    const formLogin = document.getElementById('formLogin');

    // Ajusta o tamanho do painel no desktop
    if (window.innerWidth > 768) {
        rightPanel.style.minHeight = '600px';
    }

    // Esconde o formulário de login com animação
    formLogin.classList.remove('show-form');
    formLogin.classList.add('hide-form');

    // Atualiza o texto dinâmico para "Cadastre-se"
    const dynamicText = document.querySelector('#dynamicText strong');
    if (dynamicText) {
        dynamicText.textContent = traducoes[lang].cadastre;
    }

    // HTML completo do formulário de cadastro com as três etapas
    const cadastroHTML = `
      <form id="formCadastro" class="auth-form hide-form">
        <h2 class="form-title">${traducoes[lang].formTitle}</h2>
        <div class="progress-container">
          <div class="progress-bar" id="progressBar"></div>
          <div class="progress-text" id="progressText">${traducoes[lang].proximo} 1 ${traducoes[lang].de} ${totalSteps}</div>
        </div>
        <!-- Etapa 1 -->
        <div id="step-1" class="step active-step">
          <div class="input-group" id="tipoUsuario-group">
            <label class="input-label">${traducoes[lang].tipoUsuario}</label>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" name="tipoUsuario" value="locador" required>
                <span class="radio-custom"></span>
                <span class="radio-label">${traducoes[lang].locador}</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="tipoUsuario" value="locatario">
                <span class="radio-custom"></span>
                <span class="radio-label">${traducoes[lang].locatario}</span>
              </label>
            </div>
          </div>
          <div class="input-group">
            <label for="cadastroNome" class="input-label">${traducoes[lang].nome}</label>
            <input type="text" id="cadastroNome" class="input-field" placeholder="${traducoes[lang].nome}" required>
          </div>
          <div class="input-group">
            <label for="cadastroEmail" class="input-label">${traducoes[lang].emailLabel}</label>
            <input type="email" id="cadastroEmail" class="input-field" placeholder="${traducoes[lang].emailLabel}" required>
            <div class="email-suggestions" id="emailSuggestions"></div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-next" onclick="proximoPasso()">${traducoes[lang].proximo}</button>
          </div>
        </div>
        <!-- Etapa 2 -->
        <div id="step-2" class="step">
          <div class="input-group">
            <label for="cadastroCelular" class="input-label">${traducoes[lang].celular}</label>
            <input type="tel" id="cadastroCelular" class="input-field masked" placeholder="${traducoes[lang].celular}" required>
            <span class="mask-status" id="celularStatus"></span>
          </div>
          <div class="input-group">
            <label for="cadastroCpf" class="input-label">${traducoes[lang].cpf}</label>
            <input type="text" id="cadastroCpf" class="input-field masked" placeholder="${traducoes[lang].cpf}" required>
            <span class="mask-status" id="cpfStatus"></span>
          </div>
          <div class="input-group">
            <label for="cadastroCep" class="input-label">${traducoes[lang].cep}</label>
            <input type="text" id="cadastroCep" class="input-field masked" placeholder="${traducoes[lang].cep}" required>
            <span class="mask-status" id="cepStatus"></span>
          </div>
          <div class="input-group">
            <label for="cadastroEndereco" class="input-label">${traducoes[lang].endereco}</label>
            <input type="text" id="cadastroEndereco" class="input-field" placeholder="${traducoes[lang].endereco}" readonly required>
          </div>
          <div class="input-group">
            <label for="cadastroCnh" class="input-label">${traducoes[lang].cnh}</label>
            <input type="text" id="cadastroCnh" class="input-field masked" placeholder="${traducoes[lang].cnh}" required>
            <span class="mask-status" id="cnhStatus"></span>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-back" onclick="anteriorPasso()">${traducoes[lang].voltar}</button>
            <button type="button" class="btn btn-next" onclick="proximoPasso()">${traducoes[lang].proximo}</button>
          </div>
        </div>
        <!-- Etapa 3 -->
        <div id="step-3" class="step">
          <div class="input-group">
            <label for="cadastroSenha" class="input-label">${traducoes[lang].senhaLabel}</label>
            <div style="position: relative;">
              <input type="password" id="cadastroSenha" class="input-field" placeholder="${traducoes[lang].senhaLabel}" required>
              <span class="password-toggle" onclick="togglePassword('cadastroSenha')">👁</span>
            </div>
            <div class="password-strength" id="passwordStrength">
              <div class="password-strength-bar"></div>
            </div>
            <div class="password-strength-text" id="passwordStrengthText"></div>
          </div>
          <div class="input-group">
            <label for="cadastroConfirmarSenha" class="input-label">${traducoes[lang].confirmarSenha}</label>
            <div style="position: relative;">
              <input type="password" id="cadastroConfirmarSenha" class="input-field" placeholder="${traducoes[lang].confirmarSenha}" required>
              <span class="password-toggle" onclick="togglePassword('cadastroConfirmarSenha')">👁</span>
            </div>
            <div id="passwordMatchStatus"></div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-back" onclick="anteriorPasso()">${traducoes[lang].voltar}</button>
            <button type="submit" class="btn btn-primary">${traducoes[lang].cadastrar}</button>
          </div>
        </div>
        <p class="form-footer">
          ${traducoes[lang].footerCadastro} <a href="#" class="form-link" onclick="voltarParaLogin()">${traducoes[lang].entrar}</a>
        </p>
      </form>
    `;

    // Insere o formulário de cadastro no painel direito
    rightPanel.insertAdjacentHTML('beforeend', cadastroHTML);

    // Após um pequeno delay, mostra o formulário de cadastro
    setTimeout(() => {
        const formCadastro = document.getElementById('formCadastro');
        if (formCadastro) {
            formCadastro.classList.remove('hide-form');
            formCadastro.classList.add('show-form');
        }
        // Configura os event listeners para os radio buttons
        document
            .querySelectorAll('input[name="tipoUsuario"]')
            .forEach((radio) => {
                radio.addEventListener('change', () => {
                    const tipoUsuario = document.querySelector(
                        'input[name="tipoUsuario"]:checked'
                    );
                    if (tipoUsuario && tipoUsuario.value === 'locador') {
                        document.querySelector(
                            '#dynamicText strong'
                        ).textContent = traducoes[lang].cadastre;
                    } else {
                        document.querySelector(
                            '#dynamicText strong'
                        ).textContent = traducoes[lang].localize;
                    }
                });
            });
        // Chama a função para inicializar máscaras e validações do cadastro
        inicializarCadastro();
    }, 400);
}

// Função para voltar ao formulário de login
function voltarParaLogin() {
    const rightPanel = document.querySelector('.right-panel');
    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');

    if (formCadastro) {
        formCadastro.classList.remove('show-form');
        formCadastro.classList.add('hide-form');
    }

    if (window.innerWidth > 768) {
        rightPanel.style.minHeight = '400px';
    }

    document.querySelector('#dynamicText strong').textContent =
        traducoes[lang].localize;

    setTimeout(() => {
        formLogin.classList.remove('hide-form');
        formLogin.classList.add('show-form');
        setTimeout(() => {
            if (formCadastro) formCadastro.remove();
        }, 400);
    }, 400);
}

// Função para verificar força da senha
function checkPasswordStrength(password) {
    const strength = {
        level: 0,
        text: '',
    };

    // Verifica o comprimento
    if (password.length >= 8) strength.level++;
    if (password.length >= 12) strength.level++;

    // Verifica se tem letra maiúscula
    if (/[A-Z]/.test(password)) strength.level++;

    // Verifica se tem número
    if (/\d/.test(password)) strength.level++;

    // Verifica se tem caractere especial
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength.level++;

    // Verifica se não é sequência simples
    if (!/(.)\1{2,}/.test(password) && !/(123|abc|qwe)/i.test(password))
        strength.level++;

    // Determina o nível de força
    if (strength.level <= 2) {
        strength.text = 'weak';
    } else if (strength.level <= 4) {
        strength.text = 'medium';
    } else {
        strength.text = 'strong';
    }

    return strength;
}

// Função para atualizar a visualização da força da senha
function updatePasswordStrength() {
    const password = document.getElementById('cadastroSenha')
        ? document.getElementById('cadastroSenha').value
        : '';
    const strengthBar = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('passwordStrengthText');

    if (!password || !strengthBar || !strengthText) return;

    const strengthObj = calculatePasswordStrength(password);

    strengthBar.className = 'password-strength ' + strengthObj.text;
    strengthText.textContent =
        traducoes[lang][strengthObj.text + 'Password'] || '';
    strengthText.style.color =
        strengthObj.text === 'weak'
            ? 'var(--error-color)'
            : strengthObj.text === 'medium'
            ? 'var(--warning-color)'
            : 'var(--success-color)';
}

function calculatePasswordStrength(password) {
    let level = 0;
    if (password.length >= 8) level++;
    if (password.length >= 12) level++;
    if (/[A-Z]/.test(password)) level++;
    if (/\d/.test(password)) level++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) level++;
    if (!/(.)\1{2,}/.test(password) && !/(123|abc|qwe)/i.test(password))
        level++;

    let text = 'weak';
    if (level <= 2) {
        text = 'weak';
    } else if (level <= 4) {
        text = 'medium';
    } else {
        text = 'strong';
    }
    return { level, text };
}

function checkPasswordMatch() {
    const password = document.getElementById('cadastroSenha')
        ? document.getElementById('cadastroSenha').value
        : '';
    const confirmPassword = document.getElementById('cadastroConfirmarSenha')
        ? document.getElementById('cadastroConfirmarSenha').value
        : '';
    const matchStatus = document.getElementById('passwordMatchStatus');

    if (!matchStatus) return;

    if (confirmPassword === '') {
        matchStatus.innerHTML = '';
        return;
    }

    if (password === confirmPassword) {
        matchStatus.innerHTML = `<div class="success-message">${traducoes[lang].passwordMatch}</div>`;
        document
            .getElementById('cadastroConfirmarSenha')
            .classList.remove('error');
        document
            .getElementById('cadastroConfirmarSenha')
            .classList.add('success');
    } else {
        matchStatus.innerHTML = `<div class="error-message">${traducoes[lang].passwordMatch}</div>`;
        document
            .getElementById('cadastroConfirmarSenha')
            .classList.remove('success');
        document
            .getElementById('cadastroConfirmarSenha')
            .classList.add('error');
    }
}

// Função para validar CNH (simplificada)
function validarCNH(cnh) {
    // Verifica se tem 11 dígitos e não é uma sequência repetida
    return /^\d{11}$/.test(cnh) && !/(\d)\1{10}/.test(cnh);
}

// Inicializa máscaras e validações do formulário de cadastro
function inicializarCadastro() {
    // Recupera os elementos dos inputs e demais componentes do formulário
    const nomeInput = document.getElementById('cadastroNome');
    const cpfInput = document.getElementById('cadastroCpf');
    const celularInput = document.getElementById('cadastroCelular');
    const cepInput = document.getElementById('cadastroCep');
    const cnhInput = document.getElementById('cadastroCnh');
    const emailInput = document.getElementById('cadastroEmail');
    const emailSuggestions = document.getElementById('emailSuggestions');
    const senhaInput = document.getElementById('cadastroSenha');
    const confirmarSenhaInput = document.getElementById(
        'cadastroConfirmarSenha'
    );

    // ----- E-mail: sugestões, formato e duplicidade -----
    if (emailInput && emailSuggestions) {
        emailInput.addEventListener('input', () => {
            showEmailSuggestions(emailInput, emailSuggestions);
        });
        document.addEventListener('click', (e) => {
            if (e.target !== emailInput) {
                emailSuggestions.style.display = 'none';
            }
        });
        emailInput.addEventListener('input', function (e) {
            const email = e.target.value.trim();
            if (validarEmail(email)) {
                let usuarios =
                    JSON.parse(localStorage.getItem('usuarios')) || [];
                if (
                    usuarios.some(
                        (u) => u.email.toLowerCase() === email.toLowerCase()
                    )
                ) {
                    mostrarErro(
                        'cadastroEmail',
                        traducoes[lang].emailExists,
                        'emailExists'
                    );
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                } else {
                    const errorMsg =
                        e.target.parentNode.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                    e.target.classList.remove('invalid');
                    e.target.classList.add('valid');
                }
            } else {
                e.target.classList.remove('valid');
                e.target.classList.add('invalid');
            }
        });
        emailInput.addEventListener('blur', function (e) {
            const email = e.target.value.trim();
            if (email !== '') {
                let usuarios =
                    JSON.parse(localStorage.getItem('usuarios')) || [];
                if (
                    usuarios.some(
                        (u) => u.email.toLowerCase() === email.toLowerCase()
                    )
                ) {
                    mostrarErro(
                        'cadastroEmail',
                        traducoes[lang].emailExists,
                        'emailExists'
                    );
                    applyShakeEffect(e.target);
                }
            }
        });
    }

    // ----- Nome Completo: validação de formato -----
    if (nomeInput) {
        nomeInput.addEventListener('blur', function (e) {
            const nome = e.target.value.trim();
            if (
                nome === '' ||
                nome.length < 7 ||
                /[!@#$%^&*(),.?":{}|<>]/.test(nome)
            ) {
                mostrarErro(
                    'cadastroNome',
                    traducoes[lang].nameInvalid,
                    'nameInvalid'
                );
                applyShakeEffect(e.target);
                e.target.classList.remove('valid');
                e.target.classList.add('invalid');
            }
        });
        nomeInput.addEventListener('input', function (e) {
            const nome = e.target.value.trim();
            if (nome.length >= 7 && !/[!@#$%^&*(),.?":{}|<>]/.test(nome)) {
                const errorMsg =
                    e.target.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
                e.target.classList.remove('invalid');
                e.target.classList.add('valid');
            } else {
                e.target.classList.remove('valid');
                e.target.classList.add('invalid');
            }
        });
    }

    // ----- CPF: formatação, validação de quantidade, validade e duplicidade -----
    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            let cpf = e.target.value.replace(/\D/g, '');
            cpf = cpf.substring(0, 11);
            let formatted = cpf;
            if (cpf.length > 3)
                formatted = formatted.replace(/(\d{3})(\d)/, '$1.$2');
            if (cpf.length > 6)
                formatted = formatted.replace(/(\d{3})(\d)/, '$1.$2');
            if (cpf.length > 9)
                formatted = formatted.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = formatted;
            if (cpf.length < 11) {
                mostrarErro(
                    'cadastroCpf',
                    traducoes[lang].cpfInvalid,
                    'cpfInvalid'
                );
                e.target.classList.remove('valid');
                e.target.classList.add('invalid');
            } else if (cpf.length === 11) {
                if (!validarCPF(formatted)) {
                    mostrarErro(
                        'cadastroCpf',
                        traducoes[lang].cpfInvalid,
                        'cpfInvalid'
                    );
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                } else {
                    let usuarios =
                        JSON.parse(localStorage.getItem('usuarios')) || [];
                    if (
                        usuarios.some(
                            (u) => u.cpf && u.cpf.replace(/\D/g, '') === cpf
                        )
                    ) {
                        mostrarErro(
                            'cadastroCpf',
                            traducoes[lang].cpfExists,
                            'cpfExists'
                        );
                        e.target.classList.remove('valid');
                        e.target.classList.add('invalid');
                    } else {
                        const errorMsg =
                            e.target.parentNode.querySelector('.error-message');
                        if (errorMsg) errorMsg.remove();
                        e.target.classList.remove('invalid');
                        e.target.classList.add('valid');
                    }
                }
            }
        });
        cpfInput.addEventListener('blur', function (e) {
            let cpf = e.target.value.replace(/\D/g, '');
            if (cpf.length === 11) {
                let usuarios =
                    JSON.parse(localStorage.getItem('usuarios')) || [];
                if (
                    usuarios.some(
                        (u) => u.cpf && u.cpf.replace(/\D/g, '') === cpf
                    )
                ) {
                    mostrarErro(
                        'cadastroCpf',
                        traducoes[lang].cpfExists,
                        'cpfExists'
                    );
                    applyShakeEffect(e.target);
                }
            }
        });
    }

    // ----- Celular: formatação, validação de quantidade e duplicidade -----
    if (celularInput) {
        celularInput.addEventListener('input', function (e) {
            let celular = e.target.value.replace(/\D/g, '');
            celular = celular.substring(0, 11);
            if (celular.length > 0)
                celular = celular.replace(/^(\d{2})(\d)/g, '($1) $2');
            if (celular.length > 10)
                celular = celular.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = celular;
            const digits = celular.replace(/\D/g, '').length;
            if (digits < 10) {
                mostrarErro(
                    'cadastroCelular',
                    traducoes[lang].phoneInvalid,
                    'phoneInvalid'
                );
                e.target.classList.remove('valid');
                e.target.classList.add('invalid');
            } else if (digits >= 10 && digits <= 11) {
                let usuarios =
                    JSON.parse(localStorage.getItem('usuarios')) || [];
                if (
                    usuarios.some(
                        (u) =>
                            u.celular &&
                            u.celular.replace(/\D/g, '') ===
                                celular.replace(/\D/g, '')
                    )
                ) {
                    mostrarErro(
                        'cadastroCelular',
                        traducoes[lang].phoneExists,
                        'phoneExists'
                    );
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                } else {
                    const errorMsg =
                        e.target.parentNode.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                    e.target.classList.remove('invalid');
                    e.target.classList.add('valid');
                }
            }
        });
        celularInput.addEventListener('blur', function (e) {
            let celular = e.target.value.replace(/\D/g, '');
            if (celular.length < 10) {
                mostrarErro(
                    'cadastroCelular',
                    traducoes[lang].phoneInvalid,
                    'phoneInvalid'
                );
                e.target.classList.remove('valid');
                e.target.classList.add('invalid');
            } else {
                let usuarios =
                    JSON.parse(localStorage.getItem('usuarios')) || [];
                if (
                    usuarios.some(
                        (u) =>
                            u.celular &&
                            u.celular.replace(/\D/g, '') === celular
                    )
                ) {
                    mostrarErro(
                        'cadastroCelular',
                        traducoes[lang].phoneExists,
                        'phoneExists'
                    );
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                }
            }
        });
    }

    // ----- CEP: formatação, validação de quantidade e busca de endereço -----
    if (cepInput) {
        cepInput.addEventListener('input', function (e) {
            let cep = e.target.value.replace(/\D/g, '');
            cep = cep.substring(0, 8);
            if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
            e.target.value = cep;
            if (cep.length < 8) {
                mostrarErro(
                    e.target.id,
                    traducoes[lang].cepInvalid,
                    'cepInvalid'
                );
                e.target.classList.remove('valid');
                e.target.classList.add('invalid');
            } else if (cep.length === 8) {
                // A verificação final será feita no blur com a API
            }
        });
        cepInput.addEventListener('blur', async function (e) {
            const cep = e.target.value.replace(/\D/g, '');
            if (cep.length !== 8) return;
            try {
                const response = await fetch(
                    `https://viacep.com.br/ws/${cep}/json/`
                );
                const data = await response.json();
                if (data.erro) {
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                    mostrarErro(
                        e.target.id,
                        traducoes[lang].cepInvalid,
                        'cepInvalid'
                    );
                    return;
                }
                const enderecoInput =
                    document.getElementById('cadastroEndereco');
                if (enderecoInput) {
                    enderecoInput.value = `${data.logradouro || ''}, ${
                        data.bairro || ''
                    }, ${data.localidade || ''} - ${data.uf || ''}`;
                    const errorMsg = e.target.nextElementSibling;
                    if (
                        errorMsg &&
                        errorMsg.classList.contains('error-message')
                    ) {
                        errorMsg.remove();
                    }
                    e.target.classList.remove('invalid');
                    e.target.classList.add('valid');
                }
            } catch (error) {
                e.target.classList.remove('valid');
                e.target.classList.add('invalid');
                mostrarErro(
                    e.target.id,
                    traducoes[lang].cepInvalid,
                    'cepInvalid'
                );
            }
        });
    }

    // ----- CNH: formatação, validação de quantidade, validade e duplicidade -----
    if (cnhInput) {
        cnhInput.addEventListener('input', function (e) {
            let cnh = e.target.value.replace(/\D/g, '');
            cnh = cnh.substring(0, 11);
            e.target.value = cnh;
            if (cnh.length < 11) {
                mostrarErro(
                    'cadastroCnh',
                    traducoes[lang].cnhInvalid,
                    'cnhInvalid'
                );
                e.target.classList.remove('valid');
                e.target.classList.add('invalid');
            } else if (cnh.length === 11 && validarCNH(cnh)) {
                let usuarios =
                    JSON.parse(localStorage.getItem('usuarios')) || [];
                if (
                    usuarios.some(
                        (u) => u.cnh && u.cnh.replace(/\D/g, '') === cnh
                    )
                ) {
                    mostrarErro(
                        'cadastroCnh',
                        traducoes[lang].cnhExists,
                        'cnhExists'
                    );
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                } else {
                    const errorMsg =
                        e.target.parentNode.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                    e.target.classList.remove('invalid');
                    e.target.classList.add('valid');
                }
            } else {
                e.target.classList.remove('valid', 'invalid');
            }
        });
        cnhInput.addEventListener('blur', function (e) {
            let cnh = e.target.value.replace(/\D/g, '');
            if (cnh !== '') {
                let usuarios =
                    JSON.parse(localStorage.getItem('usuarios')) || [];
                if (
                    usuarios.some(
                        (u) => u.cnh && u.cnh.replace(/\D/g, '') === cnh
                    )
                ) {
                    mostrarErro(
                        'cadastroCnh',
                        traducoes[lang].cnhExists,
                        'cnhExists'
                    );
                    applyShakeEffect(e.target);
                }
            }
        });
    }

    // ----- Senhas: verificação de força e confirmação -----
    if (senhaInput) {
        senhaInput.addEventListener('input', updatePasswordStrength);
    }
    if (confirmarSenhaInput) {
        confirmarSenhaInput.addEventListener('input', checkPasswordMatch);
    }

    // ----- Listener para o submit do formulário de cadastro -----
    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validarPassoAtual()) {
                cadastrarUsuario(e);
            }
        });
    }

    // Atualiza o progresso inicial
    atualizarProgresso();
}

function applyShakeEffect(element) {
    if (!element) return;
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Atualiza os textos do cadastro (útil quando muda o idioma)
function atualizarTextosCadastro() {
    const formTitle = document.querySelector('#formCadastro .form-title');
    if (formTitle) formTitle.textContent = traducoes[lang].formTitle;

    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.textContent = `${traducoes[lang].proximo} ${currentStep} ${traducoes[lang].de} ${totalSteps}`;
    }

    // Atualiza os labels dos campos
    const campos = {
        'tipoUsuario-group': { label: traducoes[lang].tipoUsuario },
        cadastroNome: {
            label: traducoes[lang].nome,
            placeholder: traducoes[lang].nome,
        },
        cadastroEmail: {
            label: traducoes[lang].emailLabel,
            placeholder: traducoes[lang].emailLabel,
        },
        cadastroCelular: {
            label: traducoes[lang].celular,
            placeholder: traducoes[lang].celular,
        },
        cadastroCpf: {
            label: traducoes[lang].cpf,
            placeholder: traducoes[lang].cpf,
        },
        cadastroCep: {
            label: traducoes[lang].cep,
            placeholder: traducoes[lang].cep,
        },
        cadastroEndereco: {
            label: traducoes[lang].endereco,
            placeholder: traducoes[lang].endereco,
        },
        cadastroCnh: {
            label: traducoes[lang].cnh,
            placeholder: traducoes[lang].cnh,
        },
        cadastroSenha: {
            label: traducoes[lang].senhaLabel,
            placeholder: traducoes[lang].senhaLabel,
        },
        cadastroConfirmarSenha: {
            label: traducoes[lang].confirmarSenha,
            placeholder: traducoes[lang].confirmarSenha,
        },
    };

    for (const [id, config] of Object.entries(campos)) {
        const element = document.getElementById(id);
        if (element) {
            if (element.classList.contains('input-group')) {
                const label = element.querySelector('.input-label');
                if (label) label.textContent = config.label;
            } else {
                element.placeholder = config.placeholder;
                const label = element.previousElementSibling;
                if (label && label.classList.contains('input-label')) {
                    label.textContent = config.label;
                }
            }
        }
    }

    const radios = document.querySelectorAll('.radio-option');
    if (radios.length >= 2) {
        radios[0].querySelector('.radio-label').textContent =
            traducoes[lang].locador;
        radios[1].querySelector('.radio-label').textContent =
            traducoes[lang].locatario;
    }

    document.querySelectorAll('.btn-next').forEach((btn) => {
        btn.textContent = traducoes[lang].proximo;
    });

    document.querySelectorAll('.btn-back').forEach((btn) => {
        btn.textContent = traducoes[lang].voltar;
    });

    const btnPrimary = document.querySelector('#formCadastro .btn-primary');
    if (btnPrimary) btnPrimary.textContent = traducoes[lang].cadastrar;

    const formFooter = document.querySelector('#formCadastro .form-footer');
    if (formFooter) {
        formFooter.innerHTML = `${traducoes[lang].footerCadastro} <a href="#" class="form-link" onclick="voltarParaLogin()">${traducoes[lang].entrar}</a>`;
    }

    const tipoUsuario = document.querySelector(
        'input[name="tipoUsuario"]:checked'
    );
    if (tipoUsuario && tipoUsuario.value === 'locador') {
        document.querySelector('#dynamicText strong').textContent =
            traducoes[lang].cadastre;
    } else {
        document.querySelector('#dynamicText strong').textContent =
            traducoes[lang].localize;
    }

    // Força a atualização dos labels para os campos de senha na etapa 3
    document.querySelector("label[for='cadastroSenha']").textContent =
        traducoes[lang].senhaLabel;
    document.querySelector("label[for='cadastroConfirmarSenha']").textContent =
        traducoes[lang].confirmarSenha;

    // Atualiza as mensagens de força da senha e confirmação
    updatePasswordStrength();
    checkPasswordMatch();
}

// Funções de navegação entre etapas do cadastro
function proximoPasso() {
    if (!validarPassoAtual()) return;

    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.remove('active-step');
    } else {
        console.error(`Elemento da etapa ${currentStep} não encontrado.`);
        return;
    }

    currentStep++;
    const nextStepElement = document.getElementById(`step-${currentStep}`);
    if (nextStepElement) {
        nextStepElement.classList.add('active-step');
    } else {
        console.error(`Elemento da etapa ${currentStep} não encontrado.`);
        return;
    }

    atualizarProgresso();
}

function anteriorPasso() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.remove('active-step');
    } else {
        console.error(`Elemento da etapa ${currentStep} não encontrado.`);
        return;
    }

    currentStep--;
    const previousStepElement = document.getElementById(`step-${currentStep}`);
    if (previousStepElement) {
        previousStepElement.classList.add('active-step');
    } else {
        console.error(`Elemento da etapa ${currentStep} não encontrado.`);
        return;
    }

    atualizarProgresso();
}

function atualizarProgresso() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    if (!progressBar || !progressText) {
        console.error('Elemento de progresso não encontrado.');
        return;
    }
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${traducoes[lang].proximo} ${currentStep} ${traducoes[lang].de} ${totalSteps}`;
}

// Função de validação do cadastro por etapa
function validarPassoAtual() {
    limparErros();
    let isValid = true;

    if (currentStep === 1) {
        const tipoUsuario = document.querySelector(
            'input[name="tipoUsuario"]:checked'
        );
        const nome = document.getElementById('cadastroNome')
            ? document.getElementById('cadastroNome').value.trim()
            : '';
        const email = document.getElementById('cadastroEmail')
            ? document.getElementById('cadastroEmail').value.trim()
            : '';

        if (!tipoUsuario) {
            mostrarErroGrupo(
                'tipoUsuario-group',
                traducoes[lang].userTypeRequired
            );
            isValid = false;
        }

        if (!nome) {
            mostrarErro('cadastroNome', traducoes[lang].nameRequired);
            applyShakeEffect(document.getElementById('cadastroNome'));
            isValid = false;
        } else if (nome.length < 7 || /[!@#$%^&*(),.?":{}|<>]/.test(nome)) {
            mostrarErro('cadastroNome', traducoes[lang].nameInvalid);
            applyShakeEffect(document.getElementById('cadastroNome'));
            isValid = false;
        }

        if (!email) {
            mostrarErro('cadastroEmail', traducoes[lang].emailRequired);
            applyShakeEffect(document.getElementById('cadastroEmail'));
            isValid = false;
        } else if (!validarEmail(email)) {
            mostrarErro('cadastroEmail', traducoes[lang].emailInvalid);
            applyShakeEffect(document.getElementById('cadastroEmail'));
            isValid = false;
        }

        if (!nome) {
            mostrarErro('cadastroNome', traducoes[lang].nameRequired);
            isValid = false;
        } else if (nome.length < 7 || /[!@#$%^&*(),.?":{}|<>]/.test(nome)) {
            mostrarErro('cadastroNome', traducoes[lang].nameInvalid);
            isValid = false;
        }

        if (!email) {
            mostrarErro('cadastroEmail', traducoes[lang].emailRequired);
            isValid = false;
            // Verifica se o e-mail já está cadastrado
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            if (
                usuarios.some(
                    (u) => u.email.toLowerCase() === email.toLowerCase()
                )
            ) {
                mostrarErro('cadastroEmail', traducoes[lang].emailExists);
                isValid = false;
            }
        } else if (!validarEmail(email)) {
            mostrarErro('cadastroEmail', traducoes[lang].emailInvalid);
            isValid = false;
        }
    } else if (currentStep === 2) {
        const celular = document.getElementById('cadastroCelular')
            ? document
                  .getElementById('cadastroCelular')
                  .value.replace(/\D/g, '')
            : '';
        const cpf = document.getElementById('cadastroCpf')
            ? document.getElementById('cadastroCpf').value
            : '';
        const cep = document.getElementById('cadastroCep')
            ? document.getElementById('cadastroCep').value.replace(/\D/g, '')
            : '';
        const endereco = document.getElementById('cadastroEndereco')
            ? document.getElementById('cadastroEndereco').value.trim()
            : '';
        const cnh = document.getElementById('cadastroCnh')
            ? document.getElementById('cadastroCnh').value.trim()
            : '';

        if (!celular) {
            mostrarErro('cadastroCelular', traducoes[lang].phoneRequired);
            isValid = false;
        } else if (celular.length < 10 || celular.length > 11) {
            mostrarErro('cadastroCelular', traducoes[lang].phoneInvalid);
            isValid = false;
        }

        if (!cpf) {
            mostrarErro('cadastroCpf', traducoes[lang].cpfRequired);
            isValid = false;
        } else if (!validarCPF(cpf)) {
            mostrarErro('cadastroCpf', traducoes[lang].cpfInvalid);
            isValid = false;
        }

        if (!cep) {
            mostrarErro('cadastroCep', traducoes[lang].cepRequired);
            isValid = false;
        } else if (cep.length !== 8) {
            mostrarErro('cadastroCep', traducoes[lang].cepInvalid);
            isValid = false;
        }

        if (!endereco) {
            mostrarErro('cadastroEndereco', traducoes[lang].addressRequired);
            isValid = false;
        }

        if (!cnh) {
            mostrarErro('cadastroCnh', traducoes[lang].cnhRequired);
            isValid = false;
        } else if (!validarCNH(cnh)) {
            mostrarErro('cadastroCnh', traducoes[lang].cnhInvalid);
            isValid = false;
        }
    } else if (currentStep === 3) {
        const senha = document.getElementById('cadastroSenha')
            ? document.getElementById('cadastroSenha').value
            : '';
        const confirmarSenha = document.getElementById('cadastroConfirmarSenha')
            ? document.getElementById('cadastroConfirmarSenha').value
            : '';

        if (!senha) {
            mostrarErro('cadastroSenha', traducoes[lang].passwordRequired);
            isValid = false;
        } else if (
            !/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}/.test(senha)
        ) {
            mostrarErro('cadastroSenha', traducoes[lang].passwordInvalid);
            isValid = false;
        }

        if (senha !== confirmarSenha) {
            mostrarErro(
                'cadastroConfirmarSenha',
                traducoes[lang].passwordMatch
            );
            isValid = false;
        }
    }

    return isValid;
}

// Função para atualizar as mensagens de erro quando o idioma mudar
function updateErrorMessagesOnLanguageChange() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach((errorElement) => {
        const errorKey = errorElement.getAttribute('data-error-key');
        if (errorKey && traducoes[lang] && traducoes[lang][errorKey]) {
            errorElement.textContent = traducoes[lang][errorKey];
        }
    });
}

// Funções auxiliares para exibir erros
function mostrarErro(campoId, mensagem, errorKey) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    campo.classList.add('error');
    // Procura se já existe um elemento de erro logo após o campo
    let errorElement = campo.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = mensagem;
        if (errorKey) {
            errorElement.setAttribute('data-error-key', errorKey);
        }
    } else {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = mensagem;
        if (errorKey) {
            errorElement.setAttribute('data-error-key', errorKey);
        }
        campo.parentNode.insertBefore(errorElement, campo.nextSibling);
    }
}

function mostrarErroGrupo(grupoId, mensagem) {
    const grupo = document.getElementById(grupoId);
    if (!grupo) return;

    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = mensagem;
    grupo.appendChild(errorElement);
}

function limparErros() {
    document.querySelectorAll('.error').forEach((el) => {
        el.classList.remove('error');
    });

    document.querySelectorAll('.error-message').forEach((el) => {
        el.remove();
    });
}

// Funções de formatação
function formatarCPF(e) {
    let cpf = e.target.value.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = cpf;
}

function formatarCelular(e) {
    let celular = e.target.value.replace(/\D/g, '');
    celular = celular.replace(/^(\d{2})(\d)/g, '($1) $2');
    celular = celular.replace(/(\d{5})(\d)/, '$1-$2');
    e.target.value = celular;
}

function formatarCEP(e) {
    let cep = e.target.value.replace(/\D/g, '');
    cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    e.target.value = cep;
}

function formatarCNH(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
}

// Busca o endereço via CEP e preenche o campo de endereço
async function buscarEnderecoPorCEP(e) {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            mostrarErro(e.target.id, traducoes[lang].cepInvalid);
            return;
        }

        const enderecoInput = document.getElementById('cadastroEndereco');
        if (enderecoInput) {
            enderecoInput.value = `${data.logradouro || ''}, ${
                data.bairro || ''
            }, ${data.localidade || ''} - ${data.uf || ''}`;
        }
    } catch (error) {
        mostrarErro(e.target.id, traducoes[lang].cepInvalid);
    }
}

// Funções de validação de e-mail e CPF
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
}

// Função para cadastrar usuário
function cadastrarUsuario(e) {
    e.preventDefault();

    if (!validarPassoAtual()) return;

    // Coleta os dados do formulário
    const tipoUsuario = document.querySelector(
        'input[name="tipoUsuario"]:checked'
    ).value;
    const nome = document.getElementById('cadastroNome').value.trim();
    const email = document.getElementById('cadastroEmail').value.trim();
    const celular = document
        .getElementById('cadastroCelular')
        .value.replace(/\D/g, '');
    const cpf = document.getElementById('cadastroCpf').value.replace(/\D/g, '');
    const cep = document.getElementById('cadastroCep').value.replace(/\D/g, '');
    const endereco = document.getElementById('cadastroEndereco').value.trim();
    const cnh = document.getElementById('cadastroCnh').value.trim();
    const senha = document.getElementById('cadastroSenha').value;

    // Cria um ID único (usando o timestamp, por exemplo)
    const id = 'u' + Date.now();

    // Cria o objeto do usuário – status inicial "pendente" (você pode definir como "aprovado" se preferir)
    const novoUsuario = {
        id,
        tipoUsuario,
        nome,
        email,
        celular,
        cpf,
        cep,
        endereco,
        cnh,
        senha,
        status: 'pendente', // ou "aprovado" se desejar outro fluxo
    };

    // Recupera os usuários já cadastrados e adiciona o novo
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Mostra o modal de sucesso e volta para o login
    Swal.fire({
        icon: 'success',
        title: traducoes[lang].cadastroSuccess,
        text: `${traducoes[lang].nome}: ${nome}\n${traducoes[lang].emailLabel}: ${email}`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
    }).then(() => {
        voltarParaLogin();
    });
}

// Função para lidar com o login
function handleLogin(email, password) {
    if (!email) {
        showLoginError(traducoes[lang].emailRequired);
        return;
    }
    if (!validarEmail(email)) {
        showLoginError(traducoes[lang].invalidEmailFormat);
        return;
    }
    if (!password) {
        showLoginError(traducoes[lang].passwordRequired);
        return;
    }

    // Busca o usuário no localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    let usuario = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!usuario) {
        showLoginError(traducoes[lang].userNotFound);
        return;
    }
    if (usuario.senha !== password) {
        showLoginError(traducoes[lang].wrongPassword);
        return;
    }

    // Verifica se o usuário foi aprovado
    if (usuario.status !== 'aprovado') {
        let msg = '';
        if (usuario.status === 'pendente') {
            msg =
                traducoes[lang].userNotAuthorizedPending ||
                'Seu cadastro ainda está pendente de aprovação.';
        } else if (usuario.status === 'recusado') {
            msg = traducoes[lang].userRejected || 'Seu cadastro foi recusado.';
        } else {
            msg =
                traducoes[lang].userNotAuthorized || 'Usuário não autorizado.';
        }
        showLoginError(msg);
        return;
    }

    // Armazena a sessão de usuário logado para evitar redirecionamentos incorretos
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

    // Login bem-sucedido: redireciona conforme o tipo de usuário
    Swal.fire({
        icon: 'success',
        title: traducoes[lang].loginSuccess,
        showConfirmButton: false,
        timer: 1500,
    }).then(() => {
        if (
            usuario.tipoUsuario === 'admin' ||
            usuario.tipoUsuario === 'administrador'
        ) {
            window.location.href = 'painel-admin.html';
        } else if (usuario.tipoUsuario === 'locador') {
            window.location.href = 'painel-locador.html';
        } else if (usuario.tipoUsuario === 'locatario') {
            window.location.href = 'painel-locatario.html';
        } else {
            // Redirecionamento padrão (opcional)
            window.location.href = 'index.html';
        }
    });
}

// Função para mostrar erros de login
function showLoginError(message) {
    Swal.fire({
        icon: 'error',
        title: traducoes[lang].loginError,
        text: message,
        confirmButtonColor: '#2563eb',
    });
}

// Inicialização: configura o link de cadastro e o submit do login
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(getStoredLanguage());

    // Define o idioma armazenado ou padrão
    lang = getStoredLanguage();

    // Atualiza o link do footer para cadastro
    document.getElementById(
        'footerText'
    ).innerHTML = `${traducoes[lang].footer}<a href="#" class="form-link" onclick="mostrarCadastro()">${traducoes[lang].btnCadastrar}</a>`;

    // Inicializa o formulário de login
    document
        .getElementById('formLogin')
        .addEventListener('submit', function (e) {
            e.preventDefault();
            const emailField = document.getElementById('email');
            const senhaField = document.getElementById('senha');
            const email = emailField.value.trim();
            const senha = senhaField.value.trim();

            if (!email) {
                applyShakeEffect(emailField);
                showLoginError(traducoes[lang].emailRequired);
                return;
            }
            if (!validarEmail(email)) {
                applyShakeEffect(emailField);
                showLoginError(traducoes[lang].invalidEmailFormat);
                return;
            }
            if (!senha) {
                applyShakeEffect(senhaField);
                showLoginError(traducoes[lang].passwordRequired);
                return;
            }
            // Chama a função já atualizada handleLogin (que também verifica o status do usuário)
            handleLogin(email, senha);
        });

    // Inicia o efeito de digitação
    escrever();
});
