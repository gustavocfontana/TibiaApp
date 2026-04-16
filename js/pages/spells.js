const Spells = {
    API_URL: 'https://api.tibiadata.com/v4/spells',
    spells: [],
    currentGroup: 'all',
    currentType: 'all',

    render() {
        const header = document.getElementById('page-header');
        const content = document.getElementById('content');

        header.innerHTML = `
            <div class="page-header-top">
                <div class="page-title">
                    <h2>Spells</h2>
                    <span class="badge" id="sp-badge">carregando...</span>
                </div>
            </div>
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
                    <div class="stat-info"><span class="stat-value" id="sp-attack">0</span><span class="stat-label">Attack</span></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                    <div class="stat-info"><span class="stat-value" id="sp-healing">0</span><span class="stat-label">Healing</span></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                    <div class="stat-info"><span class="stat-value" id="sp-support">0</span><span class="stat-label">Support</span></div>
                </div>
            </div>
            <div class="controls-row">
                <div class="search-wrapper">
                    ${App.icons.search}
                    <input type="text" class="search-input" id="sp-search" placeholder="Buscar spell ou formula..." autocomplete="off">
                </div>
                <div class="filter-group">
                    <button class="filter-btn active" data-group="all">Todas</button>
                    <button class="filter-btn" data-group="attack">Attack</button>
                    <button class="filter-btn" data-group="healing">Healing</button>
                    <button class="filter-btn" data-group="support">Support</button>
                </div>
                <div class="filter-group">
                    <button class="filter-btn active" data-type="all">Todas</button>
                    <button class="filter-btn" data-type="instant">Instant</button>
                    <button class="filter-btn" data-type="rune">Rune</button>
                </div>
            </div>`;

        this.setupEvents();
        this.loadSpells(content);
    },

    setupEvents() {
        let timeout;
        document.getElementById('sp-search').addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.applyFilters(), 200);
        });

        document.querySelectorAll('[data-group]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-group]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentGroup = btn.dataset.group;
                this.applyFilters();
            });
        });

        document.querySelectorAll('[data-type]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-type]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentType = btn.dataset.type;
                this.applyFilters();
            });
        });
    },

    getGroup(spell) {
        if (spell.group_attack) return 'attack';
        if (spell.group_healing) return 'healing';
        return 'support';
    },

    getType(spell) {
        return spell.type_rune ? 'rune' : 'instant';
    },

    updateStats() {
        document.getElementById('sp-attack').textContent = this.spells.filter(s => s.group_attack).length;
        document.getElementById('sp-healing').textContent = this.spells.filter(s => s.group_healing).length;
        document.getElementById('sp-support').textContent = this.spells.filter(s => s.group_support).length;
        document.getElementById('sp-badge').textContent = `${this.spells.length} spells`;
    },

    renderGrid(filter = '', group = 'all', type = 'all') {
        const content = document.getElementById('content');
        const term = filter.toLowerCase();

        const filtered = this.spells.filter(s => {
            const matchSearch = s.name.toLowerCase().includes(term) || s.formula.toLowerCase().includes(term);
            const matchGroup = group === 'all' || this.getGroup(s) === group;
            const matchType = type === 'all' || this.getType(s) === type;
            return matchSearch && matchGroup && matchType;
        });

        if (!filtered.length) {
            content.innerHTML = `<div class="no-results">${App.icons.noResults}<p>Nenhuma spell encontrada.</p></div>`;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';

        for (const spell of filtered) {
            const group = this.getGroup(spell);
            const type = this.getType(spell);
            const card = document.createElement('div');
            card.className = 'spell-card';
            card.innerHTML = `
                <div class="spell-header">
                    <span class="spell-name">${spell.name}</span>
                    <span class="spell-type ${type}">${type}</span>
                </div>
                <div class="spell-formula">"${spell.formula}"</div>
                <div class="spell-meta">
                    <span class="spell-group ${group}">${group}</span>
                    <span class="spell-stat">Lv: <strong>${spell.level}</strong></span>
                    <span class="spell-stat">Mana: <strong>${spell.mana === -1 ? 'Var' : spell.mana}</strong></span>
                    ${spell.premium_only ? '<span class="spell-stat" style="color:var(--warning)">Premium</span>' : ''}
                </div>`;
            grid.appendChild(card);
        }

        content.innerHTML = '';
        content.appendChild(grid);
    },

    applyFilters() {
        this.renderGrid(document.getElementById('sp-search').value, this.currentGroup, this.currentType);
    },

    async loadSpells(content) {
        App.showLoading(content);
        try {
            const res = await fetch(this.API_URL);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            this.spells = data.spells.spell_list.sort((a, b) => a.name.localeCompare(b.name));
            this.renderGrid();
            this.updateStats();
        } catch (err) {
            App.showError(content, `Erro ao carregar spells: ${err.message}`, () => this.loadSpells(content));
        }
    }
};
