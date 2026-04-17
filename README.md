# TibiaApp

Companion app para jogadores de [Tibia](https://www.tibia.com) — soul cores tracker, highscores, spells e worlds.

Projeto pessoal de estudo explorando **Clean Architecture**, **Vertical Slice** e stack moderna fullstack.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | .NET 9 / C# / ASP.NET Core |
| ORM | Entity Framework Core + Npgsql |
| Database | PostgreSQL 16 |
| Mediator | MediatR (CQRS) |
| Frontend | Angular 21 (standalone components, signals, lazy routes) |
| Infra | Docker Compose |

Dados externos vem da [TibiaData API](https://tibiadata.com).

---

## Features atuais

- **Soul Cores Tracker** — 1.094 criaturas com sprites oficiais, import/export, progresso persistido.
- **Highscores** — rankings por mundo, categoria e vocacao com paginacao.
- **Spells** — catalogo completo com busca e filtros.
- **Worlds** — servidores online com status e detalhes.

---

## Roadmap

- [ ] Autenticacao com Keycloak
- [ ] Testes automatizados (unit + integration)
- [ ] CI/CD
- [ ] Hunt tracker e loot calculator
- [ ] Notificacoes de server save / boss timers

---

## Licenca

MIT
