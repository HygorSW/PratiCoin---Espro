(() => {
  const profiles = {
    conservative: { pessimistic: 0.04, expected: 0.08, optimistic: 0.11 },
    moderate: { pessimistic: 0.06, expected: 0.11, optimistic: 0.16 },
    aggressive: { pessimistic: 0.08, expected: 0.15, optimistic: 0.22 }
  };
  const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
  const number = id => Number(document.getElementById(id)?.value ?? 0);

  // Taxa anual efetiva convertida em taxa mensal equivalente.
  // Aportes são considerados ao fim de cada mês.
  function futureValue(initial, monthly, annualRate, years) {
    const months = Math.round(years * 12);
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    if (monthlyRate === 0) return initial + monthly * months;
    return initial * Math.pow(1 + monthlyRate, months) +
      monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  }

  function projectionSeries(initial, monthly, annualRate, years) {
    const months = Math.round(years * 12);
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    const points = [{ month: 0, value: initial }];
    let balance = initial;
    for (let month = 1; month <= months; month++) {
      balance = balance * (1 + monthlyRate) + monthly;
      if (month % 12 === 0 || month === months) points.push({ month, value: balance });
    }
    return points;
  }

  function renderChart(points) {
    const svg = document.getElementById('projection-chart');
    if (!svg) return;
    const width = 720, height = 280, pad = { left: 62, right: 20, top: 20, bottom: 42 };
    const innerW = width - pad.left - pad.right, innerH = height - pad.top - pad.bottom;
    const maxVal = Math.max(1, ...points.map(p => p.value));
    const x = p => pad.left + (p.month / Math.max(1, points[points.length - 1].month)) * innerW;
    const y = p => pad.top + innerH - (p.value / maxVal) * innerH;
    const coords = points.map(p => `${x(p).toFixed(2)},${y(p).toFixed(2)}`).join(' ');
    const area = `${pad.left},${pad.top + innerH} ${coords} ${x(points[points.length - 1])},${pad.top + innerH}`;
    const grid = [0, .25, .5, .75, 1].map(f => {
      const gy = pad.top + innerH - f * innerH;
      const value = maxVal * f;
      return `<line x1="${pad.left}" y1="${gy}" x2="${width-pad.right}" y2="${gy}" stroke="rgba(255,255,255,.12)" stroke-dasharray="4 5"/><text x="${pad.left-10}" y="${gy+4}" text-anchor="end" fill="#d9c4c7" font-size="11">${compactMoney(value)}</text>`;
    }).join('');
    const labels = points.filter((_, i) => i === 0 || i === points.length - 1 || (points[i].month %  Math.max(12, Math.ceil((points[points.length - 1].month / 4) / 12) * 12) === 0))
      .map(p => `<text x="${x(p)}" y="${height-12}" text-anchor="middle" fill="#d9c4c7" font-size="11">${p.month === 0 ? 'Início' : `${(p.month/12).toLocaleString('pt-BR',{maximumFractionDigits:1})} a`}</text>`).join('');
    svg.innerHTML = `<defs><linearGradient id="projection-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#ffd21a" stop-opacity=".32"/><stop offset="100%" stop-color="#ffd21a" stop-opacity=".015"/></linearGradient></defs>${grid}<polygon points="${area}" fill="url(#projection-fill)"/><polyline points="${coords}" fill="none" stroke="#ffd21a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${labels}`;
  }
  function compactMoney(value) {
    if (value >= 1e6) return `R$ ${(value / 1e6).toLocaleString('pt-BR',{maximumFractionDigits:1})} mi`;
    if (value >= 1e3) return `R$ ${(value / 1e3).toLocaleString('pt-BR',{maximumFractionDigits:0})} mil`;
    return `R$ ${value.toLocaleString('pt-BR',{maximumFractionDigits:0})}`;
  }

  function validInputs(initial, monthly, years) {
    return Number.isFinite(initial) && Number.isFinite(monthly) && Number.isFinite(years) &&
      initial >= 0 && monthly >= 0 && years >= 1 && years <= 80 &&
      initial <= 1e9 && monthly <= 1e7 && Number.isInteger(years);
  }

  function simulate({ updateHome = false } = {}) {
    const initial = number('initial'), monthly = number('monthly'), years = number('years');
    const error = document.getElementById('form-error');
    if (!validInputs(initial, monthly, years)) {
      if (error) {
        error.hidden = false;
        error.textContent = 'Confira os valores: investimento e aporte não podem ser negativos; prazo deve ser um número inteiro entre 1 e 80 anos.';
      }
      return null;
    }
    if (error) error.hidden = true;
    Object.entries(profiles).forEach(([profileName, rates]) => {
      Object.entries(rates).forEach(([scenario, rate]) => {
        const target = document.getElementById(`${profileName}-${scenario}`);
        if (target) target.textContent = money(futureValue(initial, monthly, rate, years));
      });
    });
    const contributed = initial + monthly * years * 12;
    const expected = futureValue(initial, monthly, profiles.moderate.expected, years);
    const contributedEl = document.getElementById('total-contributed');
    const totalEl = document.getElementById('summary-total');
    const gainEl = document.getElementById('summary-gain');
    if (contributedEl) contributedEl.textContent = money(contributed);
    if (totalEl) totalEl.textContent = money(expected);
    if (gainEl) gainEl.textContent = money(expected - contributed);
    renderChart(projectionSeries(initial, monthly, profiles.moderate.expected, years));
    try {
      sessionStorage.setItem('praticoin:lastSimulation', JSON.stringify({ initial, monthly, years }));
    } catch (_) {
      // A simulação continua funcionando mesmo se o armazenamento da sessão não estiver disponível.
    }
    if (updateHome) updateHomePreview(initial, monthly, years);
    return { initial, monthly, years, expected, contributed };
  }

  function updateHomePreview(initial, monthly, years) {
    const total = futureValue(initial, monthly, profiles.moderate.expected, years);
    const totalEl = document.getElementById('home-total');
    const growthEl = document.getElementById('home-growth');
    const line = document.getElementById('home-chart-line');
    const area = document.getElementById('home-chart-area');
    const dots = document.getElementById('home-chart-dots');
    if (totalEl) totalEl.textContent = money(total);
    if (growthEl) growthEl.textContent = '↗ Cenário moderado';
    const points = projectionSeries(initial, monthly, profiles.moderate.expected, years);
    const width = 420, top = 18, bottom = 145, left = 10, right = 410;
    const maxVal = Math.max(1, ...points.map(p => p.value));
    const coords = points.map((p, i) => {
      const px = left + (i / Math.max(1, points.length - 1)) * (right - left);
      const py = bottom - (p.value / maxVal) * (bottom - top);
      return [px, py];
    });
    const pointString = coords.map(([x,y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    if (line) line.setAttribute('points', pointString);
    if (area) area.setAttribute('d', `M${pointString.replaceAll(' ', ' L')} L${right} 150 L${left} 150 Z`);
    if (dots) dots.innerHTML = coords.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('investment-form');
    if (form) {
      form.addEventListener('submit', event => {
        event.preventDefault();
        simulate();
      });
      // Preenche resultados iniciais para que a página não abra vazia.
      simulate();
    }
    // A Home pode reutilizar a mesma lógica de cálculo. Os campos de entrada ficam
    // no simulador; sem dados próprios, a Home exibe a projeção demonstrativa do protótipo.
    if (document.getElementById('home-total')) {
      let inputs = { initial: 25000, monthly: 750, years: 10 };
      let hasPreviousSimulation = false;
      try {
        const saved = sessionStorage.getItem('praticoin:lastSimulation');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (validInputs(parsed.initial, parsed.monthly, parsed.years)) {
            inputs = parsed;
            hasPreviousSimulation = true;
          }
        }
      } catch (_) {
        // Sem dados de sessão, a Home usa a prévia demonstrativa.
      }
      updateHomePreview(inputs.initial, inputs.monthly, inputs.years);
      const total = document.getElementById('home-total');
      if (total) total.title = hasPreviousSimulation
        ? 'Projeção baseada na última simulação desta sessão, usando a taxa hipotética de 11% a.a.'
        : 'Projeção demonstrativa: R$ 25.000 iniciais, R$ 750 mensais, 10 anos e taxa hipotética de 11% a.a.';
      const growth = document.getElementById('home-growth');
      if (growth) growth.textContent = hasPreviousSimulation ? '↗ Última simulação' : '↗ Exemplo didático';
    }
  });
})();
