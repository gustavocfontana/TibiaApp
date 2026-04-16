const SoulCores = {
    STORAGE_KEY: 'tibia-soul-cores-owned',
    API_URL: 'https://api.tibiadata.com/v4/creatures',
    creatures: [],
    ownedSet: new Set(),
    currentFilter: 'all',

    render() {
        this.loadOwned();
        const header = document.getElementById('page-header');
        const content = document.getElementById('content');

        header.innerHTML = `
            <div class="page-header-top">
                <div class="page-title">
                    <h2>Soul Cores</h2>
                    <span class="badge" id="total-badge">carregando...</span>
                </div>
                <div class="header-actions">
                    <button class="btn-icon" id="sc-export">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        <span class="tooltip">Exportar</span>
                    </button>
                    <button class="btn-icon" id="sc-import">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <span class="tooltip">Importar</span>
                    </button>
                    <button class="btn-icon danger" id="sc-reset">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                        <span class="tooltip">Resetar</span>
                    </button>
                </div>
            </div>
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
                    <div class="stat-info"><span class="stat-value" id="sc-owned">0</span><span class="stat-label">Obtidas</span></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
                    <div class="stat-info"><span class="stat-value" id="sc-missing">0</span><span class="stat-label">Faltando</span></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg></div>
                    <div class="stat-info"><span class="stat-value" id="sc-total">0</span><span class="stat-label">Total</span></div>
                </div>
            </div>
            <div class="progress-row">
                <div class="progress-track"><div class="progress-fill" id="sc-progress" style="width:0%"></div></div>
                <span class="progress-label" id="sc-pct">0%</span>
            </div>
            <div class="controls-row">
                <div class="search-wrapper">
                    ${App.icons.search}
                    <input type="text" class="search-input" id="sc-search" placeholder="Buscar criatura..." autocomplete="off">
                </div>
                <div class="filter-group">
                    <button class="filter-btn active" data-filter="all">Todas</button>
                    <button class="filter-btn" data-filter="owned">Obtidas</button>
                    <button class="filter-btn" data-filter="missing">Faltando</button>
                </div>
            </div>`;

        this.setupEvents();
        this.loadCreatures(content);
    },

    setupEvents() {
        let timeout;
        document.getElementById('sc-search').addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.applyFilters(), 200);
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.applyFilters();
            });
        });

        document.getElementById('sc-export').addEventListener('click', () => this.exportData());
        document.getElementById('sc-import').addEventListener('click', () => document.getElementById('import-file').click());
        document.getElementById('sc-reset').addEventListener('click', () => this.resetData());

        document.getElementById('import-file').onchange = (e) => this.importData(e);
    },

    loadOwned() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) this.ownedSet = new Set(JSON.parse(data));
        } catch { this.ownedSet = new Set(); }
    },

    saveOwned() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...this.ownedSet]));
    },

    updateStats() {
        const total = this.creatures.length;
        const owned = this.ownedSet.size;
        const pct = total > 0 ? ((owned / total) * 100).toFixed(1) : 0;
        document.getElementById('sc-owned').textContent = owned;
        document.getElementById('sc-missing').textContent = total - owned;
        document.getElementById('sc-total').textContent = total;
        document.getElementById('total-badge').textContent = `${total} criaturas`;
        document.getElementById('sc-pct').textContent = `${pct}%`;
        document.getElementById('sc-progress').style.width = `${pct}%`;
    },

    toggleOwned(race) {
        if (this.ownedSet.has(race)) this.ownedSet.delete(race);
        else this.ownedSet.add(race);
        this.saveOwned();
        this.updateStats();
        const card = document.querySelector(`[data-race="${race}"]`);
        if (card) {
            card.classList.toggle('owned', this.ownedSet.has(race));
            if (this.currentFilter !== 'all') {
                const show = (this.currentFilter === 'owned' && this.ownedSet.has(race)) ||
                             (this.currentFilter === 'missing' && !this.ownedSet.has(race));
                card.style.display = show ? '' : 'none';
            }
        }
    },

    renderGrid(filter = '', filterType = 'all') {
        const content = document.getElementById('content');
        const term = filter.toLowerCase();
        const filtered = this.creatures.filter(c => {
            const s = c.name.toLowerCase().includes(term);
            const f = filterType === 'all' || (filterType === 'owned' && this.ownedSet.has(c.race)) || (filterType === 'missing' && !this.ownedSet.has(c.race));
            return s && f;
        });

        if (!filtered.length) {
            content.innerHTML = `<div class="no-results">${App.icons.noResults}<p>Nenhuma criatura encontrada.</p></div>`;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'grid';
        const frag = document.createDocumentFragment();
        for (const c of filtered) {
            const card = document.createElement('div');
            card.className = `creature-card${this.ownedSet.has(c.race) ? ' owned' : ''}`;
            card.dataset.race = c.race;
            card.addEventListener('click', () => this.toggleOwned(c.race));
            card.innerHTML = `<div class="check-box">${App.icons.check}</div><img class="creature-img" src="${c.image_url}" alt="${c.name}" loading="lazy" onerror="this.style.display='none'"><span class="creature-name" title="${c.name}">${c.name}</span>`;
            frag.appendChild(card);
        }
        grid.appendChild(frag);
        content.innerHTML = '';
        content.appendChild(grid);
    },

    applyFilters() {
        this.renderGrid(document.getElementById('sc-search').value, this.currentFilter);
    },

    async loadCreatures(content) {
        App.showLoading(content);
        try {
            const res = await fetch(this.API_URL);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            this.creatures = data.creatures.creature_list
                .map(c => ({ name: c.name, race: c.race, image_url: c.image_url }))
                .sort((a, b) => a.name.localeCompare(b.name));
            this.renderGrid();
            this.updateStats();
        } catch (err) {
            App.showError(content, `Erro ao carregar criaturas: ${err.message}`, () => this.loadCreatures(content));
        }
    },

    exportData() {
        const blob = new Blob([JSON.stringify({ version: 1, exported_at: new Date().toISOString(), owned: [...this.ownedSet] }, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `soul-cores-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
        App.showToast('Backup exportado!');
    },

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.owned && Array.isArray(data.owned)) {
                    this.ownedSet = new Set(data.owned);
                    this.saveOwned();
                    this.applyFilters();
                    this.updateStats();
                    App.showToast(`${this.ownedSet.size} soul cores importadas!`);
                } else App.showToast('Formato invalido.', 'error');
            } catch { App.showToast('Erro ao ler arquivo.', 'error'); }
        };
        reader.readAsText(file);
        e.target.value = '';
    },

    resetData() {
        if (confirm('Tem certeza que deseja resetar todas as soul cores?')) {
            this.ownedSet.clear();
            this.saveOwned();
            this.applyFilters();
            this.updateStats();
            App.showToast('Progresso resetado.');
        }
    }
};
