# TibiaApp — Roadmap

## Concluido

### Fase 0 — Prototipo Static
- [x] Soul Cores tracker (HTML/JS/CSS)
- [x] Highscores, Spells, Worlds pages
- [x] App shell com sidebar e SPA router
- [x] Docker (nginx) + GitHub repo

### Fase 1 — Backend .NET (Clean Architecture + Vertical Slice)
- [x] Solution com Domain, Application, Infrastructure, API
- [x] Entities: Creature, SoulCore
- [x] Vertical Slices com MediatR (GetSoulCores, ToggleSoulCore, ImportSoulCores, GetSpells, GetWorlds, GetHighscores)
- [x] EF Core + PostgreSQL + Migrations
- [x] TibiaDataService com IMemoryCache (spells 24h, worlds 5min)
- [x] Repositories (Creature, SoulCore)
- [x] Controllers + Swagger
- [x] Docker Compose (3 services: db, api, client)
- [x] Todos endpoints testados e funcionando

## Proximos Passos

### Fase 2 — Angular Scaffolding
- [ ] `ng new tibia-client --standalone --routing --style=scss` dentro de `src/`
- [ ] Configurar `environment.ts` com URL da API (http://localhost:5002)
- [ ] Criar `ApiService` (HttpClient base)
- [ ] Criar layout principal: sidebar component, app shell
- [ ] Migrar CSS/design tokens para SCSS global (copiar de `css/styles.css`)
- [ ] Criar Dockerfile multi-stage (build Angular + nginx) 
- [ ] Atualizar docker-compose para usar o novo Angular client
- [ ] Remover frontend estatico antigo (index.html, css/, js/, Dockerfile, nginx.conf)

### Fase 3 — Pages Angular (features mais simples primeiro)
- [ ] Worlds page: service + component com filtros (PvP, regiao, busca)
- [ ] Spells page: service + component com filtros (grupo, tipo, busca)
- [ ] Highscores page: service + component com selects e paginacao

### Fase 4 — Soul Cores Angular (feature principal)
- [ ] SoulCore service com chamadas API
- [ ] SoulCores component: grid, filtros, busca, stats cards, progress bar
- [ ] Toggle owned via API (PUT)
- [ ] Import/Export/Reset
- [ ] Migracao automatica do localStorage para API na primeira visita
- [ ] Toast notifications (Angular service)

### Fase 5 — Polish
- [ ] Loading states e error handling consistentes em todos os components
- [ ] Responsividade mobile
- [ ] Testar fluxo completo no Docker Compose
- [ ] Atualizar README.md com nova stack

### Fase 6 — Keycloak (futuro)
- [ ] Configurar Keycloak no Docker Compose
- [ ] Criar realm e client para TibiaApp
- [ ] Integrar auth no backend (.NET)
- [ ] Angular: AuthService, AuthInterceptor, AuthGuard
- [ ] Substituir `DefaultUserId` por claim do token JWT
- [ ] Proteger endpoints de SoulCores com `[Authorize]`

### Fase 7 — Melhorias (futuro)
- [ ] Character lookup (buscar info de personagem)
- [ ] Boostable Bosses tracker
- [ ] Kill Statistics dashboard
- [ ] Testes unitarios (xUnit + Moq)
- [ ] CI/CD com GitHub Actions
