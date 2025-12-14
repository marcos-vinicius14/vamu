# 🎉 Vamu - Gerenciador de Eventos

**Vamu** é uma aplicação web moderna e progressiva (PWA) para criação e gerenciamento de eventos com sistema de RSVP integrado. Crie eventos, compartilhe links únicos e gerencie a lista de convidados de forma simples e elegante.

![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat&logo=nuxt.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)

---

## ✨ Features

### Para Organizadores
- **Criação de Eventos** — Crie eventos com título, descrição, data, local e tema personalizado
- **Dashboard Administrativo** — Visualize estatísticas em tempo real (confirmados, pendentes, recusados)
- **Gerenciamento de Convidados** — Tabela completa com todos os convidados e seus status
- **Links Únicos (Slug)** — Cada evento possui uma URL amigável para compartilhamento

### Para Convidados
- **RSVP Simples** — Confirme ou recuse presença com poucos cliques
- **Acompanhantes** — Informe o número de acompanhantes ao confirmar
- **Sem Cadastro** — Convidados não precisam criar conta para confirmar presença

### Geral
- **PWA (Progressive Web App)** — Instalável em dispositivos móveis e desktop
- **Autenticação Segura** — Sistema de login/registro com email e senha via Better Auth
- **Interface Responsiva** — Design moderno com Nuxt UI que funciona em qualquer dispositivo
- **Atualização Automática** — Notificações de atualização do service worker

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular e bem organizada, separando responsabilidades entre frontend e backend.

```
vamu-app/
├── app/                      # Frontend (Nuxt App)
│   ├── components/           # Componentes Vue reutilizáveis
│   ├── composables/          # Hooks Vue (lógica de negócio)
│   │   ├── mutations/        # Mutações TanStack Query
│   │   ├── queries/          # Queries TanStack Query
│   │   └── use*.ts           # Composables de features
│   ├── layouts/              # Layouts da aplicação
│   ├── middleware/           # Middlewares de autenticação
│   ├── pages/                # Páginas/Rotas
│   ├── plugins/              # Plugins Nuxt (Vue Query, etc)
│   ├── types/                # Definições TypeScript
│   └── utils/                # Utilitários (Query Key Factory)
│
├── server/                   # Backend (Nitro Server)
│   ├── api/                  # Endpoints da API
│   │   ├── auth/             # Autenticação (Better Auth)
│   │   ├── events/           # CRUD de eventos
│   │   ├── user/             # Dados do usuário
│   │   └── rsvp.post.ts      # Endpoint de RSVP
│   ├── database/             # Camada de dados
│   │   ├── migrations/       # Migrations Drizzle
│   │   └── schemas/          # Schemas do banco (Drizzle ORM)
│   ├── features/             # Lógica de domínio
│   │   ├── events/           # Serviços de eventos
│   │   └── guests/           # Serviços de convidados
│   └── utils/                # Utilitários do servidor
│
└── public/                   # Assets estáticos e ícones PWA
```

### Padrões Utilizados

| Padrão | Descrição |
|--------|-----------|
| **Composables** | Lógica de negócio extraída em hooks reutilizáveis |
| **Query Key Factory** | Gerenciamento tipado de chaves do TanStack Query |
| **Feature-based Structure** | Backend organizado por domínio (events, guests) |
| **Strict TypeScript** | Tipagem rigorosa em todo o projeto |

---

## 🛠️ Tecnologias

### Frontend
| Tecnologia | Uso |
|------------|-----|
| [Nuxt 4](https://nuxt.com/) | Framework Vue.js full-stack |
| [Vue 3](https://vuejs.org/) | Framework JavaScript reativo |
| [Nuxt UI](https://ui.nuxt.com/) | Biblioteca de componentes UI |
| [TanStack Query](https://tanstack.com/query) | Gerenciamento de estado assíncrono |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |

### Backend
| Tecnologia | Uso |
|------------|-----|
| [Nitro](https://nitro.unjs.io/) | Server engine do Nuxt |
| [Drizzle ORM](https://orm.drizzle.team/) | ORM TypeScript-first |
| [PostgreSQL 16](https://www.postgresql.org/) | Banco de dados relacional |
| [Better Auth](https://better-auth.com/) | Autenticação moderna |
| [Zod](https://zod.dev/) | Validação de schemas |

### DevOps & Tooling
| Tecnologia | Uso |
|------------|-----|
| [Docker Compose](https://docs.docker.com/compose/) | Containerização do banco de dados |
| [Vite PWA](https://vite-pwa-org.netlify.app/) | Suporte a Progressive Web App |
| [Bun](https://bun.sh/) | Runtime JavaScript |

---

## 🚀 Getting Started

### Pré-requisitos

- Bun
- Docker e Docker Compose
- PostgreSQL 16 (via Docker)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/vamu.git
cd vamu/vamu-app

# Instale as dependências
bun install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais
```

### Configuração do Banco de Dados

```bash
# Inicie o PostgreSQL com Docker
docker compose up -d

# Execute as migrations
bun run db:migrate
```

### Executando o Projeto

```bash
# Desenvolvimento
bun run dev

# Ou use o comando completo que inicia tudo
bun run services:up
```

A aplicação estará disponível em `http://localhost:3000`.

### Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `bun run dev` | Inicia o servidor de desenvolvimento |
| `bun run build` | Compila para produção |
| `bun run db:generate` | Gera migrations do Drizzle |
| `bun run db:migrate` | Executa migrations pendentes |
| `bun run db:studio` | Abre o Drizzle Studio (GUI) |
| `bun run services:up` | Inicia Docker + testes + dev server |
| `bun run services:down` | Para os containers Docker |

---

## 📱 PWA

O Vamu é uma Progressive Web App completa, oferecendo:

- **Instalação nativa** em dispositivos móveis e desktop
- **Funcionamento offline** (cache de assets)
- **Atualizações automáticas** com notificação ao usuário
- **Ícones e splash screens** otimizados

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito com 💜 usando Nuxt, Vue e muito TypeScript
</p>
