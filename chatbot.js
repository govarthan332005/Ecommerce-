/* ============================================
   LUXE — Luxa AI Concierge Chatbot
   Smart rule-based assistant with contextual responses
   ============================================ */

(function() {
    'use strict';

    const CHAT_STATE = {
        isOpen: false,
        messages: [],
        context: null,
        firstOpen: true
    };

    // ===== KNOWLEDGE BASE =====
    const KNOWLEDGE = {
        greetings: {
            patterns: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon', 'howdy', 'greetings', 'yo', 'hii', 'hiii'],
            replies: [
                "Hello! ✨ Welcome to LUXE. I'm Luxa, your personal shopping concierge. How may I assist you today?",
                "Hi there! 💎 So glad you're here. I can help you find the perfect piece, track an order, or answer any question. What's on your mind?",
                "Greetings! 👑 I'm Luxa, here to make your luxury experience effortless. How can I help?"
            ]
        },
        shipping: {
            patterns: ['shipping', 'delivery', 'ship', 'deliver', 'arrive', 'how long', 'when will'],
            reply: "✈️ <strong>Shipping at LUXE:</strong><br><br>• <strong>Free worldwide shipping</strong> on orders over $150<br>• <strong>Express delivery:</strong> 2–4 business days<br>• <strong>Standard:</strong> 5–7 business days<br>• Real-time tracking included<br><br>All orders ship in our signature gift packaging. 🎁"
        },
        returns: {
            patterns: ['return', 'refund', 'exchange', 'cancel', 'money back'],
            reply: "↩️ <strong>Our 30-Day Promise:</strong><br><br>• Free returns within 30 days<br>• Items must be unworn with original tags<br>• Refund processed in 3–5 business days<br>• Free return label included<br><br>Want me to start a return for you? 💌"
        },
        payment: {
            patterns: ['payment', 'pay', 'credit card', 'paypal', 'apple pay', 'klarna', 'afterpay', 'how to pay'],
            reply: "💳 <strong>We accept:</strong><br><br>• Visa, Mastercard, Amex<br>• PayPal & Apple Pay<br>• Google Pay<br>• Klarna (pay in 4)<br>• Crypto: BTC, ETH, USDC<br><br>All transactions are SSL-encrypted and 100% secure. 🔒"
        },
        size: {
            patterns: ['size', 'sizing', 'fit', 'measurement', 'guide', 'small', 'medium', 'large'],
            reply: "📏 <strong>Need help with sizing?</strong><br><br>Each product page has a detailed size guide. Or open our interactive size guide right here. Want me to open it for you?",
            action: 'openSizeGuide'
        },
        discount: {
            patterns: ['discount', 'coupon', 'promo', 'code', 'offer', 'sale', 'deal', 'cheap'],
            reply: "🎁 <strong>Active offers just for you:</strong><br><br>• <strong>LUXE20</strong> — 20% off your first order<br>• <strong>VIP15</strong> — 15% off orders over $500<br>• Mid-Season Sale: up to 50% off (running now!)<br>• Free shipping on $150+<br><br>Sign up for our newsletter for exclusive perks. ✨"
        },
        contact: {
            patterns: ['contact', 'human', 'agent', 'phone', 'email', 'support', 'call'],
            reply: "📞 <strong>Get in touch:</strong><br><br>• <strong>Phone:</strong> +1 (800) LUXE-CARE<br>• <strong>Email:</strong> hello@luxe.com<br>• <strong>Hours:</strong> 24/7 concierge<br>• Live chat (right here with me!)<br><br>Want me to escalate to a human stylist?"
        },
        order: {
            patterns: ['order', 'track', 'tracking', 'where is', 'status', 'my order'],
            reply: "📦 Let me check that for you! Here's the status of your most recent order:",
            action: 'showOrder'
        },
        recommend: {
            patterns: ['recommend', 'suggest', 'looking for', 'show me', 'find me', 'what should i'],
            reply: "💎 I'd love to help you discover something beautiful! What are you in the mood for?",
            action: 'showCategories'
        },
        women: {
            patterns: ['women', 'female', 'dress', 'gown', 'her'],
            reply: "👗 Here are some of our most-loved women's pieces:",
            action: 'showProducts', filter: 'fashion'
        },
        men: {
            patterns: ['men', 'male', 'his', 'suit', 'coat', 'overcoat'],
            reply: "🧥 Check out these handpicked pieces for him:",
            action: 'showProducts', filter: 'fashion', subFilter: 'men'
        },
        watches: {
            patterns: ['watch', 'watches', 'timepiece', 'chronograph'],
            reply: "⌚ Our most coveted timepieces, right this way:",
            action: 'showProducts', filter: 'watches'
        },
        bags: {
            patterns: ['bag', 'bags', 'handbag', 'tote', 'purse', 'briefcase'],
            reply: "👜 Stunning bags, hand-picked for you:",
            action: 'showProducts', filter: 'bags'
        },
        jewelry: {
            patterns: ['jewelry', 'jewellery', 'necklace', 'ring', 'earring', 'bracelet', 'diamond'],
            reply: "💎 Exquisite jewelry to elevate any look:",
            action: 'showProducts', filter: 'jewelry'
        },
        gift: {
            patterns: ['gift', 'present', 'birthday', 'anniversary', 'wedding', 'valentine'],
            reply: "🎁 <strong>Perfect gift ideas:</strong><br><br>Gift cards from $50 to $5,000, beautifully packaged. Or shop our curated 'Perfect Gifts' edit. Want me to show you our top gift picks?",
            action: 'showProducts', filter: 'jewelry'
        },
        about: {
            patterns: ['about', 'who are', 'company', 'history', 'story', 'mission'],
            reply: "✨ <strong>About LUXE:</strong><br><br>Founded in 2015, LUXE curates the world's finest pieces from designer brands like Gucci, Prada, Hermès, and Chanel. Our mission is simple — to deliver extraordinary craftsmanship to those who appreciate the finer things in life. Serving 120+ countries and 500K+ happy customers. 🌍"
        },
        thanks: {
            patterns: ['thanks', 'thank you', 'thx', 'ty', 'appreciate', 'cheers'],
            replies: [
                "You're so welcome! ✨ Is there anything else I can help with?",
                "Happy to help! 💎 Let me know if you need anything else.",
                "My pleasure! 👑 I'm here whenever you need me."
            ]
        },
        bye: {
            patterns: ['bye', 'goodbye', 'see you', 'later', 'cya'],
            replies: [
                "Goodbye for now! 👋 Come back soon — and remember, I'm here 24/7. ✨",
                "Until next time! 💎 Wishing you a beautiful day.",
                "Bye! Don't be a stranger. 🌟"
            ]
        }
    };

    const QUICK_REPLIES_DEFAULT = [
        { text: 'Track my order', icon: 'package', intent: 'order' },
        { text: 'Shipping info', icon: 'truck', intent: 'shipping' },
        { text: 'Returns policy', icon: 'arrow-u-up-left', intent: 'returns' },
        { text: 'Size guide', icon: 'ruler', intent: 'size' },
        { text: 'Recommend something', icon: 'sparkle', intent: 'recommend' },
        { text: 'Discounts', icon: 'tag', intent: 'discount' },
        { text: 'Contact human', icon: 'headset', intent: 'contact' }
    ];

    const CATEGORY_QUICK_REPLIES = [
        { text: 'Women', icon: 'dress', intent: 'women' },
        { text: 'Men', icon: 't-shirt', intent: 'men' },
        { text: 'Watches', icon: 'watch', intent: 'watches' },
        { text: 'Jewelry', icon: 'diamond', intent: 'jewelry' },
        { text: 'Bags', icon: 'handbag', intent: 'bags' }
    ];

    const FALLBACK_REPLIES = [
        "Hmm, I'm not quite sure I caught that. Could you rephrase? Or try one of these options below 👇",
        "Let me think... 🤔 I'd love to help — could you be a bit more specific? Try the suggestions below.",
        "I want to make sure I give you the right answer. Could you tell me a bit more? Or pick a topic below."
    ];

    // ===== DOM SETUP =====
    let dom = {};

    function initDOM() {
        dom.launcher = document.getElementById('chatLauncher');
        dom.window = document.getElementById('chatWindow');
        dom.body = document.getElementById('chatBody');
        dom.input = document.getElementById('chatInput');
        dom.send = document.getElementById('chatSend');
        dom.close = document.getElementById('chatClose');
        dom.min = document.getElementById('chatMinimize');
        dom.typing = document.getElementById('chatTyping');
        dom.qr = document.getElementById('chatQuickReplies');
        dom.badge = document.getElementById('chatLauncherBadge');
        dom.emojiBtn = document.getElementById('chatEmojiBtn');
    }

    // ===== UTILITIES =====
    const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

    function timeNow() {
        const d = new Date();
        return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    }

    function detectIntent(text) {
        const lower = text.toLowerCase().trim();
        for (const key in KNOWLEDGE) {
            const k = KNOWLEDGE[key];
            for (const p of k.patterns) {
                // word boundary or substring
                if (lower.includes(p)) return key;
            }
        }
        return null;
    }

    // ===== MESSAGE RENDERING =====
    function appendUserMsg(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg user';
        div.innerHTML = `
            <div class="chat-msg-avatar">U</div>
            <div>
                <div class="chat-msg-bubble">${escapeHTML(text)}</div>
                <div class="chat-msg-time" style="text-align:right">${timeNow()}</div>
            </div>
        `;
        dom.body.appendChild(div);
        scrollToBottom();
    }

    function appendBotMsg(html) {
        const div = document.createElement('div');
        div.className = 'chat-msg bot';
        div.innerHTML = `
            <div class="chat-msg-avatar">L</div>
            <div>
                <div class="chat-msg-bubble">${html}</div>
                <div class="chat-msg-time">${timeNow()} · Luxa</div>
            </div>
        `;
        dom.body.appendChild(div);
        scrollToBottom();
    }

    function appendProductCard(product) {
        const div = document.createElement('div');
        div.className = 'chat-product-card';
        div.innerHTML = `
            <div class="chat-product-img" style="background:${product.gradient}">${product.emoji}</div>
            <div class="chat-product-info">
                <h6>${product.title}</h6>
                <div class="cp-price">$${product.price.toLocaleString()}</div>
                <div class="chat-product-actions">
                    <button data-id="${product.id}" class="chat-add-cart"><i class="ph-fill ph-shopping-bag"></i> Add to Cart</button>
                    <button data-id="${product.id}" class="cp-secondary chat-view-product">View</button>
                </div>
            </div>
        `;
        dom.body.appendChild(div);

        div.querySelector('.chat-add-cart').addEventListener('click', (e) => {
            const id = +e.currentTarget.dataset.id;
            window.LUXE && window.LUXE.addToCart && window.LUXE.addToCart(id);
            appendBotMsg(`Added <strong>${product.title}</strong> to your cart! 🛍️ Anything else?`);
        });
        div.querySelector('.chat-view-product').addEventListener('click', (e) => {
            const id = +e.currentTarget.dataset.id;
            window.LUXE && window.LUXE.openQuickView && window.LUXE.openQuickView(id);
            closeChat();
        });

        scrollToBottom();
    }

    function appendOrderTracking() {
        const div = document.createElement('div');
        div.className = 'chat-order-card';
        div.innerHTML = `
            <h6><i class="ph-fill ph-package"></i> Order #LX-2026-${Math.floor(1000 + Math.random()*9000)}</h6>
            <div class="order-timeline">
                <div class="order-step done"><span class="order-step-dot"></span><span>Order placed</span></div>
                <div class="order-step done"><span class="order-step-dot"></span><span>Payment confirmed</span></div>
                <div class="order-step done"><span class="order-step-dot"></span><span>Packed in signature box</span></div>
                <div class="order-step active"><span class="order-step-dot"></span><span>In transit · Arriving tomorrow</span></div>
                <div class="order-step"><span class="order-step-dot"></span><span>Delivered</span></div>
            </div>
        `;
        dom.body.appendChild(div);
        scrollToBottom();
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function scrollToBottom() {
        requestAnimationFrame(() => {
            dom.body.scrollTop = dom.body.scrollHeight;
        });
    }

    // ===== QUICK REPLIES =====
    function renderQuickReplies(replies) {
        dom.qr.innerHTML = '';
        replies.forEach((r, i) => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply';
            btn.style.animationDelay = (i * 0.05) + 's';
            btn.innerHTML = `<i class="ph ph-${r.icon}"></i>${r.text}`;
            btn.addEventListener('click', () => {
                appendUserMsg(r.text);
                clearQuickReplies();
                processIntent(r.intent, r.text);
            });
            dom.qr.appendChild(btn);
        });
    }

    function clearQuickReplies() {
        dom.qr.innerHTML = '';
    }

    // ===== TYPING SIMULATION =====
    function showTyping() {
        dom.typing.style.display = 'flex';
        scrollToBottom();
    }
    function hideTyping() {
        dom.typing.style.display = 'none';
    }

    // ===== INTENT PROCESSING =====
    function processIntent(intent, originalText) {
        showTyping();
        const delay = 500 + Math.random() * 700;

        setTimeout(() => {
            hideTyping();

            if (!intent) {
                appendBotMsg(pickRandom(FALLBACK_REPLIES));
                renderQuickReplies(QUICK_REPLIES_DEFAULT);
                return;
            }

            const k = KNOWLEDGE[intent];
            const reply = k.reply || pickRandom(k.replies);
            appendBotMsg(reply);

            // Handle action
            if (k.action === 'showOrder') {
                setTimeout(() => appendOrderTracking(), 400);
                setTimeout(() => renderQuickReplies([
                    { text: 'Cancel order', icon: 'x-circle', intent: 'returns' },
                    { text: 'Change address', icon: 'map-pin', intent: 'contact' },
                    { text: 'Back', icon: 'arrow-left', intent: 'greetings' }
                ]), 800);
            } else if (k.action === 'showCategories') {
                setTimeout(() => renderQuickReplies(CATEGORY_QUICK_REPLIES), 300);
            } else if (k.action === 'showProducts') {
                const all = window.ALL_PRODUCTS || [];
                let filtered = all.filter(p => p.category === k.filter);
                if (filtered.length === 0) filtered = all;
                filtered.slice(0, 3).forEach((p, i) => {
                    setTimeout(() => appendProductCard(p), 300 + i * 200);
                });
                setTimeout(() => renderQuickReplies([
                    { text: 'Show more', icon: 'plus', intent: intent },
                    { text: 'Different category', icon: 'arrows-clockwise', intent: 'recommend' },
                    { text: 'Help with size', icon: 'ruler', intent: 'size' }
                ]), 1200);
            } else if (k.action === 'openSizeGuide') {
                setTimeout(() => {
                    if (window.LUXE && window.LUXE.openSizeGuide) {
                        window.LUXE.openSizeGuide();
                    }
                }, 400);
                renderQuickReplies(QUICK_REPLIES_DEFAULT);
            } else {
                renderQuickReplies(QUICK_REPLIES_DEFAULT);
            }
        }, delay);
    }

    // ===== USER INPUT HANDLER =====
    function handleUserInput() {
        const text = dom.input.value.trim();
        if (!text) return;
        appendUserMsg(text);
        dom.input.value = '';
        clearQuickReplies();

        const intent = detectIntent(text);
        processIntent(intent, text);
    }

    // ===== OPEN/CLOSE =====
    function openChat() {
        CHAT_STATE.isOpen = true;
        dom.window.classList.add('active');
        dom.launcher.classList.add('hidden');
        dom.badge.style.display = 'none';

        if (CHAT_STATE.firstOpen) {
            CHAT_STATE.firstOpen = false;
            renderWelcome();
        }

        setTimeout(() => dom.input.focus(), 400);
    }

    function closeChat() {
        CHAT_STATE.isOpen = false;
        dom.window.classList.remove('active');
        dom.launcher.classList.remove('hidden');
    }

    function renderWelcome() {
        dom.body.innerHTML = `
            <div class="chat-welcome">
                <div class="chat-welcome-icon"><i class="ph-fill ph-sparkle"></i></div>
                <h5>Hi! I'm Luxa ✨</h5>
                <p>Your personal LUXE concierge.<br>How can I make your day extraordinary?</p>
            </div>
        `;
        setTimeout(() => {
            appendBotMsg("👋 Welcome to LUXE! I can help you find products, track orders, answer questions, or get you in touch with a human stylist. What would you like to explore?");
            renderQuickReplies(QUICK_REPLIES_DEFAULT);
        }, 600);
    }

    // ===== EMOJI PICKER =====
    function setupEmojiPicker() {
        const emojis = ['😊', '😍', '🥰', '😎', '🤩', '💎', '👑', '✨', '🎁', '👗', '👜', '⌚', '💍', '🛍️', '🌹', '💐', '🔥'];
        const picker = document.createElement('div');
        picker.className = 'emoji-picker';
        emojis.forEach(em => {
            const sp = document.createElement('span');
            sp.textContent = em;
            sp.addEventListener('click', () => {
                dom.input.value += em;
                dom.input.focus();
                picker.classList.remove('active');
            });
            picker.appendChild(sp);
        });
        dom.window.appendChild(picker);
        dom.emojiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            picker.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!picker.contains(e.target) && e.target !== dom.emojiBtn) {
                picker.classList.remove('active');
            }
        });
    }

    // ===== INIT =====
    function init() {
        initDOM();
        if (!dom.launcher || !dom.window) return;

        dom.launcher.addEventListener('click', openChat);
        dom.close.addEventListener('click', closeChat);
        dom.min.addEventListener('click', closeChat);
        dom.send.addEventListener('click', handleUserInput);
        dom.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleUserInput();
            }
        });

        setupEmojiPicker();

        // Auto-pop launcher tooltip after a delay if user hasn't engaged
        setTimeout(() => {
            if (!CHAT_STATE.isOpen && !sessionStorage.getItem('luxe-chat-seen')) {
                dom.launcher.style.animation = 'badgeBounce .6s ease';
                sessionStorage.setItem('luxe-chat-seen', '1');
            }
        }, 5000);

        // Expose API for other modules
        window.LUXA = {
            open: openChat,
            close: closeChat,
            sendBotMessage: appendBotMsg
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
