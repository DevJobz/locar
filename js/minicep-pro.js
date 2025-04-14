// minicep-pro.js

async function buscarEnderecoPorCEP(cep, config = {}) {
    try {
        cep = cep.replace(/\D/g, '');
        if (cep.length !== 8) {
            showNotification('CEP inválido!', 'error');
            limparCamposEndereco(config);
            return;
        }

        mostrarLoader('Buscando CEP...');

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        esconderLoader();

        if (data.erro) {
            showNotification('CEP não encontrado.', 'warning');
            limparCamposEndereco(config);
            return;
        }

        preencherCamposEndereco(data, config);
    } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        esconderLoader();
        showNotification('Erro ao buscar endereço.', 'error');
        limparCamposEndereco(config);
    }
}

function preencherCamposEndereco(data, config) {
    if (config.ruaId) {
        const ruaField = document.getElementById(config.ruaId);
        if (ruaField) ruaField.value = data.logradouro || '';
    }
    if (config.bairroId) {
        const bairroField = document.getElementById(config.bairroId);
        if (bairroField) bairroField.value = data.bairro || '';
    }
    if (config.cidadeId) {
        const cidadeField = document.getElementById(config.cidadeId);
        if (cidadeField) cidadeField.value = data.localidade || '';
    }
    if (config.estadoId) {
        const estadoField = document.getElementById(config.estadoId);
        if (estadoField) estadoField.value = data.uf || '';
    }
    if (config.enderecoCompletoId) {
        const enderecoCompleto = document.getElementById(
            config.enderecoCompletoId
        );
        if (enderecoCompleto) {
            enderecoCompleto.value = `${data.logradouro || ''} ${
                data.bairro || ''
            } - ${data.localidade}/${data.uf || ''}`;
        }
    }
}

function limparCamposEndereco(config = {}) {
    const ids = [
        config.ruaId,
        config.bairroId,
        config.cidadeId,
        config.estadoId,
        config.enderecoCompletoId,
    ];
    ids.forEach((id) => {
        if (id) {
            const field = document.getElementById(id);
            if (field) field.value = '';
        }
    });
}

// Máscara automática de CEP
document.addEventListener('DOMContentLoaded', () => {
    const cepInputs = document.querySelectorAll('input[data-mask="cep"]');

    cepInputs.forEach((input) => {
        input.addEventListener('input', (e) => {
            e.target.value = formatarCEP(e.target.value);

            if (e.target.value.length === 9) {
                buscarEnderecoPorCEP(e.target.value, {
                    ruaId: e.target.dataset.rua,
                    bairroId: e.target.dataset.bairro,
                    cidadeId: e.target.dataset.cidade,
                    estadoId: e.target.dataset.estado,
                    enderecoCompletoId: e.target.dataset.endereco,
                });
            }
        });
    });
});

function formatarCEP(valor) {
    valor = valor.replace(/\D/g, '');
    return valor.length > 5 ? valor.replace(/^(\d{5})(\d)/, '$1-$2') : valor;
}
