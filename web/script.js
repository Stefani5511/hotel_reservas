const API = "http://localhost:3000";

let quartoSelecionado = null;
let reservaSelecionada = null;

function mostrarTela(id) {
    document.querySelectorAll(".screen").forEach(e => e.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

async function carregarQuartos() {
    const res = await fetch(`${API}/quartos`);
    const dados = await res.json();

    const tbody = document.getElementById("listaQuartos");
    tbody.innerHTML = "";

    dados.forEach(q => {
        tbody.innerHTML += `
            <tr>
                <td>${q.numero}</td>
                <td>${q.tipo}</td>
                <td>
                    <button class="btn-ver" onclick="abrirReservas(${q.id}, '${q.numero}', '${q.tipo}')">Ver Reservas</button>
                    <button class="btn-excluir" onclick="abrirModalQuarto(${q.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

async function abrirReservas(id, numero, tipo) {
    quartoSelecionado = id;

    document.getElementById("tituloQuarto").innerText = `Quarto ${numero}`;
    document.getElementById("subtituloQuarto").innerText = `Tipo: ${tipo}`;

    mostrarTela("telaReservas");

    const res = await fetch(`${API}/reservas/quarto/${id}`);
    const dados = await res.json();

    const tbody = document.getElementById("listaReservas");
    tbody.innerHTML = "";

    dados.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${r.hospede}</td>
                <td>${r.data_entrada}</td>
                <td>${r.data_saida}</td>
                <td>
                    <button class="btn-excluir" onclick="abrirModalReserva(${r.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

document.getElementById("btnNovoQuarto").onclick = () => {
    mostrarTela("telaCadastroQuarto");
};

document.getElementById("voltarQuarto").onclick = () => {
    mostrarTela("telaQuartos");
};

document.getElementById("voltarReservas").onclick = () => {
    mostrarTela("telaQuartos");
};

document.getElementById("btnNovaReserva").onclick = () => {
    document.getElementById("quartoId").value = quartoSelecionado;
    mostrarTela("telaCadastroReserva");
};

document.getElementById("voltarReserva").onclick = () => {
    mostrarTela("telaReservas");
};

document.getElementById("formQuarto").onsubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API}/quartos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            numero: document.getElementById("numeroQuarto").value,
            tipo: document.getElementById("tipoQuarto").value
        })
    });

    mostrarTela("telaQuartos");
    carregarQuartos();
};

document.getElementById("formReserva").onsubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            hospede: document.getElementById("hospede").value,
            data_entrada: document.getElementById("dataEntrada").value,
            data_saida: document.getElementById("dataSaida").value,
            quarto_id: quartoSelecionado
        })
    });

    abrirReservas(quartoSelecionado);
    mostrarTela("telaReservas");
};

function abrirModalQuarto(id) {
    reservaSelecionada = id;
    document.getElementById("modalQuarto").classList.add("active");
}

function abrirModalReserva(id) {
    reservaSelecionada = id;
    document.getElementById("modalReserva").classList.add("active");
}

document.getElementById("confirmarExcluirQuarto").onclick = async () => {
    await fetch(`${API}/quartos/${reservaSelecionada}`, { method: "DELETE" });
    document.getElementById("modalQuarto").classList.remove("active");
    carregarQuartos();
    mostrarTela("telaQuartos");
};

document.getElementById("confirmarExcluirReserva").onclick = async () => {
    await fetch(`${API}/reservas/${reservaSelecionada}`, { method: "DELETE" });
    document.getElementById("modalReserva").classList.remove("active");
    abrirReservas(quartoSelecionado);
};

document.querySelectorAll(".close-modal").forEach(b => {
    b.onclick = () => {
        document.getElementById("modalQuarto").classList.remove("active");
        document.getElementById("modalReserva").classList.remove("active");
    };
});

carregarQuartos();
mostrarTela("telaQuartos");

document.getElementById("btnMenuQuartos").onclick = () => {
    mostrarTela("telaQuartos");
};

document.getElementById("btnMenuReservas").onclick = () => {
    if (quartoSelecionado) {
        mostrarTela("telaReservas");
    } else {
        alert("Selecione um quarto primeiro.");
    }
};

document.getElementById("btnMenuSobre").onclick = () => {
    alert("Sistema Hotel Reservas");
};