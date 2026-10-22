// Vídeos locais: coloque os arquivos em assets/video com estes nomes exatos.
// Se preferir usar um vídeo hospedado, preencha embedUrl com a URL de incorporação.
const videoLessons = {
  'poupanca-acoes': {
    title: 'Poupança e Ações',
    subtitle: 'Conceitos básicos de duas formas diferentes de investir.',
    description: 'Compare a simplicidade da poupança com as características, oscilações e riscos do investimento em ações.',
    file: 'assets/video/poupanca-acoes.mp4',
    embedUrl: ''
  },
  'tesouro-direto': {
    title: 'Tesouro Direto',
    subtitle: 'Conheça os títulos públicos e suas diferenças.',
    description: 'Entenda os conceitos de Tesouro Selic, Tesouro Prefixado e Tesouro IPCA+ e os cuidados com prazo e venda antecipada.',
    file: 'assets/video/tesouro-direto.mp4',
    embedUrl: ''
  },
  'lci-lca': {
    title: 'LCI e LCA',
    subtitle: 'Duas modalidades de renda fixa para conhecer.',
    description: 'Aprenda sobre finalidade, prazos, liquidez, emissor e condições de cada letra de crédito.',
    file: 'assets/video/lci-lca.mp4',
    embedUrl: ''
  },
  'cdb': {
    title: 'CDB',
    subtitle: 'Entenda o certificado de depósito bancário.',
    description: 'Conheça como funciona a captação bancária, as formas de remuneração e os fatores a comparar antes de investir.',
    file: 'assets/video/cdb.mp4',
    embedUrl: ''
  },
  'bitcoin': {
    title: 'Bitcoin',
    subtitle: 'Introdução aos criptoativos e seus riscos.',
    description: 'Conheça conceitos fundamentais de Bitcoin, volatilidade, custódia e segurança digital.',
    file: 'assets/video/bitcoin.mp4',
    embedUrl: ''
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const key = params.get('video') || 'poupanca-acoes';
  const lesson = videoLessons[key] || videoLessons['poupanca-acoes'];
  document.title = `${lesson.title} | PRATICOIN`;
  document.querySelector('#player-title').textContent = lesson.title;
  document.querySelector('#player-subtitle').textContent = lesson.subtitle;
  document.querySelector('#player-description').textContent = lesson.description;

  const screen = document.querySelector('#player-screen');
  const status = document.querySelector('#player-status');

  if (lesson.embedUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = lesson.embedUrl;
    iframe.title = lesson.title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    screen.replaceChildren(iframe);
    status.textContent = 'Vídeo online configurado';
  } else {
    const video = document.createElement('video');
    video.className = 'local-video-player';
    video.controls = true;
    video.preload = 'metadata';
    video.playsInline = true;
    video.setAttribute('aria-label', lesson.title);
    const source = document.createElement('source');
    source.src = lesson.file;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.addEventListener('loadedmetadata', () => {
      status.textContent = 'Vídeo pronto para assistir';
    });
    video.addEventListener('error', () => {
      status.textContent = 'Adicione o arquivo MP4 correspondente em assets/video para reproduzir esta aula.';
    });
    screen.replaceChildren(video);
    status.textContent = 'Aguardando arquivo de vídeo';
  }

  const other = document.querySelector('#other-videos');
  Object.entries(videoLessons).filter(([id]) => id !== key).forEach(([id, item]) => {
    const a = document.createElement('a');
    a.href = `player.html?video=${encodeURIComponent(id)}`;
    a.textContent = item.title;
    other.appendChild(a);
  });
});
