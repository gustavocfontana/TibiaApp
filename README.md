# TibiaApp

Companion app para jogadores de [Tibia](https://www.tibia.com) — soul cores tracker, highscores, spells e worlds.

Built with **Clean Architecture**, **Vertical Slice Architecture** e **.NET 9** como projeto de estudo e uso pessoal.

---

## Features

| Feature | Descricao |
|---|---|
| **Soul Cores Tracker** | Marque quais soul cores voce ja possui. 1.094 criaturas com sprites oficiais |
| **Highscores** | Rankings por mundo, categoria e vocacao com paginacao |
| **Spells** | Catalogo completo de magias com busca e filtros |
| **Worlds** | Lista de servidores com status online e detalhes |

Todos os dados vem da [TibiaData API](https://tibiadata.com).

---

## Tech Stack

| Camada | Tecnologia |
|---|---|
| **Backend** | .NET 9 / C# / ASP.NET Core |
| **ORM** | Entity Framework Core + Npgsql |
| **Database** | PostgreSQL 16 |
| **Mediator** | MediatR (CQRS) |
| **Frontend** | HTML / CSS / JS (SPA com hash routing) |
| **Infra** | Docker Compose (3 servicos) |
| **Docs** | Swagger / Swashbuckle |

---

## Arquitetura

```
src/
├── TibiaApp.Domain/              # Entidades e regras de negocio
│   └── Entities/                 # Creature, SoulCore
│
├── TibiaApp.Application/         # Casos de uso (Vertical Slices)
│   ├── Features/
│   │   ├── SoulCores/            # GetSoulCores, ToggleSoulCore, ImportSoulCores
│   │   ├── Highscores/           # GetHighscores
│   │   ├── Spells/               # GetSpells
│   │   └── Worlds/               # GetWorlds
│   └── Interfaces/               # Contratos (repositorios, servicos)
│
├── TibiaApp.Infrastructure/      # Implementacoes externas
│   ├── Data/                     # DbContext, Migrations
│   ├── Repositories/             # EF Core repositories
│   └── ExternalApis/             # TibiaDataService (HttpClient + cache)
│
└── TibiaApp.API/                 # Apresentacao
    ├── Controllers/              # REST endpoints
    └── Program.cs                # DI, middleware, auto-migration
```

**Principios:** SOLID, DRY, KISS, YAGNI — sem over-engineering.

---

## API Endpoints

| Metodo | Rota | Descricao |
|---|---|---|
| `GET` | `/api/soulcores` | Lista criaturas com status de posse |
| `PUT` | `/api/soulcores/{race}` | Toggle de soul core |
| `POST` | `/api/soulcores/import` | Importar soul cores via JSON |
| `DELETE` | `/api/soulcores` | Resetar todas |
| `GET` | `/api/spells` | Magias (cache 24h) |
| `GET` | `/api/worlds` | Mundos (cache 5min) |
| `GET` | `/api/highscores/{world}/{category}/{vocation}/{page}` | Rankings |

Swagger disponivel em `http://localhost:5002/swagger`

---

## Rodando o projeto

### Pre-requisitos

- [Docker](https://www.docker.com/) (ou [OrbStack](https://orbstack.dev/) no macOS)

### Setup

```bash
git clone https://github.com/gustavocfontana/TibiaApp.git
cd TibiaApp
docker compose up -d --build
```

| Servico | URL |
|---|---|
| Frontend | http://localhost:8090 |
| API | http://localhost:5002 |
| Swagger | http://localhost:5002/swagger |
| PostgreSQL | `localhost:5435` |

### Parar

```bash
docker compose down
```

---

## Roadmap

- [x] Soul Cores Tracker (frontend + backend)
- [x] Highscores, Spells, Worlds
- [x] .NET 9 + Clean Architecture + Vertical Slice
- [x] PostgreSQL + EF Core + Docker Compose
- [ ] Migrar frontend para Angular
- [ ] Autenticacao com Keycloak
- [ ] Testes automatizados
- [ ] CI/CD

---

## Licenca

MIT
