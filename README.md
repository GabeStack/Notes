# Notes

> **Minimalist and secure personal notes app**  

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![AdonisJS](https://img.shields.io/badge/AdonisJS-7-5A45FF?logo=adonisjs&logoColor=white)
![License](https://img.shields.io/badge/license-apache2.0-blue.svg)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Last Commit](https://img.shields.io/github/last-commit/gabestack/notes?label=última%20atualização)
![Commit Activity](https://img.shields.io/github/commit-activity/m/gabestack/notes)
![Portfolio](https://img.shields.io/badge/portfolio-gabestack.dev-0ea5e9)

Um aplicativo pessoal de anotações desenvolvido como **case de portfólio**, com foco em:
- ✅ Arquitetura full-stack escalável
- ✅ Autenticação JWT com sliding expiration
- ✅ UX minimalista e acessível
- ✅ Boas práticas de TypeScript, React Query e Docker

🌐 **Demo**: [notes.gabestack.dev](https://notes.gabestack.dev)
💻 **Portfolio**: [gabestack.dev](https://gabestack.dev)

## 🎯 Sobre o Projeto

**Notes** é um aplicativo pessoal de anotações desenvolvido como parte do meu portfólio de engenharia de software. O objetivo foi praticar padrões reais de desenvolvimento full-stack com foco em **segurança**, **experiência do usuário** e **manutenibilidade**.

### ✨ Funcionalidades Principais
- 📝 CRUD completo de notas com editor simples
- 🔐 Autenticação JWT com refresh automático (sliding expiration)
- 🔍 Busca em tempo real no título e conteúdo
- 🌓 Modo claro/escuro seguindo o design system do Gabestack
- 📱 Interface responsiva e acessível (mobile-first)
- ⚡ Cache otimizado com React Query + revalidação em background

### 🛠️ Stack Técnica
| Camada | Tecnologias |
|--------|------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, React Query, Axios, Vite |
| **Backend** | AdonisJS 6, PostgreSQL, JWT, Bcrypt, CORS, Rate limiting |
| **Infra** | Docker, Docker Compose, VPS Linux, Traefik, Let's Encrypt |

### 🎓 Objetivos de Aprendizado
- [x] Implementar autenticação stateless com JWT e renovação segura
- [x] Estruturar arquitetura feature-based com TypeScript type-safe
- [x] Integrar frontend e backend com tratamento robusto de erros
- [x] Configurar deploy automatizado com Docker + reverse proxy
- [x] Aplicar princípios de UX minimalista e acessibilidade
