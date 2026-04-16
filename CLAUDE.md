# TibiaApp - Project Instructions

## Overview
Tibia companion app with soul cores tracker, highscores, spells, and worlds.
Refactoring from static HTML/JS to .NET + Angular + PostgreSQL.

## Architecture
- **Clean Architecture** (Domain → Application → Infrastructure → API)
- **Vertical Slice Architecture** in Application layer (Features organized by use case)
- **MediatR** for command/query dispatch
- **No auth yet** — uses `DefaultUserId = "dev-user"` (Keycloak planned for future)

## Tech Stack
- Backend: .NET 9 / C# / EF Core / Npgsql
- Frontend: Static HTML/JS (Angular migration pending)
- Database: PostgreSQL 16
- External API: TibiaData API (https://api.tibiadata.com/v4/)
- Docker Compose: 3 services (db, api, client)

## Project Structure
```
src/
  TibiaApp.Domain/           # Entities, no external dependencies
  TibiaApp.Application/      # Vertical Slices (Features/), Interfaces
  TibiaApp.Infrastructure/   # EF Core, Repositories, TibiaDataService
  TibiaApp.API/              # Controllers, Program.cs, Swagger
```

## Running
```bash
docker compose up -d --build     # Start all services
docker compose down              # Stop
```

## Ports
- PostgreSQL: 5435
- API: 5002 (Swagger: /swagger)
- Frontend: 8090

## .NET Commands (from src/ folder)
```bash
export DOTNET_ROOT="$HOME/.dotnet" && export PATH="$DOTNET_ROOT:$DOTNET_ROOT/tools:$PATH"
dotnet build
dotnet ef migrations add <Name> --project TibiaApp.Infrastructure --startup-project TibiaApp.API --output-dir Data/Migrations
```

## Git Workflow
- `main` — stable releases
- `develop` — active development (current)
- Feature branches from develop when needed

## Coding Standards
- PascalCase for C# classes/methods
- camelCase for TypeScript/Angular
- 4 spaces indentation (C#), 2 spaces (TypeScript)
- SOLID, DRY, KISS, YAGNI
- No AutoMapper — manual mapping
- No auth decorators until Keycloak is integrated

## API Endpoints
- `GET /api/soulcores` — List all creatures with owned status
- `PUT /api/soulcores/{race}` — Toggle soul core ownership
- `POST /api/soulcores/import` — Import from JSON
- `DELETE /api/soulcores` — Reset all
- `GET /api/spells` — Cached proxy (24h)
- `GET /api/worlds` — Cached proxy (5min)
- `GET /api/highscores/{world}/{category}/{vocation}/{page}` — Live proxy
