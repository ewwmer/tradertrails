// ===== CONFIGURATION =====
const CONFIG = {
    discordLink: 'https://discord.gg/YOURSERVER',
    siteName: 'GameMarket',
};

function setDiscordLink(link) {
    CONFIG.discordLink = link;
}

// ===== NAVBAR TOGGLE =====
function initNavbar() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('open');
            }
        });
    }
}

// ===== BUY BUTTON HANDLING =====
function initBuyButtons() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-buy, .btn-buy-discord');
        if (btn) {
            e.preventDefault();
            window.open(CONFIG.discordLink, '_blank');
        }
    });
}

// ===== CATEGORY FILTER =====
function initCategoryTabs() {
    const containers = document.querySelectorAll('[data-category-container]');
    containers.forEach(container => {
        const tabs = container.querySelectorAll('.category-tab');
        const items = container.querySelectorAll('[data-category]');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                items.forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    });
}

// ===== FADE IN ON SCROLL =====
function initFadeIn() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ===== PRODUCT RENDERER =====
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = products.map(p => `
        <div class="product-card fade-in" data-category="${p.category}">
            <img src="${p.image}" alt="${p.title}" class="card-image" onerror="this.style.display='none'">
            <div class="card-body">
                <h4>${p.title}</h4>
                <p>${p.description}</p>
            </div>
            <div class="card-footer">
                <span class="price">$${p.price.toFixed(2)}</span>
                <button class="btn-buy">Buy</button>
            </div>
        </div>
    `).join('');

    initFadeIn();
}

function initProductRenderer() {
    const dataEl = document.getElementById('productData');
    if (!dataEl) return;
    try {
        const products = JSON.parse(dataEl.textContent);
        const containerId = dataEl.dataset.container || 'productsGrid';
        renderProducts(products, containerId);
    } catch (e) {
        console.warn('Product data parse error:', e);
    }
}

// ===== SEARCH =====
function initSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            const title = card.querySelector('h4')?.textContent?.toLowerCase() || '';
            const desc = card.querySelector('p')?.textContent?.toLowerCase() || '';
            const match = title.includes(query) || desc.includes(query);
            card.style.display = match || !query ? '' : 'none';
        });

        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
            const match = title.includes(query);
            card.style.display = match || !query ? '' : 'none';
        });
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initBuyButtons();
    initCategoryTabs();
    initFadeIn();
    initProductRenderer();
    initSearch();
});
