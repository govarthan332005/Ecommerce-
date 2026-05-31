/* ============================================
   LUXE — Main JavaScript v2 (lag-free, performant)
   ============================================ */

(function() {
    'use strict';

    // ============== CINEMATIC LOADER ==============
    function initLoader() {
        const loader = document.getElementById('loader');
        const percent = document.getElementById('loaderPercent');
        const particlesC = document.getElementById('loaderParticles');
        document.body.classList.add('loading');

        // Generate floating particles
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('span');
            p.className = 'loader-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 8 + 's';
            p.style.animationDuration = (5 + Math.random() * 6) + 's';
            particlesC.appendChild(p);
        }

        // Animate percentage counter
        let pct = 0;
        const tick = () => {
            pct += Math.random() * 4 + 1;
            if (pct >= 100) pct = 100;
            percent.textContent = Math.floor(pct);
            if (pct < 100) requestAnimationFrame(tick);
        };
        tick();

        // Hide loader when page fully loaded (or fallback after 2.6s)
        const hide = () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.classList.remove('loading');
                setTimeout(() => loader.remove(), 800);
            }, 600);
        };
        if (document.readyState === 'complete') hide();
        else window.addEventListener('load', hide);
        // Safety net
        setTimeout(hide, 3500);
    }
    initLoader();

    // ============== INIT ALL ==============
    document.addEventListener('DOMContentLoaded', () => {

        // ===== Performance helpers =====
        const debounce = (fn, wait = 100) => {
            let t;
            return (...args) => {
                clearTimeout(t);
                t = setTimeout(() => fn(...args), wait);
            };
        };
        const throttle = (fn, limit = 16) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    fn.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };
        const rafThrottle = (fn) => {
            let queued = false;
            return function(...args) {
                if (!queued) {
                    queued = true;
                    requestAnimationFrame(() => {
                        fn.apply(this, args);
                        queued = false;
                    });
                }
            };
        };

        // ===== HEADER + SCROLL PROGRESS =====
        const header = document.getElementById('header');
        const scrollTopBtn = document.getElementById('scrollTop');
        const scrollProgress = document.getElementById('scrollProgress');
        const scrollTopProgress = document.getElementById('scrollTopProgress');
        const mobileNav = document.getElementById('mobileBottomNav');

        const onScroll = rafThrottle(() => {
            const y = window.scrollY;
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docH > 0 ? (y / docH) * 100 : 0;
            scrollProgress.style.width = pct + '%';
            if (scrollTopProgress) {
                const dash = 138.23;
                scrollTopProgress.style.strokeDashoffset = dash - (dash * pct / 100);
            }

            if (y > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');

            if (y > 500) {
                scrollTopBtn.classList.add('active');
                if (window.innerWidth <= 768) mobileNav?.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('active');
                if (window.innerWidth <= 768 && y < 100) mobileNav?.classList.remove('show');
            }
        });
        window.addEventListener('scroll', onScroll, { passive: true });
        if (window.innerWidth <= 768) mobileNav?.classList.add('show');

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ===== MOBILE MENU =====
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (!link.parentElement.classList.contains('has-dropdown')) {
                    mobileBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });

        // ===== THEME TOGGLE =====
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('luxe-theme');
        if (savedTheme === 'light') document.body.classList.add('light-mode');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('luxe-theme', isLight ? 'light' : 'dark');
            showToast(isLight ? 'Light mode activated ☀️' : 'Dark mode activated 🌙', 'success');
        });

        // ===== CUSTOM CURSOR =====
        const cursorDot = document.getElementById('cursorDot');
        const cursorRing = document.getElementById('cursorRing');
        if (window.matchMedia('(pointer: fine)').matches) {
            let mx = 0, my = 0, rx = 0, ry = 0;
            const updateCursor = () => {
                rx += (mx - rx) * 0.18;
                ry += (my - ry) * 0.18;
                cursorRing.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
                cursorDot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
                requestAnimationFrame(updateCursor);
            };
            window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
            updateCursor();

            document.querySelectorAll('a, button, .product-card, .category-card, .filter-btn, .insta-item, input').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorRing.classList.add('hover');
                    cursorDot.classList.add('hover');
                });
                el.addEventListener('mouseleave', () => {
                    cursorRing.classList.remove('hover');
                    cursorDot.classList.remove('hover');
                });
            });
        }

        // ===== MAGNETIC BUTTONS =====
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });

        // ===== 3D TILT for hero cards =====
        document.querySelectorAll('.tilt').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // ===== SEARCH =====
        const searchBtn = document.getElementById('searchBtn');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        const searchSuggestions = document.getElementById('searchSuggestions');
        const mbSearchBtn = document.getElementById('mbSearchBtn');

        const openSearch = () => {
            searchOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
            setTimeout(() => searchInput.focus(), 300);
        };
        const closeSearch = () => {
            searchOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        };
        searchBtn.addEventListener('click', openSearch);
        mbSearchBtn?.addEventListener('click', openSearch);
        searchClose.addEventListener('click', closeSearch);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
                document.getElementById('quickViewModal').classList.remove('active');
                document.getElementById('sizeGuideModal').classList.remove('active');
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
        });

        const performSearch = debounce(() => {
            const q = searchInput.value.trim().toLowerCase();
            if (!q) {
                searchResults.innerHTML = '';
                searchSuggestions.style.display = 'block';
                return;
            }
            searchSuggestions.style.display = 'none';
            const matches = window.ALL_PRODUCTS.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.categoryLabel.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            ).slice(0, 8);

            if (matches.length === 0) {
                searchResults.innerHTML = `<div class="search-no-results"><i class="ph-duotone ph-magnifying-glass-minus" style="font-size:32px;display:block;margin-bottom:8px"></i>No results for "<strong>${q}</strong>"</div>`;
                return;
            }
            searchResults.innerHTML = matches.map(p => `
                <div class="search-result-item" data-id="${p.id}">
                    <div class="search-result-img" style="background:${p.gradient}">${p.emoji}</div>
                    <div class="search-result-info">
                        <h5>${p.title}</h5>
                        <p>$${p.price.toLocaleString()}</p>
                    </div>
                </div>
            `).join('');
            searchResults.querySelectorAll('.search-result-item').forEach(el => {
                el.addEventListener('click', () => {
                    openQuickView(+el.dataset.id);
                    closeSearch();
                });
            });
        }, 200);
        searchInput.addEventListener('input', performSearch);

        document.querySelectorAll('.suggestion-tags span').forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.textContent;
                searchInput.focus();
                performSearch();
            });
        });

        // ===== STATS COUNTER =====
        const statEls = document.querySelectorAll('.stat h3[data-count]');
        const animateCounters = () => {
            statEls.forEach(el => {
                const target = +el.dataset.count;
                let current = 0;
                const step = target / 60;
                const tick = () => {
                    current += step;
                    if (current >= target) { current = target; }
                    el.textContent = Math.floor(current);
                    if (current < target) requestAnimationFrame(tick);
                };
                tick();
            });
        };
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animateCounters();
                    statObserver.disconnect();
                }
            });
        }, { threshold: 0.4 });
        if (statEls.length) statObserver.observe(statEls[0]);

        // ===== PRODUCT RENDERING =====
        const productGrid = document.getElementById('productGrid');
        const newArrivalsGrid = document.getElementById('newArrivalsGrid');
        let displayedProducts = 8;

        function createProductCard(product, index = 0) {
            const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
            const badgeHTML = product.badge === 'new' ? '<span class="product-badge badge-new">New</span>'
                : product.badge === 'sale' ? `<span class="product-badge badge-sale">-${discount}%</span>`
                : product.badge === 'bestseller' ? '<span class="product-badge badge-bestseller">Bestseller</span>'
                : '';

            const colorsHTML = product.colors ? `<div class="product-colors">
                ${product.colors.map(c => `<span class="color-dot" style="background:${c}"></span>`).join('')}
            </div>` : '';

            const starsHTML = (() => {
                const full = Math.floor(product.rating);
                const half = product.rating % 1 >= 0.5;
                let s = '';
                for (let i = 0; i < full; i++) s += '<i class="ph-fill ph-star"></i>';
                if (half) s += '<i class="ph-fill ph-star-half"></i>';
                return s;
            })();

            return `
                <article class="product-card" data-category="${product.category}" data-id="${product.id}" style="animation-delay: ${index * 0.06}s">
                    <div class="product-image" style="background: ${product.gradient}">
                        <div class="product-badges">${badgeHTML}</div>
                        <div class="product-actions">
                            <button class="p-action wishlist-toggle" data-id="${product.id}" aria-label="Add to wishlist">
                                <i class="ph ph-heart"></i>
                            </button>
                            <button class="p-action quick-view" data-id="${product.id}" aria-label="Quick view">
                                <i class="ph ph-eye"></i>
                            </button>
                            <button class="p-action compare-toggle" data-id="${product.id}" aria-label="Compare">
                                <i class="ph ph-scales"></i>
                            </button>
                        </div>
                        <span class="product-emoji">${product.emoji}</span>
                        <button class="product-quick-add add-to-cart" data-id="${product.id}">
                            <i class="ph-fill ph-shopping-bag"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                    <div class="product-info">
                        <span class="product-category">${product.categoryLabel}</span>
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-rating">
                            <span class="stars">${starsHTML}</span>
                            <span>${product.rating} (${product.reviews})</span>
                        </div>
                        <div class="product-price">
                            <span class="price-current">$${product.price.toLocaleString()}</span>
                            ${product.oldPrice ? `<span class="price-old">$${product.oldPrice.toLocaleString()}</span>` : ''}
                        </div>
                        ${colorsHTML}
                    </div>
                </article>
            `;
        }

        function renderProducts(products, container) {
            container.innerHTML = products.map((p, i) => createProductCard(p, i)).join('');
            attachProductEvents();
        }

        renderProducts(window.PRODUCTS.slice(0, displayedProducts), productGrid);
        renderProducts(window.NEW_ARRIVALS, newArrivalsGrid);

        // ===== FILTERS =====
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                const filtered = filter === 'all'
                    ? window.PRODUCTS.slice(0, displayedProducts)
                    : window.PRODUCTS.filter(p => p.category === filter);
                renderProducts(filtered, productGrid);
            });
        });

        // ===== LOAD MORE =====
        document.getElementById('loadMoreBtn').addEventListener('click', () => {
            displayedProducts += 4;
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            const filtered = activeFilter === 'all'
                ? window.PRODUCTS.slice(0, displayedProducts)
                : window.PRODUCTS.filter(p => p.category === activeFilter);
            renderProducts(filtered, productGrid);
            showToast('More products loaded ✨', 'success');
        });

        // ===== CART / WISHLIST / COMPARE STATE =====
        let cart = JSON.parse(localStorage.getItem('luxe-cart') || '[]');
        let wishlist = JSON.parse(localStorage.getItem('luxe-wishlist') || '[]');
        let compareList = JSON.parse(localStorage.getItem('luxe-compare') || '[]');

        const saveCart = () => localStorage.setItem('luxe-cart', JSON.stringify(cart));
        const saveWishlist = () => localStorage.setItem('luxe-wishlist', JSON.stringify(wishlist));
        const saveCompare = () => localStorage.setItem('luxe-compare', JSON.stringify(compareList));

        function updateCartUI() {
            const count = cart.reduce((sum, item) => sum + item.qty, 0);
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
            document.getElementById('cartCount').textContent = count;
            document.getElementById('cartItemCount').textContent = `(${count})`;
            document.getElementById('cartSubtotal').textContent = `$${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            const mb = document.getElementById('mbCartCount');
            if (mb) { mb.textContent = count; mb.setAttribute('data-count', count); }

            const cartBody = document.getElementById('cartBody');
            const cartFooter = document.getElementById('cartFooter');

            if (cart.length === 0) {
                cartBody.innerHTML = `
                    <div class="cart-empty">
                        <i class="ph-duotone ph-shopping-bag-open"></i>
                        <h4>Your cart is empty</h4>
                        <p>Start shopping to add items to your cart</p>
                        <button class="btn btn-primary" id="continueShopping">Continue Shopping</button>
                    </div>`;
                cartFooter.style.display = 'none';
                document.getElementById('continueShopping')?.addEventListener('click', closeAllDrawers);
            } else {
                cartBody.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-img" style="background: ${item.gradient}">${item.emoji}</div>
                        <div class="cart-item-info">
                            <h5>${item.title}</h5>
                            <p class="ci-cat">${item.categoryLabel}</p>
                            <div class="cart-item-controls">
                                <button class="qty-btn qty-minus" data-id="${item.id}"><i class="ph ph-minus"></i></button>
                                <span class="qty-display">${item.qty}</span>
                                <button class="qty-btn qty-plus" data-id="${item.id}"><i class="ph ph-plus"></i></button>
                            </div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="cart-item-price">$${(item.price * item.qty).toLocaleString()}</div>
                            <button class="remove-btn" data-id="${item.id}"><i class="ph ph-trash"></i> Remove</button>
                        </div>
                    </div>
                `).join('');
                cartFooter.style.display = 'block';

                document.querySelectorAll('.qty-plus').forEach(b => b.addEventListener('click', () => changeQty(+b.dataset.id, 1)));
                document.querySelectorAll('.qty-minus').forEach(b => b.addEventListener('click', () => changeQty(+b.dataset.id, -1)));
                document.querySelectorAll('.remove-btn').forEach(b => b.addEventListener('click', () => removeFromCart(+b.dataset.id)));
            }
            saveCart();
        }

        function updateWishlistUI() {
            document.getElementById('wishlistCount').textContent = wishlist.length;
            document.getElementById('wishlistItemCount').textContent = `(${wishlist.length})`;
            const mb = document.getElementById('mbWishCount');
            if (mb) { mb.textContent = wishlist.length; mb.setAttribute('data-count', wishlist.length); }

            const wishlistBody = document.getElementById('wishlistBody');
            if (wishlist.length === 0) {
                wishlistBody.innerHTML = `
                    <div class="cart-empty">
                        <i class="ph-duotone ph-heart"></i>
                        <h4>Your wishlist is empty</h4>
                        <p>Save your favorite items here</p>
                    </div>`;
            } else {
                wishlistBody.innerHTML = wishlist.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-img" style="background: ${item.gradient}">${item.emoji}</div>
                        <div class="cart-item-info">
                            <h5>${item.title}</h5>
                            <p class="ci-cat">${item.categoryLabel}</p>
                            <button class="btn btn-outline" style="padding:8px 16px;font-size:11px;margin-top:8px" onclick="window.LUXE.moveToCart(${item.id})">
                                <i class="ph-fill ph-shopping-bag"></i> Add to Cart
                            </button>
                        </div>
                        <div class="cart-item-actions">
                            <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                            <button class="remove-btn wishlist-remove" data-id="${item.id}"><i class="ph ph-trash"></i> Remove</button>
                        </div>
                    </div>
                `).join('');
                document.querySelectorAll('.wishlist-remove').forEach(b => b.addEventListener('click', () => {
                    wishlist = wishlist.filter(p => p.id !== +b.dataset.id);
                    saveWishlist();
                    updateWishlistUI();
                    document.querySelectorAll(`.wishlist-toggle[data-id="${b.dataset.id}"] i`).forEach(i => {
                        i.classList.remove('ph-fill'); i.classList.add('ph');
                    });
                    document.querySelectorAll(`.wishlist-toggle[data-id="${b.dataset.id}"]`).forEach(btn => btn.classList.remove('active'));
                    showToast('Removed from wishlist', 'success');
                }));
            }
            saveWishlist();
        }

        function updateCompareUI() {
            document.getElementById('compareCount').textContent = compareList.length;
            document.getElementById('compareItemCount').textContent = `(${compareList.length})`;

            const body = document.getElementById('compareBody');
            if (compareList.length === 0) {
                body.innerHTML = `
                    <div class="cart-empty">
                        <i class="ph-duotone ph-scales"></i>
                        <h4>No products to compare</h4>
                        <p>Add up to 3 products to compare side-by-side</p>
                    </div>`;
            } else {
                body.innerHTML = compareList.map(item => `
                    <div class="compare-item">
                        <div class="cart-item-img" style="background:${item.gradient}">${item.emoji}</div>
                        <div class="cart-item-info">
                            <h5>${item.title}</h5>
                            <p class="ci-cat">${item.categoryLabel}</p>
                            <div class="compare-section"><strong>Price</strong> $${item.price.toLocaleString()}</div>
                            <div class="compare-section"><strong>Rating</strong> ${item.rating} ★ (${item.reviews} reviews)</div>
                            <div class="compare-section"><strong>Colors</strong> ${item.colors?.length || 0} available</div>
                        </div>
                        <div class="cart-item-actions">
                            <button class="btn btn-outline" style="padding:6px 12px;font-size:10px;margin-bottom:6px" onclick="window.LUXE.addToCart(${item.id})">Add to Cart</button>
                            <button class="remove-btn compare-remove" data-id="${item.id}"><i class="ph ph-trash"></i> Remove</button>
                        </div>
                    </div>
                `).join('');
                document.querySelectorAll('.compare-remove').forEach(b => b.addEventListener('click', () => {
                    compareList = compareList.filter(p => p.id !== +b.dataset.id);
                    saveCompare();
                    updateCompareUI();
                    document.querySelectorAll(`.compare-toggle[data-id="${b.dataset.id}"]`).forEach(btn => btn.classList.remove('active'));
                    showToast('Removed from compare', 'success');
                }));
            }
            saveCompare();
        }

        function addToCart(id) {
            const product = window.ALL_PRODUCTS.find(p => p.id === id);
            if (!product) return;
            const existing = cart.find(item => item.id === id);
            if (existing) existing.qty += 1;
            else cart.push({ ...product, qty: 1 });
            updateCartUI();
            showToast(`${product.title} added to cart 🛍️`, 'success');
            // Bump animation
            const cartBtn = document.getElementById('cartBtn');
            cartBtn.style.transform = 'scale(1.25)';
            setTimeout(() => cartBtn.style.transform = '', 220);
        }

        function changeQty(id, delta) {
            const item = cart.find(i => i.id === id);
            if (!item) return;
            item.qty += delta;
            if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
            updateCartUI();
        }

        function removeFromCart(id) {
            cart = cart.filter(i => i.id !== id);
            updateCartUI();
            showToast('Item removed', 'success');
        }

        function toggleWishlist(id) {
            const product = window.ALL_PRODUCTS.find(p => p.id === id);
            if (!product) return;
            const idx = wishlist.findIndex(i => i.id === id);
            if (idx > -1) {
                wishlist.splice(idx, 1);
                document.querySelectorAll(`.wishlist-toggle[data-id="${id}"] i`).forEach(i => {
                    i.classList.remove('ph-fill'); i.classList.add('ph');
                });
                document.querySelectorAll(`.wishlist-toggle[data-id="${id}"]`).forEach(btn => btn.classList.remove('active'));
                showToast('Removed from wishlist', 'success');
            } else {
                wishlist.push(product);
                document.querySelectorAll(`.wishlist-toggle[data-id="${id}"] i`).forEach(i => {
                    i.classList.remove('ph'); i.classList.add('ph-fill');
                });
                document.querySelectorAll(`.wishlist-toggle[data-id="${id}"]`).forEach(btn => btn.classList.add('active'));
                showToast(`${product.title} added to wishlist ❤️`, 'success');
            }
            updateWishlistUI();
        }

        function toggleCompare(id) {
            const product = window.ALL_PRODUCTS.find(p => p.id === id);
            if (!product) return;
            const idx = compareList.findIndex(i => i.id === id);
            if (idx > -1) {
                compareList.splice(idx, 1);
                document.querySelectorAll(`.compare-toggle[data-id="${id}"]`).forEach(btn => btn.classList.remove('active'));
                showToast('Removed from compare', 'success');
            } else {
                if (compareList.length >= 3) {
                    showToast('Maximum 3 products to compare', 'error');
                    return;
                }
                compareList.push(product);
                document.querySelectorAll(`.compare-toggle[data-id="${id}"]`).forEach(btn => btn.classList.add('active'));
                showToast(`Added to compare ⚖️`, 'success');
            }
            updateCompareUI();
        }

        function attachProductEvents() {
            document.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToCart(+btn.dataset.id);
                });
            });
            document.querySelectorAll('.wishlist-toggle').forEach(btn => {
                const id = +btn.dataset.id;
                if (wishlist.find(p => p.id === id)) {
                    btn.classList.add('active');
                    btn.querySelector('i').classList.remove('ph');
                    btn.querySelector('i').classList.add('ph-fill');
                }
                btn.addEventListener('click', (e) => { e.stopPropagation(); toggleWishlist(id); });
            });
            document.querySelectorAll('.compare-toggle').forEach(btn => {
                const id = +btn.dataset.id;
                if (compareList.find(p => p.id === id)) btn.classList.add('active');
                btn.addEventListener('click', (e) => { e.stopPropagation(); toggleCompare(id); });
            });
            document.querySelectorAll('.quick-view').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openQuickView(+btn.dataset.id);
                });
            });
        }

        // ===== DRAWERS =====
        const cartBtn = document.getElementById('cartBtn');
        const cartDrawer = document.getElementById('cartDrawer');
        const cartClose = document.getElementById('cartClose');
        const wishlistBtn = document.getElementById('wishlistBtn');
        const wishlistDrawer = document.getElementById('wishlistDrawer');
        const wishlistClose = document.getElementById('wishlistClose');
        const compareBtn = document.getElementById('compareBtn');
        const compareDrawer = document.getElementById('compareDrawer');
        const compareClose = document.getElementById('compareClose');
        const drawerOverlay = document.getElementById('drawerOverlay');
        const mbCartBtn = document.getElementById('mbCartBtn');
        const mbWishlistBtn = document.getElementById('mbWishlistBtn');

        function closeAllDrawers() {
            cartDrawer.classList.remove('active');
            wishlistDrawer.classList.remove('active');
            compareDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }

        const openCart = () => {
            cartDrawer.classList.add('active');
            drawerOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
        };
        const openWish = () => {
            wishlistDrawer.classList.add('active');
            drawerOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
        };

        cartBtn.addEventListener('click', openCart);
        mbCartBtn?.addEventListener('click', openCart);
        wishlistBtn.addEventListener('click', openWish);
        mbWishlistBtn?.addEventListener('click', openWish);
        compareBtn.addEventListener('click', () => {
            compareDrawer.classList.add('active');
            drawerOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
        });
        cartClose.addEventListener('click', closeAllDrawers);
        wishlistClose.addEventListener('click', closeAllDrawers);
        compareClose.addEventListener('click', closeAllDrawers);
        drawerOverlay.addEventListener('click', closeAllDrawers);
        document.getElementById('continueShopping2')?.addEventListener('click', closeAllDrawers);

        // ===== CHECKOUT (with confetti) =====
        document.getElementById('checkoutBtn')?.addEventListener('click', () => {
            closeAllDrawers();
            launchConfetti();
            showToast('Order placed! Thank you ✨', 'success');
            setTimeout(() => {
                cart = [];
                updateCartUI();
            }, 1200);
        });

        // ===== QUICK VIEW =====
        const quickViewModal = document.getElementById('quickViewModal');
        const quickViewContent = document.getElementById('quickViewContent');

        function openQuickView(id) {
            const p = window.ALL_PRODUCTS.find(x => x.id === id);
            if (!p) return;
            const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
            quickViewContent.innerHTML = `
                <button class="qv-close" onclick="document.getElementById('quickViewModal').classList.remove('active');document.body.classList.remove('no-scroll')"><i class="ph ph-x"></i></button>
                <div class="qv-grid">
                    <div class="qv-image" style="background: ${p.gradient}">${p.emoji}</div>
                    <div class="qv-info">
                        <span class="qv-cat">${p.categoryLabel}</span>
                        <h2>${p.title}</h2>
                        <div class="product-rating">
                            <span class="stars" style="color:var(--gold)"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></span>
                            <span>${p.rating} (${p.reviews} reviews)</span>
                        </div>
                        <div class="qv-price">
                            $${p.price.toLocaleString()}
                            ${p.oldPrice ? `<span style="font-size:18px;color:var(--text-muted);text-decoration:line-through;margin-left:12px">$${p.oldPrice.toLocaleString()}</span>` : ''}
                            ${discount ? `<span style="font-size:14px;color:var(--accent-red);margin-left:12px">Save ${discount}%</span>` : ''}
                        </div>
                        <p class="qv-desc">${p.description}</p>
                        <div>
                            <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Size <a href="#" style="color:var(--gold);text-decoration:underline" id="qvSizeGuide">View guide</a></p>
                            <div class="qv-sizes">
                                <span class="size-opt">XS</span>
                                <span class="size-opt active">S</span>
                                <span class="size-opt">M</span>
                                <span class="size-opt">L</span>
                                <span class="size-opt">XL</span>
                            </div>
                        </div>
                        <div class="qv-actions">
                            <button class="btn btn-primary" onclick="window.LUXE.qvAdd(${p.id})">
                                <i class="ph-fill ph-shopping-bag"></i> Add to Cart
                            </button>
                            <button class="btn btn-ghost" onclick="window.LUXE.qvWish(${p.id})">
                                <i class="ph ph-heart"></i> Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            `;
            quickViewModal.classList.add('active');
            document.body.classList.add('no-scroll');

            document.querySelectorAll('.size-opt').forEach(s => {
                s.addEventListener('click', () => {
                    document.querySelectorAll('.size-opt').forEach(x => x.classList.remove('active'));
                    s.classList.add('active');
                });
            });
            document.getElementById('qvSizeGuide')?.addEventListener('click', (e) => {
                e.preventDefault();
                openSizeGuide();
            });
        }

        quickViewModal.querySelector('.modal-overlay').addEventListener('click', () => {
            quickViewModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });

        // ===== SIZE GUIDE =====
        const sizeGuideModal = document.getElementById('sizeGuideModal');
        const sizeTable = document.getElementById('sizeTable');
        const SIZE_DATA = {
            women: {
                headers: ['Size', 'Bust', 'Waist', 'Hips'],
                rows: [['XS', '32-33', '24-25', '34-35'], ['S', '34-35', '26-27', '36-37'], ['M', '36-37', '28-29', '38-39'], ['L', '38-40', '30-32', '40-42'], ['XL', '41-43', '33-35', '43-45']]
            },
            men: {
                headers: ['Size', 'Chest', 'Waist', 'Neck'],
                rows: [['S', '34-36', '28-30', '14-14.5'], ['M', '38-40', '32-34', '15-15.5'], ['L', '42-44', '36-38', '16-16.5'], ['XL', '46-48', '40-42', '17-17.5'], ['XXL', '50-52', '44-46', '18-18.5']]
            },
            shoes: {
                headers: ['US', 'EU', 'UK', 'CM'],
                rows: [['6', '36', '4', '23'], ['7', '37', '5', '24'], ['8', '39', '6', '25'], ['9', '40', '7', '26'], ['10', '42', '8', '27'], ['11', '44', '9', '28']]
            }
        };
        function renderSizeTable(key) {
            const d = SIZE_DATA[key];
            sizeTable.innerHTML = `
                <thead><tr>${d.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                <tbody>${d.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
            `;
        }
        function openSizeGuide() {
            renderSizeTable('women');
            sizeGuideModal.classList.add('active');
            document.body.classList.add('no-scroll');
        }
        document.getElementById('openSizeGuide')?.addEventListener('click', (e) => { e.preventDefault(); openSizeGuide(); });
        document.getElementById('sizeGuideClose')?.addEventListener('click', () => {
            sizeGuideModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        sizeGuideModal.querySelector('.modal-overlay').addEventListener('click', () => {
            sizeGuideModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        document.querySelectorAll('.size-tab').forEach(t => {
            t.addEventListener('click', () => {
                document.querySelectorAll('.size-tab').forEach(x => x.classList.remove('active'));
                t.classList.add('active');
                renderSizeTable(t.dataset.tab);
            });
        });

        // ===== CONFETTI =====
        function launchConfetti() {
            const canvas = document.getElementById('confettiCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.classList.add('active');
            const colors = ['#d4af37', '#f4d47c', '#a8862a', '#e84a5f', '#4a3a8f', '#ffffff'];
            const particles = [];
            for (let i = 0; i < 150; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: -20 - Math.random() * 100,
                    vx: (Math.random() - 0.5) * 6,
                    vy: Math.random() * 3 + 2,
                    size: Math.random() * 8 + 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 10
                });
            }
            let frames = 0;
            const draw = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.12;
                    p.rotation += p.rotSpeed;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
                    ctx.restore();
                });
                frames++;
                if (frames < 200) requestAnimationFrame(draw);
                else {
                    canvas.classList.remove('active');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            };
            draw();
        }

        // ===== TOAST =====
        function showToast(message, type = 'success') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            const icon = type === 'success' ? 'check-circle' : 'warning-circle';
            toast.innerHTML = `<i class="ph-fill ph-${icon}"></i><span>${message}</span>`;
            container.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('removing');
                setTimeout(() => toast.remove(), 400);
            }, 3000);
        }
        window.showToast = showToast;

        // ===== COUNTDOWN TIMER =====
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        function updateTimer() {
            const now = new Date();
            const diff = targetDate - now;
            if (diff < 0) return;
            const d = Math.floor(diff / (1000*60*60*24));
            const h = Math.floor((diff / (1000*60*60)) % 24);
            const m = Math.floor((diff / (1000*60)) % 60);
            const s = Math.floor((diff / 1000) % 60);
            document.getElementById('days').textContent = String(d).padStart(2, '0');
            document.getElementById('hours').textContent = String(h).padStart(2, '0');
            document.getElementById('minutes').textContent = String(m).padStart(2, '0');
            document.getElementById('seconds').textContent = String(s).padStart(2, '0');
        }
        updateTimer();
        setInterval(updateTimer, 1000);

        // ===== NEWSLETTER =====
        document.getElementById('newsletterForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input').value;
            showToast(`Welcome to LUXE! Check ${email} for your 20% off code.`, 'success');
            launchConfetti();
            e.target.reset();
        });

        // ===== AOS-LIKE SCROLL ANIMATIONS =====
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const aosObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    aosObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

        // ===== LIVE PURCHASE NOTIFICATIONS =====
        const liveNotif = document.getElementById('liveNotification');
        const liveClose = document.getElementById('liveClose');
        const LIVE_NAMES = ['Sophia A.', 'James W.', 'Aisha P.', 'Marcus C.', 'Olivia R.', 'Liam T.', 'Emma S.', 'Noah K.', 'Mia D.', 'Ethan L.'];
        const LIVE_CITIES = ['New York', 'London', 'Dubai', 'Paris', 'Tokyo', 'Milan', 'Sydney'];
        let liveTimer;
        function showLiveNotification() {
            const name = LIVE_NAMES[Math.floor(Math.random() * LIVE_NAMES.length)];
            const city = LIVE_CITIES[Math.floor(Math.random() * LIVE_CITIES.length)];
            const product = window.ALL_PRODUCTS[Math.floor(Math.random() * window.ALL_PRODUCTS.length)];
            const minutes = Math.floor(Math.random() * 30) + 1;

            document.getElementById('liveName').textContent = name + ' from ' + city;
            document.getElementById('liveProduct').textContent = product.title;
            document.getElementById('liveTime').textContent = minutes + ' min ago';
            const avatar = liveNotif.querySelector('.live-avatar');
            avatar.style.background = product.gradient;
            avatar.textContent = name[0];

            liveNotif.classList.add('show');
            clearTimeout(liveTimer);
            liveTimer = setTimeout(() => liveNotif.classList.remove('show'), 5500);
        }
        liveClose.addEventListener('click', () => liveNotif.classList.remove('show'));

        // Show first after 8s, then every 15-25s
        setTimeout(() => {
            showLiveNotification();
            setInterval(() => {
                if (Math.random() > 0.3) showLiveNotification();
            }, 18000);
        }, 8000);

        // ===== INIT =====
        updateCartUI();
        updateWishlistUI();
        updateCompareUI();

        // Smooth scroll for hash links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href.length < 2) return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Footer "Contact Us" opens chat
        document.getElementById('openChatFromFooter')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.LUXA?.open();
        });

        // Expose API
        window.LUXE = {
            addToCart,
            toggleWishlist,
            toggleCompare,
            openQuickView,
            openSizeGuide,
            launchConfetti,
            moveToCart: (id) => {
                addToCart(id);
                wishlist = wishlist.filter(p => p.id !== id);
                updateWishlistUI();
            },
            qvAdd: (id) => {
                addToCart(id);
                quickViewModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            },
            qvWish: (id) => toggleWishlist(id)
        };

        console.log('%c✨ LUXE v2 — Welcome to Luxury ✨', 'background: linear-gradient(135deg, #d4af37, #f4d47c); color: #0a0a0a; font-size: 18px; padding: 12px 24px; border-radius: 8px; font-weight: bold;');
    });
})();
