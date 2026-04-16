# TibiaApp

Ferramentas e trackers para jogadores de [Tibia](https://www.tibia.com).

## Soul Cores Tracker

Acompanhe quais **Soul Cores** voce ja conquistou no Tibia. Todas as 1.094 criaturas do Bestiary com sprites oficiais.

### Features

- **Lista completa** — Todas as criaturas carregadas em tempo real da [TibiaData API](https://tibiadata.com)
- **Sprites oficiais** — Icones direto do servidor do Tibia
- **Marcar/Desmarcar** — Clique para registrar as soul cores obtidas
- **Busca instantanea** — Encontre qualquer criatura pelo nome
- **Filtros** — Veja todas, somente obtidas ou as que faltam
- **Barra de progresso** — Acompanhe sua evolucao em tempo real
- **Persistencia local** — Dados salvos no navegador via localStorage
- **Exportar/Importar** — Backup em JSON para nao perder seu progresso
- **100% client-side** — Nenhum dado enviado para servidores externos

### Preview

| Visao geral | Filtro "Obtidas" |
|:-:|:-:|
| Grid com todas as criaturas e progresso | Apenas soul cores ja conquistadas |

### Stack

| Tecnologia | Uso |
|---|---|
| HTML/CSS/JS | Single-page app, zero dependencias |
| Nginx Alpine | Servidor web no container |
| Docker | Containerizacao |
| TibiaData API | Dados das criaturas |

## Rodando com Docker

```bash
# Clonar o repositorio
git clone https://github.com/gustavocfontana/TibiaApp.git
cd TibiaApp

# Subir o container
docker compose up -d

# Acessar no navegador
open http://localhost:8090
```

Para parar:

```bash
docker compose down
```

## Rodando sem Docker

Basta abrir o `index.html` direto no navegador. A unica dependencia externa e a API do TibiaData para carregar a lista de criaturas.

## Roadmap

- [ ] Soul Cores Tracker
- [ ] Mais ferramentas em breve...

## Licenca

MIT
