document.addEventListener('DOMContentLoaded', () => {
  const cards = [...document.querySelectorAll('.investment-card')];
  const search = document.querySelector('#catalog-search');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('#visible-count');
  const noResults = document.querySelector('#no-results');
  let activeFilter = 'todos';
  function updateCards() {
    const term = (search?.value || '').trim().toLocaleLowerCase('pt-BR');
    let visible = 0;
    cards.forEach(card => {
      const categoryMatches = activeFilter === 'todos' || card.dataset.category === activeFilter;
      const searchText = `${card.dataset.search || ''} ${card.textContent}`.toLocaleLowerCase('pt-BR');
      const show = categoryMatches && (!term || searchText.includes(term));
      card.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = String(visible);
    if (noResults) noResults.hidden = visible !== 0;
  }
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'todos';
    filterButtons.forEach(item => { const selected = item === button; item.classList.toggle('is-active', selected); item.setAttribute('aria-pressed', String(selected)); });
    updateCards();
  }));
  search?.addEventListener('input', updateCards);
  function openInvestment(card) { const button = card.querySelector('[data-topic]'); if (button) window.location.href = `investimento.html?tema=${encodeURIComponent(button.dataset.topic || 'Investimentos')}`; }
  cards.forEach(card => {
    card.setAttribute('role', 'link'); card.setAttribute('tabindex', '0');
    card.addEventListener('click', event => { if (event.target.closest('button')) { event.stopPropagation(); openInvestment(card); } else openInvestment(card); });
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openInvestment(card); } });
  });
  updateCards();
});
