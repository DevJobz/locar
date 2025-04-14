// Exibe uma notificação moderna
function showNotification(mensagem, tipo = 'info') {
    const existingNotification = document.getElementById('notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `notification ${tipo}`;

    const icones = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️',
    };

    notification.innerHTML = `
        <div class="notification-content">
            <span class="icon">${icones[tipo] || 'ℹ️'}</span>
            <p>${mensagem}</p>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ========== Loader Global Modernizado ==========
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

// Ripple Effect nos botões
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn').forEach((button) => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.style.setProperty('--x', `${x}px`);
            this.style.setProperty('--y', `${y}px`);
        });
    });
});

// Controle de Dark/Light Mode Manual
document.addEventListener('DOMContentLoaded', () => {
    const toggleThemeBtn = document.getElementById('toggleTheme');
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const theme = document.body.classList.contains('dark-mode')
                ? 'dark'
                : 'light';
            localStorage.setItem('theme', theme);
        });

        // Ao carregar a página
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }
});

// Splash PRO
document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.style.display = 'none';
            }, 500); // 0.5 segundos de animação
        }, 1500); // 1.5 segundos de splash
    }
});
