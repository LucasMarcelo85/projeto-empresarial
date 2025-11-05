# CHANGELOG - barber_front

Este arquivo deve ser utilizado para registrar todas as alterações relevantes no frontend do projeto Meu Barbeiro PRO.

## [3 de julho de 2025] - Início do changelog

- Criação do arquivo de changelog para o frontend.
- Recomenda-se registrar aqui todas as alterações futuras, incluindo:
  - Novos componentes, páginas, hooks, contextos, serviços, etc.
  - Mudanças de layout, design, acessibilidade, integrações, performance, etc.

---

## Como usar este changelog

- Para cada alteração, inclua a data, o arquivo/pasta e um resumo das mudanças.
- Exemplo:
  - [2025-07-03] src/components/booking/BookingSummary.tsx: Ajuste de contraste e cores na tela de confirmação de agendamento.

---

## [2025-07-03] Remoção de console.log de depuração

- src/pages/agendar/[slug].tsx: Removidos todos os console.log usados para depuração de horários e envio de dados de agendamento.
- src/utils/serverStatus.ts: Removidos console.log e console.error de detecção de servidor e falha de resposta.
- src/pages/dash_agenda/index.tsx: Removido console.log de dados recebidos da API no getServerSideProps.
- src/pages/dashboard/index.tsx: Removido console.log do bloco catch do getServerSideProps.

Essas remoções visam deixar o código mais limpo para produção, mantendo apenas logs de erro relevantes.

---

## [Limpeza e automação de código - 03/07/2025]

### Frontend (barber_front)

- Removido ESLint v9 e flat config devido a incompatibilidades.
- Instalado ESLint v8 e plugins compatíveis para uso do .eslintrc.json tradicional.
- Configurado eslint-plugin-unused-imports para detectar e remover imports/variáveis não utilizadas.
- Rodada varredura automática de código com ESLint, removendo código não utilizado.
- Documentado comando padrão para futuras varreduras: `npx eslint src --ext .js,.ts,.tsx --fix`.

### Backend (barber_back)

- Instalado ESLint v8 e plugins compatíveis para uso do .eslintrc.json tradicional.
- Criado arquivo .eslintrc.json com regras para detectar e remover imports/variáveis não utilizadas.
- Rodada varredura automática de código com ESLint, removendo código não utilizado.
- Documentado comando padrão para futuras varreduras: `npx eslint src --ext .js,.ts --fix`.

### Observações

- Restaram avisos e erros de tipagem (ex: uso de `any`) que precisam de ajuste manual.
- Processo documentado para facilitar futuras limpezas e manutenções.

---
