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
  let vertex = null;

  for (let x = -20; x <= 20; x += 0.1) {
    try {
      let y = eval(funcStr.replace(/x/g, `(${x})`));
      if (typeof y === "number" && !isNaN(y) && isFinite(y)) {
        xValues.push(x.toFixed(1));
        yValues.push(y);
        if (y > maxY) { maxY = y; }
        if (y < minY) { minY = y; }
      }
    } catch(e) {
      console.error(e);
    }
  }

  if (!xValues.length) {
    alert("Função inválida.");
    return;
  }

  vertex = calcularVertice(funcStr);

  const ctx = document.getElementById('functionChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xValues,
      datasets: [
        { label: `y = ${funcStr}`, data: yValues, borderColor: 'red', borderWidth: 2, fill: false, pointRadius: 0 },
        { label: 'Eixo X', data: new Array(xValues.length).fill(0), borderColor: 'black', borderDash: [5, 5], showLine: true, pointRadius: 0 },
        { label: 'Vértice', data: [{x: vertex.x, y: vertex.y}], borderColor: 'green', pointRadius: 6, showLine: false }
      ]
    },
    options: {
      responsive: false,
      scales: {
        x: { title: { display: true, text: 'x' } },
        y: { title: { display: true, text: 'y' } }
      }
    }
  });

  mostrarInfo(vertex, funcStr);
}

function calcularVertice(funcStr) {
  let aMatch = funcStr.match(/([-+]?\d*\.?\d*)\*?x\^?2/);
  let bMatch = funcStr.match(/([-+]?\d*\.?\d*)\*?x(?!\^)/);
  let cMatch = funcStr.match(/([-+]?\d+)(?![^\d]*x)/);

  let a = aMatch ? parseFloat(aMatch[1] || 1) : 0;
  let b = bMatch ? parseFloat(bMatch[1] || 1) : 0;
  let c = cMatch ? parseFloat(cMatch[1]) : 0;

  let xv = -b / (2 * a);
  let yv = a * xv * xv + b * xv + c;

  return {a, b, c, x: xv, y: yv};
}

function mostrarInfo(vertex, funcStr) {
  const infoBox = document.querySelector("#infoBox");

  let concavidade = vertex.a > 0 ? "Para cima" : "Para baixo";
  let tipoVertice = vertex.a > 0 ? "Mínimo" : "Máximo";
  let delta = vertex.b**2 - 4*vertex.a*vertex.c;
  let raizes = calcularRaizes(vertex.a, vertex.b, vertex.c);

  infoBox.innerHTML = `
    <h3>📊 Informações da Função</h3>
    <p><b>Função:</b> y = ${funcStr}</p>
    <p><b>Concavidade:</b> ${concavidade}</p>
    <p><b>Vértice:</b> (${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)}) → ${tipoVertice}</p>
    <p><b>Delta (Δ):</b> ${delta.toFixed(2)}</p>
    <p><b>Raízes reais:</b> ${raizes}</p>
  `;
}

function calcularRaizes(a, b, c) {
  let delta = b**2 - 4*a*c;
  if (delta < 0) return "Não existem raízes reais";
  if (delta === 0) return `${(-b / (2*a)).toFixed(2)}`;
  let x1 = (-b + Math.sqrt(delta)) / (2*a);
  let x2 = (-b - Math.sqrt(delta)) / (2*a);
  return `${x1.toFixed(2)} e ${x2.toFixed(2)}`;
}

function verificarQuiz() {
  const resposta = document.getElementById('quizResposta').value;
  const feedback = document.getElementById('quizFeedback');
  if (resposta.trim() === "4") {
    feedback.textContent = "✅ Correto!";
    feedback.style.color = "lightgreen";
  } else {
    feedback.textContent = "❌ Tente novamente!";
    feedback.style.color = "red";
  }
}
