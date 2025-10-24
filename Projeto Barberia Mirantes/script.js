const inputData = document.getElementById('data');
const hoje = new Date().toISOString().split('T')[0];
inputData.setAttribute('min', hoje);

const formulario = document.getElementById('formulario');
const mensagemSucesso = document.getElementById('mensagem-sucesso');
const botoesHorario = document.querySelectorAll('.botao-horario');
const inputHorario = document.getElementById('horario');
const listaAgendamentos = document.getElementById('lista-agendamentos');
const inputServico = document.getElementById('servico');

let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

atualizarListaAgendamentos();

botoesHorario.forEach(botao => {
    botao.addEventListener('click', function () {
        if (this.classList.contains('disabled')) return;

        botoesHorario.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        inputHorario.value = this.textContent;
    });
});

function atualizarListaAgendamentos() {
    listaAgendamentos.innerHTML = '';
    agendamentos.forEach((ag, index) => {
        const item = document.createElement('li');
        item.className = 'list-group-item bg-black text-white d-flex justify-content-between align-items-center';

        item.innerHTML = `
            <span>${ag.data} - ${ag.horario} (${ag.servico})</span>
            <button class="btn btn-sm btn-danger" onclick="removerAgendamento(${index})">Remover</button>
        `;

        listaAgendamentos.appendChild(item);
    });

    // Atualiza os horários desativados, se houver data selecionada
    if (inputData.value) {
        desativarHorariosAgendados(inputData.value);
    }
}

function desativarHorariosAgendados(dataSelecionada) {
    botoesHorario.forEach(botao => {
        botao.classList.remove('disabled');
    });

    agendamentos.forEach(ag => {
        if (ag.data === dataSelecionada) {
            botoesHorario.forEach(botao => {
                if (botao.textContent === ag.horario) {
                    botao.classList.add('disabled');
                    botao.classList.remove('selected');
                }
            });
        }
    });
}

function removerAgendamento(index) {
    agendamentos.splice(index, 1);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    atualizarListaAgendamentos();
}

inputData.addEventListener('change', function () {
    desativarHorariosAgendados(this.value);
});

formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!inputServico.value) {
        alert('Por favor, selecione um serviço.');
        return;
    }

    if (!inputHorario.value) {
        alert('Por favor, selecione um horário.');
        return;
    }

    const novoAgendamento = {
        servico: inputServico.value,
        data: inputData.value,
        horario: inputHorario.value
    };

    agendamentos.push(novoAgendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    atualizarListaAgendamentos();

    mensagemSucesso.style.display = 'block';
    formulario.reset();
    botoesHorario.forEach(b => b.classList.remove('selected'));
    inputHorario.value = '';

    setTimeout(() => {
        mensagemSucesso.style.display = 'none';
    }, 3000);
});