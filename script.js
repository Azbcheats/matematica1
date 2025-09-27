function toggleFormula(botao, formula) {
  let resposta = botao.nextElementSibling;
  resposta.textContent = resposta.textContent ? "" : formula;
}

let chart;

function plotQuadratic() {
  const funcStr = document.getElementById('funcInput').value.trim();
  if (!funcStr) {
    alert("Digite uma função!");
    return;
  }

  let xValues = [], yValues = [];
  let maxY = -Infinity, minY = Infinity;

  for (let x = -20; x <= 20; x += 0.1) {
    try {
      let y = eval(funcStr.replace(/x/g, `(${x})`));
      if (typeof y === "number" && !isNaN(y) && isFinite(y)) {
        xValues.push(x.toFixed(1));
        yValues.push(y);
        if (y > maxY) { maxY = y; }
        if (y < minY) { minY = y; }
      }
    } catch(e) {}
  }

  if (!xValues.length) {
    alert("Função inválida.");
    return;
  }

  const ctx = document.getElementById('functionChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xValues,
      datasets: [{ label: `y = ${funcStr}`, data: yValues, borderColor: 'red', borderWidth: 2, fill: false }]
    }
  });
}

function verificarQuiz() {
  const resposta = document.getElementById('quizResposta').value;
  const feedback = document.getElementById('quizFeedback');
  if (resposta.trim() === "Lorenzo"){
    feedback.textContent = "✅ Correto!";
    feedback.style.color = "lightgreen";
    adicionarPontuacao(100);
    atualizarProgresso(100);
  } else {
    feedback.textContent = "❌ Tente novamente!";
    feedback.style.color = "red";
  }
}

function adicionarPontuacao(valor) {
  let pontos = parseInt(localStorage.getItem("pontos") || "0");
  pontos += valor;
  localStorage.setItem("pontos", pontos);
  document.getElementById("pontuacao").textContent = pontos;
}

function atualizarProgresso() {
  let pontos = parseInt(localStorage.getItem("pontos") || "0");
  let progresso = Math.min(100, pontos);
  document.getElementById("progresso").style.width = progresso + "%";
  document.getElementById("texto-progresso").textContent = `Progresso: ${progresso}%`;
}

function salvarNotas() {
  const notas = document.getElementById("notas").value;
  localStorage.setItem("notas", notas);
  alert("Notas salvas!");
}

function carregarNotas() {
  const notas = localStorage.getItem("notas") || "";
  document.getElementById("notas").value = notas;
}

function enviarMensagem() {
  const msg = document.getElementById("mensagem").value;
  if (!msg.trim()) return;
  const chatBox = document.getElementById("chat-box");
  const msgDiv = document.createElement("div");
  msgDiv.textContent = "Você: " + msg;
  chatBox.appendChild(msgDiv);
  document.getElementById("mensagem").value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Estudo Matemática", 10, 10);
  doc.text("Notas:\n" + document.getElementById("notas").value, 10, 20);
  doc.save("estudo.pdf");
}

window.onload = function() {
  document.getElementById("pontuacao").textContent = localStorage.getItem("pontos") || "0";
  atualizarProgresso();
  carregarNotas();
};
