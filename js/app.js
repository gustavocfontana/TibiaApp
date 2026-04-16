// ── TibiaApp Core ──
const App = {
    currentPage: null,

    icons: {
        check: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        noResults: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    },

    init() {
        this.setupMobileMenu();
        this.setupNavigation();
        window.addEventListener('hashchange', () => this.route());
        this.route();
    },

    setupMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        document.getElementById('menu-toggle').addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
        });
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        });
    },

    setupNavigation() {
        document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.hash = btn.dataset.page;
                document.getElementById('sidebar').classList.remove('open');
                document.getElementById('sidebar-overlay').classList.remove('open');
            });
        });
    },

    route() {
        const hash = window.location.hash.slice(1) || 'soul-cores';
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-page="${hash}"]`);
        if (activeNav) activeNav.classList.add('active');

        const pages = { 'soul-cores': SoulCores, 'highscores': Highscores, 'spells': Spells, 'worlds': Worlds };
        const page = pages[hash];
        if (page) {
            this.currentPage = page;
            page.render();
        }
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success'
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/></svg>';
        toast.innerHTML = `${icon} ${message}`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(8px)';
            toast.style.transition = 'all 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    },

    showLoading(target) {
        target.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando...</p></div>';
    },

    showError(target, message, retryFn) {
        target.innerHTML = `
            <div class="error-state">
                <p>${message}</p>
                <button class="btn-retry" id="retry-btn">Tentar novamente</button>
            </div>`;
        document.getElementById('retry-btn').addEventListener('click', retryFn);
    },

    formatNumber(n) {
        return n.toLocaleString('pt-BR');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
