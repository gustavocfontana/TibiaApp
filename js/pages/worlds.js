const Worlds = {
    API_URL: 'https://api.tibiadata.com/v4/worlds',
    worlds: [],
    totalOnline: 0,
    recordPlayers: 0,
    currentPvp: 'all',
    currentLocation: 'all',

    render() {
        const header = document.getElementById('page-header');
        const content = document.getElementById('content');

        header.innerHTML = `
            <div class="page-header-top">
                <div class="page-title">
                    <h2>Worlds</h2>
                    <span class="badge" id="wd-badge">carregando...</span>
                </div>
            </div>
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                    <div class="stat-info"><span class="stat-value" id="wd-online">0</span><span class="stat-label">Players Online</span></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                    <div class="stat-info"><span class="stat-value" id="wd-record">0</span><span class="stat-label">Record</span></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
                    <div class="stat-info"><span class="stat-value" id="wd-total">0</span><span class="stat-label">Servidores</span></div>
                </div>
            </div>
            <div class="controls-row">
                <div class="search-wrapper">
                    ${App.icons.search}
                    <input type="text" class="search-input" id="wd-search" placeholder="Buscar mundo..." autocomplete="off">
                </div>
                <div class="filter-group">
                    <button class="filter-btn active" data-pvp="all">Todos</button>
                    <button class="filter-btn" data-pvp="Open PvP">Open</button>
                    <button class="filter-btn" data-pvp="Optional PvP">Optional</button>
                    <button class="filter-btn" data-pvp="Hardcore PvP">Hardcore</button>
                    <button class="filter-btn" data-pvp="Retro Open PvP">Retro</button>
                </div>
                <select class="select-input" id="wd-location">
                    <option value="all">Todas Regioes</option>
                    <option value="Europe">Europe</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                </select>
            </div>`;

        this.setupEvents();
        this.loadWorlds(content);
    },

    setupEvents() {
        let timeout;
        document.getElementById('wd-search').addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.applyFilters(), 200);
        });

        document.querySelectorAll('[data-pvp]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-pvp]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPvp = btn.dataset.pvp;
                this.applyFilters();
            });
        });

        document.getElementById('wd-location').addEventListener('change', (e) => {
            this.currentLocation = e.target.value;
            this.applyFilters();
        });
    },

    getPvpClass(pvp) {
        if (pvp.includes('Retro Hardcore')) return 'retro-hardcore';
        if (pvp.includes('Retro Open')) return 'retro-open';
        if (pvp.includes('Hardcore')) return 'hardcore';
        if (pvp.includes('Optional')) return 'optional';
        return 'open';
    },

    updateStats() {
        document.getElementById('wd-online').textContent = App.formatNumber(this.totalOnline);
        document.getElementById('wd-record').textContent = App.formatNumber(this.recordPlayers);
        document.getElementById('wd-total').textContent = this.worlds.length;
        document.getElementById('wd-badge').textContent = `${this.worlds.length} mundos`;
    },

    renderGrid(filter = '', pvp = 'all', location = 'all') {
        const content = document.getElementById('content');
        const term = filter.toLowerCase();

        const filtered = this.worlds.filter(w => {
            const matchSearch = w.name.toLowerCase().includes(term);
            const matchPvp = pvp === 'all' || w.pvp_type === pvp;
            const matchLoc = location === 'all' || w.location === location;
            return matchSearch && matchPvp && matchLoc;
        }).sort((a, b) => b.players_online - a.players_online);

        if (!filtered.length) {
            content.innerHTML = `<div class="no-results">${App.icons.noResults}<p>Nenhum mundo encontrado.</p></div>`;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';

        for (const w of filtered) {
            const pvpClass = this.getPvpClass(w.pvp_type);
            const card = document.createElement('div');
            card.className = 'world-card';
            card.innerHTML = `
                <div class="world-header">
                    <span class="world-name">${w.name}</span>
                    <span class="status-dot ${w.status}"></span>
                </div>
                <div class="world-details">
                    <div class="world-detail">
                        <span class="world-detail-label">Players</span>
                        <span class="world-detail-value">${App.formatNumber(w.players_online)}</span>
                    </div>
                    <div class="world-detail">
                        <span class="world-detail-label">PvP</span>
                        <span class="pvp-badge ${pvpClass}">${w.pvp_type}</span>
                    </div>
                    <div class="world-detail">
                        <span class="world-detail-label">Regiao</span>
                        <span class="world-detail-value">${w.location}</span>
                    </div>
                    <div class="world-detail">
                        <span class="world-detail-label">BattlEye</span>
                        <span class="world-detail-value">${w.battleye_protected ? 'Protegido' : 'Nao'}</span>
                    </div>
                    <div class="world-detail">
                        <span class="world-detail-label">Transfer</span>
                        <span class="world-detail-value" style="text-transform:capitalize">${w.transfer_type}</span>
                    </div>
                </div>`;
            grid.appendChild(card);
        }

        content.innerHTML = '';
        content.appendChild(grid);
    },

    applyFilters() {
        this.renderGrid(document.getElementById('wd-search').value, this.currentPvp, this.currentLocation);
    },

    async loadWorlds(content) {
        App.showLoading(content);
        try {
            const res = await fetch(this.API_URL);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            this.worlds = data.worlds.regular_worlds || [];
            this.totalOnline = data.worlds.players_online;
            this.recordPlayers = data.worlds.record_players;
            this.renderGrid();
            this.updateStats();
        } catch (err) {
            App.showError(content, `Erro ao carregar mundos: ${err.message}`, () => this.loadWorlds(content));
        }
    }
};
