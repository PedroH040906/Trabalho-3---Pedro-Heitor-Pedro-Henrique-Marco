# Gerenciador de Tarefas

Sistema web desenvolvido com **React**, **TanStack Router** e **TanStack Table**.

## Tecnologias

- **React 19** + **TypeScript**
- **TanStack Router** — roteamento type-safe com file-based routes
- **TanStack Table** — tabela headless com sorting, filtering e paginação
- **Vite** — bundler e dev server
- **Context API** + **localStorage** — estado global e persistência

## Funcionalidades

- Home com estatísticas e barra de progresso
- Tabela de tarefas (TanStack Table) com:
  - Ordenação por coluna
  - Filtro por texto, status e prioridade
  - Paginação configurável
  - Seleção em lote para exclusão
  - Visibilidade de colunas
- CRUD completo de tarefas
- Avanço rápido de status (pendente → em andamento → concluída)
- Dados persistidos no `localStorage`

## Como rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## Estrutura

```
src/
├── routes/
│   ├── __root.tsx     # Layout raiz (Navbar)
│   ├── index.tsx      # Home
│   └── tasks/
│       ├── index.tsx  # /tasks — tabela
│       └── $id.tsx    # /tasks/:id — detalhe
├── components/
│   ├── Navbar.tsx
│   ├── TaskForm.tsx
│   ├── StatusBadge.tsx
│   └── PriorityBadge.tsx
├── store/
│   └── tasksStore.tsx
└── types/
    └── task.ts
```
