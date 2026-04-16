const Highscores = {
    worlds: [],
    entries: [],
    selectedWorld: 'Antica',
    selectedCategory: 'experience',
    selectedVocation: 'all',
    currentPage: 1,

    categories: [
        { value: 'experience', label: 'Experience' },
        { value: 'magic', label: 'Magic Level' },
        { value: 'shielding', label: 'Shielding' },
        { value: 'distance', label: 'Distance' },
        { value: 'sword', label: 'Sword' },
        { value: 'axe', label: 'Axe' },
        { value: 'club', label: 'Club' },
        { value: 'fist', label: 'Fist' },
        { value: 'fishing', label: 'Fishing' },
        { value: 'achievements', label: 'Achievements' },
        { value: 'loyalty', label: 'Loyalty' },
    ],

    vocations: [
        { value: 'all', label: 'Todas Vocations' },
        { value: 'knights', label: 'Knights' },
        { value: 'paladins', label: 'Paladins' },
        { value: 'sorcerers', label: 'Sorcerers' },
        { value: 'druids', label: 'Druids' },
    ],

    render() {
        const header = document.getElementById('page-header');
        const content = document.getElementById('content');

        header.innerHTML = `
            <div class="page-header-top">
                <div class="page-title">
                    <h2>Highscores</h2>
                    <span class="badge" id="hs-badge">Rankings</span>
                </div>
            </div>
            <div class="controls-row">
                <select class="select-input" id="hs-world" style="min-width:140px">
                    <option value="Antica">Carregando mundos...</option>
                </select>
                <select class="select-input" id="hs-category" style="min-width:140px">
                    ${this.categories.map(c => `<option value="${c.value}"${c.value === this.selectedCategory ? ' selected' : ''}>${c.label}</option>`).join('')}
                </select>
                <select class="select-input" id="hs-vocation" style="min-width:150px">
                    ${this.vocations.map(v => `<option value="${v.value}"${v.value === this.selectedVocation ? ' selected' : ''}>${v.label}</option>`).join('')}
                </select>
                <div class="filter-group">
                    <button class="filter-btn" id="hs-prev" disabled>&larr;</button>
                    <button class="filter-btn active" id="hs-page-label" style="cursor:default;pointer-events:none">1</button>
                    <button class="filter-btn" id="hs-next">&rarr;</button>
                </div>
            </div>`;

        this.setupEvents();
        this.loadWorlds().then(() => this.loadHighscores(content));
    },

    setupEvents() {
        document.getElementById('hs-world').addEventListener('change', (e) => {
            this.selectedWorld = e.target.value;
            this.currentPage = 1;
            this.loadHighscores(document.getElementById('content'));
        });
        document.getElementById('hs-category').addEventListener('change', (e) => {
            this.selectedCategory = e.target.value;
            this.currentPage = 1;
            this.loadHighscores(document.getElementById('content'));
        });
        document.getElementById('hs-vocation').addEventListener('change', (e) => {
            this.selectedVocation = e.target.value;
            this.currentPage = 1;
            this.loadHighscores(document.getElementById('content'));
        });
        document.getElementById('hs-prev').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadHighscores(document.getElementById('content'));
            }
        });
        document.getElementById('hs-next').addEventListener('click', () => {
            this.currentPage++;
            this.loadHighscores(document.getElementById('content'));
        });
    },

    async loadWorlds() {
        try {
            const res = await fetch('https://api.tibiadata.com/v4/worlds');
            const data = await res.json();
            this.worlds = data.worlds.regular_worlds.map(w => w.name).sort();
            const select = document.getElementById('hs-world');
            select.innerHTML = this.worlds.map(w => `<option value="${w}"${w === this.selectedWorld ? ' selected' : ''}>${w}</option>`).join('');
        } catch {}
    },

    getVocationClass(voc) {
        if (voc.includes('Knight')) return 'ek';
        if (voc.includes('Paladin')) return 'rp';
        if (voc.includes('Sorcerer')) return 'ms';
        if (voc.includes('Druid')) return 'ed';
        return 'none';
    },

    getValueLabel() {
        const cat = this.categories.find(c => c.value === this.selectedCategory);
        return cat ? cat.label : 'Value';
    },

    async loadHighscores(content) {
        App.showLoading(content);
        const url = `https://api.tibiadata.com/v4/highscores/${this.selectedWorld}/${this.selectedCategory}/${this.selectedVocation}/${this.currentPage}`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            this.entries = data.highscores.highscore_list || [];

            document.getElementById('hs-page-label').textContent = this.currentPage;
            document.getElementById('hs-prev').disabled = this.currentPage <= 1;
            document.getElementById('hs-next').disabled = this.entries.length < 20;
            document.getElementById('hs-badge').textContent = `${this.selectedWorld} - ${this.getValueLabel()}`;

            this.renderTable(content);
        } catch (err) {
            App.showError(content, `Erro ao carregar highscores: ${err.message}`, () => this.loadHighscores(content));
        }
    },

    renderTable(content) {
        if (!this.entries.length) {
            content.innerHTML = '<div class="no-results"><p>Nenhum resultado encontrado.</p></div>';
            return;
        }

        const valueLabel = this.getValueLabel();
        let html = `<table class="data-table"><thead><tr>
            <th style="width:50px">#</th>
            <th>Nome</th>
            <th>Vocation</th>
            <th>Level</th>
            <th style="text-align:right">${valueLabel}</th>
        </tr></thead><tbody>`;

        for (const e of this.entries) {
            const rankClass = e.rank === 1 ? 'gold' : e.rank === 2 ? 'silver' : e.rank === 3 ? 'bronze' : '';
            const vocClass = this.getVocationClass(e.vocation);
            html += `<tr>
                <td class="rank-cell ${rankClass}">${e.rank}</td>
                <td class="name-cell">${e.name}</td>
                <td><span class="vocation-badge ${vocClass}">${e.vocation}</span></td>
                <td>${e.level}</td>
                <td style="text-align:right;font-weight:600;font-variant-numeric:tabular-nums">${App.formatNumber(e.value)}</td>
            </tr>`;
        }

        html += '</tbody></table>';
        content.innerHTML = html;
    }
};
