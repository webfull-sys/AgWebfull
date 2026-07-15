# 🧠 AgWebfull

> SaaS web para navegar, explorar e gerenciar personas de agentes IA para ferramentas de código.

**Baseado no [agency-agents-app](https://github.com/msitarzewski/agency-agents-app)** (MIT License) por [Michael Sitarzewski](https://github.com/msitarzewski).

[![CI](https://github.com/webfull-sys/AgWebfull/actions/workflows/ci.yml/badge.svg)](https://github.com/webfull-sys/AgWebfull/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🚀 O que é?

O AgWebfull é a versão web (SaaS) do agency-agents-app — uma aplicação para navegar um catálogo de 251+ personas de agentes IA especializados, organizados em 12 divisões profissionais, projetados para ferramentas de código como:

- **Claude Code** · **Codex** · **Cursor** · **Gemini CLI**
- **GitHub Copilot** · **Windsurf** · **Qwen** · **Aider**
- **Cline** · **Roo Code** · **opencode** · **Osaurus**

## 📋 Funcionalidades

| Recurso | Status |
|---------|--------|
| Catálogo de agentes por divisão | ✅ |
| Busca e filtros | ✅ |
| Visualização de persona (markdown) | ✅ |
| 12 ferramentas suportadas | ✅ |
| Tema Dark/Light/System | ✅ |
| Equipes de agentes | ✅ |
| Copiar para clipboard | ✅ |
| Dashboard com métricas | ✅ |
| Instalação direta no FS | ⚡ Stub (desktop) |
| Detecção de ferramentas | ⚡ Stub (desktop) |
| GitHub OAuth Device Flow | ⚡ Stub (desktop) |
| Auto-update | ❌ N/A (web) |

## 🛠️ Setup Local

```bash
# Clonar
git clone https://github.com/webfull-sys/AgWebfull.git
cd AgWebfull

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview
```

## 🐳 Docker

```bash
# Build e rodar
docker compose up --build

# Acesse http://localhost:3000
```

## ⚙️ Variáveis de Ambiente

Veja `.env.example` para todas as variáveis disponíveis.

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | `3000` | Porta do servidor |
| `PUBLIC_APP_NAME` | `AgWebfull` | Nome exibido na UI |
| `PUBLIC_CATALOG_SOURCE_URL` | GitHub | URL do catálogo fonte |

## 📁 Estrutura

```
src/
├── lib/
│   ├── api.ts          # Camada de API (web stubs)
│   ├── types.ts        # Tipos TypeScript
│   ├── platform.ts     # Detecção de plataforma
│   ├── components/     # 38 componentes Svelte
│   ├── stores/         # 13 stores Svelte 5 (runes)
│   ├── styles/         # Design tokens, reset, typography
│   └── data/           # Dados estáticos (tools, categories)
└── routes/
    ├── +layout.svelte  # Shell principal
    └── +page.svelte    # Página SPA
```

## 🏗️ Stack

- **Frontend**: SvelteKit + Svelte 5 (runes) + TypeScript
- **Styling**: CSS custom properties + design tokens
- **Build**: Vite + adapter-node
- **Deploy**: Docker + Node.js
- **Icons**: Lucide Svelte

## 📜 Licença

MIT License — veja [LICENSE](LICENSE).

Projeto original: [agency-agents-app](https://github.com/msitarzewski/agency-agents-app) por Michael Sitarzewski.

## 👨‍💻 Autoria

Desenvolvido por **[Webfull](https://webfull.com.br)** — v0.1.0
