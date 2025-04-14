// Função para gerar um ID único
function gerarIdUnico(prefixo = 'id') {
  return prefixo + '_' + Math.floor(Math.random() * 1000000);
}

// Cria a conta admin padrão se não existir
function criarContaAdminPadrao() {
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const adminExiste = usuarios.some(u => u.email === 'admin@locar.com');
  if (!adminExiste) {
    const admin = {
      id: gerarIdUnico(),
      nome: 'Administrador',
      email: 'admin@locar.com',
      senha: '123456',
      tipoUsuario: 'admin',
      status: 'aprovado'
    };
    usuarios.push(admin);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }
}

// Cadastro de usuários
const cadastroForm = document.getElementById('formCadastro');
if (cadastroForm) {
  cadastroForm.addEventListener('submit', cadastrarUsuario);
  const tipoUsuarioRadios = document.getElementsByName('tipoUsuario');
  tipoUsuarioRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const info = document.getElementById('infoTipoUsuario');
      if (radio.value === 'locador') {
        info.textContent = 'Você está se cadastrando para disponibilizar veículos.';
      } else {
        info.textContent = 'Você está se cadastrando para alugar veículos.';
      }
    });
  });
}

async function cadastrarUsuario(event) {
  event.preventDefault();
  mostrarLoader();
  const tipoUsuario = document.querySelector('input[name="tipoUsuario"]:checked')?.value;
  const nome = document.getElementById('cadastroNome')?.value.trim();
  const email = document.getElementById('cadastroEmail')?.value.trim();
  const celular = document.getElementById('cadastroCelular')?.value.trim();
  const cpf = document.getElementById('cadastroCpf')?.value.trim();
  const endereco = document.getElementById('cadastroEndereco')?.value.trim();
  const cnh = document.getElementById('cadastroCnh')?.value.trim();
  const senha = document.getElementById('cadastroSenha')?.value;
  const confirmarSenha = document.getElementById('cadastroConfirmarSenha')?.value;

  if (!validarCPF(cpf)) {
    await Swal.fire({ icon: 'error', title: 'CPF inválido', text: 'Por favor, verifique o CPF.', confirmButtonColor: '#2563eb' });
    esconderLoader();
    return;
  }
  if (!nome || !email || !senha || !confirmarSenha) {
    await Swal.fire({ icon: 'error', title: 'Campos obrigatórios', text: 'Por favor, preencha todos os campos.', confirmButtonColor: '#2563eb' });
    esconderLoader();
    return;
  }
  if (senha !== confirmarSenha) {
    await Swal.fire({ icon: 'error', title: 'Senhas diferentes', text: 'As senhas não coincidem.', confirmButtonColor: '#2563eb' });
    esconderLoader();
    return;
  }
  const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios')) || [];
  const emailJaCadastrado = usuariosExistentes.some((user) => user.email === email);
  if (emailJaCadastrado) {
    await Swal.fire({ icon: 'error', title: 'E-mail já cadastrado', text: 'Por favor, use outro e-mail.', confirmButtonColor: '#2563eb' });
    esconderLoader();
    return;
  }
  const novoUsuario = {
    id: gerarIdUnico(),
    tipoUsuario,
    nome,
    email,
    celular,
    cpf,
    endereco,
    cnh,
    senha,
    status: 'pendente'
  };
  usuariosExistentes.push(novoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuariosExistentes));
  esconderLoader();

  await Swal.fire({
    icon: 'success',
    title: 'Cadastro realizado!',
    text: 'Seu cadastro foi enviado para aprovação. Você receberá um e-mail quando for aprovado.',
    confirmButtonText: 'OK',
    confirmButtonColor: '#2563eb'
  });

  window.location.href = 'index.html';
}

// Login de usuários
const formLogin = document.getElementById('formLogin');
if (formLogin) {
  formLogin.addEventListener('submit', realizarLogin);
}

async function realizarLogin(event) {
  event.preventDefault();
  mostrarLoader();
  const email = document.getElementById('email')?.value.trim();
  const senha = document.getElementById('senha')?.value.trim();
  const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuarioEncontrado = usuariosExistentes.find((user) => user.email === email && user.senha === senha);

  esconderLoader();

  if (!usuarioEncontrado) {
    await Swal.fire({ icon: 'error', title: 'Falha no login', text: 'E-mail ou senha incorretos.', confirmButtonColor: '#2563eb' });
    return;
  }

  if (usuarioEncontrado.status === 'pendente') {
    await Swal.fire({ icon: 'info', title: 'Cadastro pendente', text: 'Seu cadastro ainda está em análise. Aguarde a aprovação.', confirmButtonColor: '#2563eb' });
    return;
  }

  if (usuarioEncontrado.status === 'bloqueado') {
    await Swal.fire({ icon: 'error', title: 'Conta bloqueada', text: 'Sua conta foi bloqueada. Entre em contato com o suporte.', confirmButtonColor: '#2563eb' });
    return;
  }

  if (usuarioEncontrado.status === 'excluido') {
    await Swal.fire({ icon: 'error', title: 'Conta excluída', text: 'Sua conta foi excluída.', confirmButtonColor: '#2563eb' });
    return;
  }

  if (usuarioEncontrado.status === 'aprovado') {
    await Swal.fire({ icon: 'success', title: 'Cadastro aprovado!', text: 'Seu cadastro foi aprovado. Bem-vindo ao LoCar!', confirmButtonColor: '#2563eb' });
  }

  localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));

  setTimeout(() => {
    if (usuarioEncontrado.tipoUsuario === 'admin') {
      window.location.href = 'painel-admin.html';
    } else if (usuarioEncontrado.tipoUsuario === 'locador') {
      window.location.href = 'painel-locador.html';
    } else if (usuarioEncontrado.tipoUsuario === 'locatario') {
      window.location.href = 'painel-locatario.html';
    } else {
      window.location.href = 'index.html';
    }
  }, 1000);
}

// Loader global
function mostrarLoader(mensagem = 'Carregando...') {
  const loader = document.getElementById('globalLoader');
  if (loader) {
    const loaderMensagem = loader.querySelector('p');
    loader.style.display = 'flex';
    if (loaderMensagem) loaderMensagem.textContent = mensagem;
  } else {
    console.error('Elemento #globalLoader não encontrado!');
  }
}

function esconderLoader() {
  const loader = document.getElementById('globalLoader');
  if (loader) loader.style.display = 'none';
}

// Ripple effect e controle de tema
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.style.setProperty('--x', `${x}px`);
      this.style.setProperty('--y', `${y}px`);
    });
  });

  const toggleThemeBtn = document.getElementById('toggleTheme');
  if (toggleThemeBtn) {
    toggleThemeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }

  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.style.display = 'none';
      }, 500);
    }, 1500);
  }
});

// Inicia a conta admin padrão
document.addEventListener('DOMContentLoaded', () => {
  criarContaAdminPadrao();
});
