# PRATICOIN — primeira entrega técnica

## Estrutura
- `index.html`: Home baseada no protótipo visual enviado.
- `cursos.html`: página inicial de educação com cartões demonstrativos e espaço para materiais.
- `simulador.html`: simulador com três perfis e nove cenários.
- `css/style.css`: identidade visual compartilhada e componentes globais.
- `css/cursos.css`, `css/simulador.css`: estilos específicos.
- `js/main.js`: navegação móvel, ano do rodapé e placeholders de autenticação.
- `js/cursos.js`: ponto de extensão da área educacional.
- `js/simulador.js`: cálculos, validação, gráfico do simulador e prévia calculada na Home.

## Como executar
Abra `index.html` no navegador. Para um fluxo local mais consistente, execute um servidor estático na pasta raiz (por exemplo, a extensão Live Server do VS Code). Não há dependências externas.

## Premissas atuais do simulador
- Taxas anuais efetivas hipotéticas convertidas para taxa mensal equivalente.
- Aportes mensais ao fim de cada mês.
- Valores nominais; não desconta inflação, impostos ou tarifas.
- Taxas e alocações são ilustrativas e não representam recomendação.

## Pendências
1. Validar os requisitos e as fórmulas com a equipe/professor.
2. Substituir estatísticas fictícias da Home por dados verificáveis ou removê-las.
3. Inserir cursos, vídeos, PDFs e links reais aprovados.
4. Confirmar se a alocação por perfil é apenas didática e manter os avisos.
5. Revisar acessibilidade, navegadores e responsividade com testes manuais.
6. Autenticação e persistência de dados ficam para fase posterior.
7. O simulador guarda os últimos valores inseridos em `sessionStorage`; ao voltar para a Home na mesma sessão do navegador, o cartão recalcula a prévia com esses valores. Sem uma simulação anterior na sessão, a Home usa valores demonstrativos. A persistência termina ao encerrar a sessão do navegador.


## Área de Educação (atualizada)
A página `cursos.html` contém catálogo pesquisável de 15 investimentos, filtros por categoria, painel explicativo por tema, cinco espaços reservados para vídeos e biblioteca de links educativos oficiais. Para configurar vídeos futuramente, editar apenas os cartões da seção `#videos` em `cursos.html`. Os links externos apontam para fontes institucionais; o documento `assets/materiais/Tesouro_Selic_e_Poupanca.docx` é o material fornecido no projeto.


## Página Como fazer
A página `como-fazer.html` explica passos gerais para começar a investir, apresenta canais oficiais para verificar instituições, exemplos de instituições para comparar e empresas listadas para estudo. Os exemplos não são recomendações de compra. A navegação não exibe login ou criação de conta, pois essas funcionalidades ainda não existem.


## Navegação educativa atualizada
- `investimento.html?tema=...`: página interna de detalhes para cada investimento do catálogo.
- `player.html?video=...`: página interna de player para cada aula.
- Edite `js/player.js` e preencha `embedUrl` com uma URL de incorporação real para ativar cada vídeo.
- A página Como fazer mantém o conteúdo no próprio site e apresenta apenas exemplos conhecidos de instituições e empresas.


## Quiz educativo
- `quiz.html`: escolha entre os níveis Básico (5 de 20), Intermediário (7 de 30) e Avançado (10 de 25).
- `quiz-game.html`: tela de partida com correção, pontuação e revisão das respostas.
- `js/quiz-banco.js`: banco local com 75 questões educativas. A seleção é aleatória e sem repetição dentro de cada partida.
- `js/quiz.js` e `js/quiz-game.js`: início dos níveis e lógica do jogo.

## Planilha de planejamento financeiro
O item 01 da página `como-fazer.html` oferece download de `assets/materiais/Planejamento_Financeiro_PRATICOIN.xlsx`, com resumo mensal, receitas, despesas, metas e orientações.
