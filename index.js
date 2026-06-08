// SN ART - Heritage eCommerce Logic

// ==========================================================================
// 1. Product Catalog
// Default/fallback catalogue. When Firebase is configured and the "products"
// collection has documents, these are replaced live (see loadProductsFromFirestore).
// ==========================================================================
let products = [
    {
        id: "p1",
        name: "Oval Market Tokri",
        category: "tokri",
        categoryName: "Kashmiri Tokri Baskets",
        price: 3200,
        rating: 5.0,
        reviews: 18,
        image: "assets/tokri_basket.png",
        badge: "GI-Tagged",
        details: "Handwoven in the wetlands of Ganderbal, this oval wicker basket utilizes finest local willow. Known for its high load-bearing capacity and timeless structural beauty, it is perfect for market shopping, picnics, or rustic home styling.",
        dimensions: "16\" x 12\" x 9\" (excluding handle)",
        material: "Organic Willow Wicker",
        origin: "Ganderbal, Jammu & Kashmir"
    },
    {
        id: "p2",
        name: "Decorative Papier Mâché Vase",
        category: "papier_mache",
        categoryName: "Papier Mâché Artifacts",
        price: 4800,
        rating: 5.0,
        reviews: 24,
        image: "assets/papier_mache.png",
        badge: "Artisan Crafted",
        details: "An exquisite papier-mâché vase decorated with Gul-andar-Gul (flower within flower) patterns. Masterfully painted by hand using natural mineral pigments and sealed with layers of genuine lacquer for a high-gloss museum finish.",
        dimensions: "12\" Height x 6\" Diameter",
        material: "Recycled Paper Pulp, Mineral Colors, Lacquer",
        origin: "Zadibal, Srinagar"
    },
    {
        id: "p3",
        name: "Paisley Pashmina Stole",
        category: "pashmina",
        categoryName: "Pashmina & Kani Shawls",
        price: 12500,
        rating: 5.0,
        reviews: 32,
        image: "assets/pashmina_shawl.png",
        badge: "Pure GI Pashmina",
        details: "Woven on traditional wooden looms from whisper-soft hand-spun Changthangi cashmere. Adorned with delicate Sozni embroidery along the borders, depicting traditional Kashmiri paisley motifs that take weeks of meticulous needlework.",
        dimensions: "80\" x 28\"",
        material: "100% Cashmere Pashmina Wool",
        origin: "Kanihama, Kashmir"
    },
    {
        id: "p4",
        name: "Walnut Chinar Wall Art",
        category: "wood_carving",
        categoryName: "Wood Carving & Khatamband",
        price: 6400,
        rating: 5.0,
        reviews: 15,
        image: "assets/wood_carving.png",
        badge: "Masterpiece",
        details: "A solid seasoned walnut wood plaque displaying deep relief carving of the iconic autumn Chinar leaf. Meticulously shaped using chisels by master woodcarvers, showcasing natural grains and stained with light walnut oil.",
        dimensions: "18\" x 18\" x 1.5\"",
        material: "Seasoned Solid Walnut Wood",
        origin: "Safakadal, Srinagar"
    },
    {
        id: "p5",
        name: "Willow Picnic Basket",
        category: "tokri",
        categoryName: "Kashmiri Tokri Baskets",
        price: 2800,
        rating: 4.8,
        reviews: 12,
        image: "assets/tokri_basket.png",
        badge: "Handwoven",
        details: "A robust rectangular basket with double-lidded openings and leather straps, handcrafted for outdoor excursions. Features excellent ventilation and a traditional wicker handle integrated directly into the structural frame.",
        dimensions: "14\" x 10\" x 8\"",
        material: "Natural Willow Wicker, Vegan Leather Straps",
        origin: "Ganderbal, Jammu & Kashmir"
    },
    {
        id: "p6",
        name: "Imperial Kani Shawl",
        category: "pashmina",
        categoryName: "Pashmina & Kani Shawls",
        price: 22500,
        rating: 5.0,
        reviews: 8,
        image: "assets/pashmina_shawl.png",
        badge: "Limited Edition",
        details: "A highly prized Kani shawl, woven using small eyeless wooden sticks called 'Kanis' rather than shuttles. The pattern is woven code-by-code according to a written script called 'Talim', creating an heirloom masterpiece.",
        dimensions: "80\" x 40\"",
        material: "100% Changthangi Cashmere",
        origin: "Kanihama, Kashmir"
    },
    {
        id: "p7",
        name: "Chinar Leaf Candle Holder",
        category: "wood_carving",
        categoryName: "Wood Carving & Khatamband",
        price: 5400,
        rating: 4.9,
        reviews: 13,
        image: "assets/wood_carving.png",
        badge: "Artisan Craft",
        details: "A hand-carved walnut candle holder inspired by Kashmir's iconic Chinar leaf. Finished with warm copper accents, it brings a ceremonial glow to festive tables and luxury interiors.",
        dimensions: "7\" x 7\" x 3\"",
        material: "Seasoned Walnut Wood, Copper Inlay",
        origin: "Safakadal, Srinagar"
    }
];

// ==========================================================================
// 2. Artisan Team Directory Data
// ==========================================================================
const artisans = [
    {
        name: "Ghulam Nabi",
        specialty: "Tokri Weaving",
        experience: "45 Years of Experience",
        bio: "\"Weaving is not just work; it is a conversation with the willow stalks. Each bend and knot is a decision passed down through my grandfather. We keep the soul of the wetlands alive in every basket we finish.\"",
        image: "assets/hero_artisan.png"
    },
    {
        name: "Fatima Begum",
        specialty: "Sozni Needlework",
        experience: "28 Years of Experience",
        bio: "\"My needle is an extension of my sight. Embroidering a single Pashmina shawl requires patience that modern machines cannot understand. Every paisley represents a season, a breeze, a prayer.\"",
        image: "assets/pashmina_shawl.png"
    },
    {
        name: "Bashir Ahmad",
        specialty: "Walnut Wood Carving",
        experience: "39 Years of Experience",
        bio: "\"Walnut wood is alive. It responds to the temperature, the moisture, and the pressure of the chisel. To carve a Chinar leaf is to freeze a moment of autumn in solid timber forever.\"",
        image: "assets/wood_carving.png"
    },
    {
        name: "Mohammad Yousuf",
        specialty: "Papier Mâché painting",
        experience: "34 Years of Experience",
        bio: "\"I mix mineral colors the way my ancestors did. Applying real gold leaf onto paper-pulp requires absolute stillness of breath. We paint the stories of the Mughal gardens in miniature motifs.\"",
        image: "assets/papier_mache.png"
    },
    {
        name: "Ameena Khatri",
        specialty: "Kani Embroidery",
        experience: "22 Years of Experience",
        bio: "\"Every pattern I weave is a family story. My Kani motifs are counted thread by thread, and each shawl sends a blessing with every fold.\"",
        image: "assets/pashmina_shawl.png"
    }
];

// ==========================================================================
// 3. Application State
// ==========================================================================
let cart = JSON.parse(localStorage.getItem("sn_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("sn_wishlist")) || [];
let currentArtisanIndex = 0;

// ==========================================================================
// 4. Initializer & Event Listeners Binding
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Luxury Loader Trigger
    initLoader();

    // Mouse follow glow
    initMouseGlow();

    // Populate Grid
    renderProducts("all");
    updateBadges();
    initUnifiedScroll();   // header + scroll-spy + parallax in one rAF loop
    initRevealAnimations();
    setupArtisanShowcase();
    setupNewsletter();

    // Testimonial slider
    initTestimonialSlider();

    // Animated counters
    initAnimatedCounters();

    // Premium effects
    initLightbox();
    initButtonRipples();
    initMagneticButtons();

    // Setup Drawers & Modals
    setupDrawerEvents("cartTrigger", "cartCloseBtn", "cartDrawer", "cartDrawerOverlay");
    setupDrawerEvents("wishlistTrigger", "wishlistCloseBtn", "wishlistDrawer", "wishlistDrawerOverlay");
    setupDrawerEvents("termsTrigger", "termsCloseBtn", "termsDrawer", "termsDrawerOverlay");
    setupSearchEvents();
    setupQuickViewEvents();

    // Global keyboard: close any open drawer/modal with Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAllDrawers();
            document.getElementById("navMenu").classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    // Checkout Event — opens the in-cart payment step
    document.getElementById("checkoutBtn").addEventListener("click", showPaymentStep);

    // Payment step controls
    document.getElementById("paymentBackBtn").addEventListener("click", hidePaymentStep);
    document.getElementById("payWhatsappBtn").addEventListener("click", checkoutViaWhatsApp);
    document.querySelectorAll(".pay-option").forEach(btn => {
        btn.addEventListener("click", () => payWithProvider(btn.getAttribute("data-pay")));
    });

    const clearCartBtn = document.getElementById("clearCartBtn");
    if (clearCartBtn) clearCartBtn.addEventListener("click", clearCart);
    const clearWishlistBtn = document.getElementById("clearWishlistBtn");
    if (clearWishlistBtn) clearWishlistBtn.addEventListener("click", clearWishlist);

    // Mobile Navigation Toggle
    const mobileToggle = document.getElementById("mobileNavToggle");
    const navMenu = document.getElementById("navMenu");
    mobileToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle("active");
        document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close mobile nav when clicking a link
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            document.body.style.overflow = "";
        });
    });

    // Close mobile nav when tapping outside the menu
    document.addEventListener("click", (e) => {
        if (
            navMenu.classList.contains("active") &&
            !navMenu.contains(e.target) &&
            !mobileToggle.contains(e.target)
        ) {
            navMenu.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
});

// ==========================================================================
// 5. Product Rendering & Grid Logic
// ==========================================================================
function renderProducts(filter = "all") {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

    filtered.forEach(p => {
        const isWishlisted = wishlist.includes(p.id);
        const card = document.createElement("div");
        
        let badgeClass = '';
        const badgeLower = p.badge.toLowerCase();
        if (badgeLower.includes('gi')) badgeClass = 'gi';
        else if (badgeLower.includes('artisan') || badgeLower.includes('handwoven')) badgeClass = 'artisan';
        else if (badgeLower.includes('masterpiece') || badgeLower.includes('limited')) badgeClass = 'masterpiece';

        card.className = `product-card reveal product-card-${badgeClass}`;

        card.innerHTML = `
            <div class="product-image-container">
                <span class="product-badge ${badgeClass}">${p.badge}</span>
                <img src="${p.image}" alt="${p.name}" loading="lazy" onclick="openQuickView('${p.id}')" style="cursor: pointer;">
                
                <button class="wishlist-heart-btn absolute-heart ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${p.id}', this)" aria-label="Add to Wishlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                
                <button class="quick-view-overlay-btn" onclick="openQuickView('${p.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Quick View
                </button>

                <button class="add-to-cart-slide-btn" onclick="addToCart('${p.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                    </svg>
                    Add to Cart
                </button>
            </div>
            <div class="product-info">
                <span class="product-cat">${p.categoryName}</span>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-rating">
                    ${getStarString(p.rating)}
                    <span class="product-reviews-count">(${p.reviews} reviews)</span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">₹${p.price.toLocaleString("en-IN")}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Re-initialize animations for new elements
    setTimeout(() => {
        const revealItems = grid.querySelectorAll(".reveal");
        revealItems.forEach(el => el.classList.add("reveal-active"));
    }, 50);
}

function getStarString(rating) {
    let stars = "";
    for (let i = 0; i < 5; i++) {
        stars += i < Math.floor(rating) ? "★" : "☆";
    }
    return stars;
}

function filterProducts(category) {
    // Update active tab styling
    document.querySelectorAll(".filter-tab").forEach(tab => {
        if (tab.getAttribute("data-filter") === category) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });

    // Bring the catalogue into view when triggered from elsewhere on the page
    // (category cards, footer links). Skip if it's already comfortably in view.
    const section = document.getElementById("featuredProducts");
    if (section) {
        const rect = section.getBoundingClientRect();
        const headerOffset = 90;
        if (rect.top > window.innerHeight * 0.5 || rect.bottom < headerOffset) {
            const targetY = window.scrollY + rect.top - headerOffset;
            window.scrollTo({ top: targetY, behavior: "smooth" });
        }
    }

    // Smooth transition
    const grid = document.getElementById("productGrid");
    grid.style.opacity = "0";
    grid.style.transform = "translateY(10px)";
    grid.style.transition = "opacity 0.3s ease, transform 0.3s ease";

    setTimeout(() => {
        renderProducts(category);
        grid.style.opacity = "1";
        grid.style.transform = "translateY(0)";
    }, 300);
}

// ==========================================================================
// 6. Shopping Cart Drawer Logic
// ==========================================================================
function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    saveCart();
    updateBadges();
    renderCart();
    openDrawer("cartDrawer", "cartDrawerOverlay");
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateBadges();
    renderCart();
}

function changeQty(productId, amount) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += amount;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateBadges();
        renderCart();
    }
}

function renderCart() {
    const list = document.getElementById("cartItemsList");
    const emptyState = document.getElementById("cartEmptyState");
    const footer = document.getElementById("cartDrawerFooter");

    // Always return to the cart view (not the payment step) when re-rendering
    const paymentStep = document.getElementById("paymentStep");
    if (paymentStep) paymentStep.style.display = "none";
    list.style.display = "";
    const title = document.getElementById("cartDrawerTitle");
    if (title) title.textContent = "Shopping Cart";

    list.innerHTML = "";

    if (cart.length === 0) {
        emptyState.style.display = "flex";
        footer.style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    footer.style.display = "block";

    let subtotal = 0;

    cart.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (!prod) return;

        const itemTotal = prod.price * item.quantity;
        subtotal += itemTotal;

        const el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML = `
            <img src="${prod.image}" alt="${prod.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${prod.name}</h4>
                <div class="cart-item-price">₹${prod.price.toLocaleString("en-IN")}</div>
                <div class="cart-item-qty-control">
                    <button class="qty-btn" onclick="changeQty('${item.id}', -1)" aria-label="Decrease quantity">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        `;
        list.appendChild(el);
    });

    document.getElementById("cartSubtotal").innerText = `₹${subtotal.toLocaleString("en-IN")}`;
    document.getElementById("cartTotal").innerText = `₹${subtotal.toLocaleString("en-IN")}`;
}

function saveCart() {
    localStorage.setItem("sn_cart", JSON.stringify(cart));
}

function clearCart() {
    if (cart.length === 0) {
        showCartToast("Your cart is already empty.");
        return;
    }
    cart = [];
    saveCart();
    updateBadges();
    renderCart();
    showCartToast("Your cart has been cleared.");
}

function clearWishlist() {
    if (wishlist.length === 0) {
        showCartToast("Your wishlist is already empty.");
        return;
    }
    wishlist = [];
    saveWishlist();
    updateBadges();
    renderWishlist();
    renderProducts(document.querySelector(".filter-tab.active")?.getAttribute("data-filter") || "all");
    showCartToast("Wishlist cleared. Explore new favorites.");
}

// ==========================================================================
// Firebase storefront bridge
// The Firestore module (firebase-store.js, loaded as a module in index.html)
// calls window.snLoadProducts(list) when live products are available. This
// swaps the catalogue and re-renders the grid + any open views.
// ==========================================================================
window.snLoadProducts = function (liveProducts) {
    if (!Array.isArray(liveProducts) || liveProducts.length === 0) return;
    products = liveProducts;
    const activeFilter = document.querySelector(".filter-tab.active")?.getAttribute("data-filter") || "all";
    renderProducts(activeFilter);
    // Refresh cart/wishlist views so names/prices stay in sync with live data
    if (typeof renderCart === "function") renderCart();
    if (typeof renderWishlist === "function") renderWishlist();
};

// SN ART WhatsApp business number (used for optional order confirmation)
const SN_WHATSAPP = "919103076776";

// ==========================================================================
// PAYMENT CONFIGURATION
// --------------------------------------------------------------------------
// Replace the `link` values below with your real payment URLs/intents when you
// integrate a gateway (Razorpay/Cashfree page, UPI deep link, payment link,
// etc.). The amount (in ₹) is available as the `amount` argument so you can
// build dynamic links. Leave a link empty ("") to keep it as a "coming soon"
// stub that shows a friendly message instead of navigating.
//
// Example (UPI deep link):
//   gpay: (amount) => `tez://upi/pay?pa=yourvpa@bank&pn=SN%20ART&am=${amount}&cu=INR`
// Example (hosted payment link):
//   upi:  (amount) => `https://your-payment-link?amount=${amount}`
// ==========================================================================
const PAYMENT_PROVIDERS = {
    gpay:    { label: "Google Pay", link: (amount) => "" },
    phonepe: { label: "PhonePe",    link: (amount) => "" },
    paytm:   { label: "Paytm UPI",  link: (amount) => "" },
    upi:     { label: "Any UPI App",link: (amount) => "" }
};

// Compute the current cart subtotal (₹).
function cartSubtotal() {
    return cart.reduce((sum, item) => {
        const prod = products.find(p => p.id === item.id);
        return prod ? sum + prod.price * item.quantity : sum;
    }, 0);
}

// ---- Payment step inside the cart drawer ----
function showPaymentStep() {
    if (cart.length === 0) { showCartToast("Your cart is empty."); return; }
    const total = cartSubtotal();
    document.getElementById("payAmount").textContent = "₹" + total.toLocaleString("en-IN");
    document.getElementById("cartItemsList").style.display = "none";
    document.getElementById("cartEmptyState").style.display = "none";
    document.getElementById("cartDrawerFooter").style.display = "none";
    document.getElementById("paymentStep").style.display = "block";
    document.getElementById("cartDrawerTitle").textContent = "Payment";
}

function hidePaymentStep() {
    document.getElementById("paymentStep").style.display = "none";
    document.getElementById("cartItemsList").style.display = "";
    document.getElementById("cartDrawerFooter").style.display = "block";
    document.getElementById("cartDrawerTitle").textContent = "Shopping Cart";
}

// Handle a payment provider selection.
// If a real link is configured for the provider it navigates there;
// otherwise it shows a friendly "coming soon" message (so the UI is fully
// functional and ready for you to plug in payment links later).
function payWithProvider(method) {
    const total = cartSubtotal();
    if (total <= 0) { showCartToast("Your cart is empty."); return; }

    const provider = PAYMENT_PROVIDERS[method];
    if (!provider) return;

    const link = (provider.link && provider.link(total)) || "";
    if (link) {
        // Real payment link configured — open it.
        if (link.startsWith("upi://") || link.startsWith("tez://") ||
            link.startsWith("phonepe://") || link.startsWith("paytmmp://")) {
            window.location.href = link; // UPI app intent
        } else {
            window.open(link, "_blank", "noopener,noreferrer"); // hosted page
        }
    } else {
        // No link yet — graceful placeholder.
        showCartToast(`${provider.label} payment will be available soon.`);
    }
}

// Build an order summary and open WhatsApp with the details pre-filled.
function checkoutViaWhatsApp() {
    if (cart.length === 0) {
        showCartToast("Your cart is empty.");
        return;
    }

    let subtotal = 0;
    const lines = cart.map((item, i) => {
        const prod = products.find(p => p.id === item.id);
        if (!prod) return "";
        const lineTotal = prod.price * item.quantity;
        subtotal += lineTotal;
        return `${i + 1}. ${prod.name} — Qty ${item.quantity} x ₹${prod.price.toLocaleString("en-IN")} = ₹${lineTotal.toLocaleString("en-IN")}`;
    }).filter(Boolean);

    const message =
        `*New Order — SN ART*\n\n` +
        lines.join("\n") +
        `\n\n*Subtotal:* ₹${subtotal.toLocaleString("en-IN")}` +
        `\n*Shipping:* FREE` +
        `\n*Total:* ₹${subtotal.toLocaleString("en-IN")}` +
        `\n\nI would like to place this order. Please confirm availability and delivery to Ganderbal/Kashmir.`;

    const url = `https://wa.me/${SN_WHATSAPP}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(url, "_blank", "noopener,noreferrer");

    // Clear cart after handing off the order
    cart = [];
    saveCart();
    updateBadges();
    renderCart();
    closeAllDrawers();
    showCartToast("Opening WhatsApp to confirm your order…");
}

// Lightweight toast for cart feedback (reuses no external dependency)
function showCartToast(msg) {
    let toast = document.getElementById("snCartToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "snCartToast";
        toast.className = "sn-cart-toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showCartToast._t);
    showCartToast._t = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ==========================================================================
// 7. Wishlist Drawer Logic
// ==========================================================================
function toggleWishlist(productId, btnEl = null) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        if (btnEl) {
            btnEl.classList.remove("active");
            btnEl.querySelector("svg").setAttribute("fill", "none");
        }
    } else {
        wishlist.push(productId);
        if (btnEl) {
            btnEl.classList.add("active");
            btnEl.querySelector("svg").setAttribute("fill", "currentColor");
        }
    }
    saveWishlist();
    updateBadges();
    renderWishlist();
}

function removeWishlist(productId) {
    wishlist = wishlist.filter(id => id !== productId);
    saveWishlist();
    updateBadges();
    renderWishlist();
    renderProducts(document.querySelector(".filter-tab.active")?.getAttribute("data-filter") || "all");
}

function renderWishlist() {
    const list = document.getElementById("wishlistItemsList");
    const emptyState = document.getElementById("wishlistEmptyState");
    
    list.innerHTML = "";

    if (wishlist.length === 0) {
        emptyState.style.display = "flex";
        return;
    }

    emptyState.style.display = "none";

    wishlist.forEach(id => {
        const prod = products.find(p => p.id === id);
        if (!prod) return;

        const el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML = `
            <img src="${prod.image}" alt="${prod.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${prod.name}</h4>
                <div class="cart-item-price">₹${prod.price.toLocaleString("en-IN")}</div>
                <button class="btn btn-primary btn-sm" onclick="addToCart('${prod.id}')" style="margin-top: 5px;">Move to Cart</button>
            </div>
            <button class="cart-item-remove" onclick="removeWishlist('${prod.id}')" aria-label="Remove item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        `;
        list.appendChild(el);
    });
}

function saveWishlist() {
    localStorage.setItem("sn_wishlist", JSON.stringify(wishlist));
}

// Update badges in header
function updateBadges() {
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = wishlist.length;

    document.getElementById("cartBadge").innerText = cartCount;
    document.getElementById("wishlistBadge").innerText = wishlistCount;
}

// Drawer overlay controls
function setupDrawerEvents(triggerId, closeId, drawerId, overlayId) {
    const trigger = document.getElementById(triggerId);
    const close = document.getElementById(closeId);
    const drawer = document.getElementById(drawerId);
    const overlay = document.getElementById(overlayId);

    trigger.addEventListener("click", () => {
        if (drawerId === "cartDrawer") renderCart();
        if (drawerId === "wishlistDrawer") renderWishlist();
        openDrawer(drawerId, overlayId);
    });

    close.addEventListener("click", () => closeDrawer(drawerId, overlayId));
    overlay.addEventListener("click", () => closeDrawer(drawerId, overlayId));
}

function openDrawer(drawerId, overlayId) {
    document.getElementById(drawerId).classList.add("active");
    document.getElementById(overlayId).classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeDrawer(drawerId, overlayId) {
    document.getElementById(drawerId).classList.remove("active");
    document.getElementById(overlayId).classList.remove("active");
    document.body.style.overflow = "";
}

function closeAllDrawers() {
    document.querySelectorAll(".drawer, .drawer-overlay, .quick-view-modal, .quick-view-overlay, .search-modal").forEach(el => {
        el.classList.remove("active");
    });
    document.body.style.overflow = "";
}

// ==========================================================================
// 8. Search Overlay Modal Logic
// ==========================================================================
function setupSearchEvents() {
    const trigger = document.getElementById("searchTrigger");
    const close = document.getElementById("searchCloseBtn");
    const modal = document.getElementById("searchModal");
    const input = document.getElementById("searchInput");

    trigger.addEventListener("click", () => {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        setTimeout(() => input.focus(), 300);
    });

    close.addEventListener("click", () => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
        input.value = "";
        document.getElementById("searchResultsList").innerHTML = "";
        document.getElementById("searchResultsHeader").style.display = "none";
    });

    input.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const resultsList = document.getElementById("searchResultsList");
        const resultsHeader = document.getElementById("searchResultsHeader");

        if (query === "") {
            resultsList.innerHTML = "";
            resultsHeader.style.display = "none";
            return;
        }

        const matches = products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.details.toLowerCase().includes(query) || 
            p.categoryName.toLowerCase().includes(query)
        );

        resultsList.innerHTML = "";
        resultsHeader.style.display = "block";

        if (matches.length === 0) {
            resultsList.innerHTML = `<p style="padding: 1rem; color: var(--color-muted);">No products found matching '${query}'</p>`;
            return;
        }

        matches.forEach(p => {
            const el = document.createElement("div");
            el.className = "cart-item";
            el.style.cursor = "pointer";
            el.innerHTML = `
                <img src="${p.image}" alt="${p.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${p.name}</h4>
                    <div class="cart-item-price">₹${p.price.toLocaleString("en-IN")}</div>
                </div>
            `;
            el.addEventListener("click", () => {
                modal.classList.remove("active");
                input.value = "";
                openQuickView(p.id);
            });
            resultsList.appendChild(el);
        });
    });
}

function fillSearch(val) {
    const input = document.getElementById("searchInput");
    input.value = val;
    input.dispatchEvent(new Event("input"));
}

// ==========================================================================
// 9. Product Quick View Details Modal
// ==========================================================================
function setupQuickViewEvents() {
    const close = document.getElementById("quickViewCloseBtn");
    const overlay = document.getElementById("quickViewOverlay");

    close.addEventListener("click", () => {
        document.getElementById("quickViewModal").classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    });

    overlay.addEventListener("click", () => {
        document.getElementById("quickViewModal").classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    });
}

function openQuickView(productId) {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const content = document.getElementById("quickViewContent");
    const isWishlisted = wishlist.includes(prod.id);

    content.innerHTML = `
        <div class="qv-image-side">
            <img src="${prod.image}" alt="${prod.name}">
        </div>
        <div class="qv-info-side">
            <span class="qv-cat">${prod.categoryName}</span>
            <h2 class="qv-title" id="quickViewTitle">${prod.name}</h2>
            <div class="qv-rating-row">
                <span style="color: var(--color-gold); font-size: 1.1rem;">${getStarString(prod.rating)}</span>
                <span style="font-size: 0.85rem; color: var(--color-muted);">(${prod.reviews} reviews)</span>
            </div>
            <div class="qv-price">₹${prod.price.toLocaleString("en-IN")}</div>
            <p class="qv-desc">${prod.details}</p>
            <ul class="qv-meta-bullets">
                <li><strong>Dimensions:</strong> ${prod.dimensions}</li>
                <li><strong>Material:</strong> ${prod.material}</li>
                <li><strong>Origin:</strong> ${prod.origin}</li>
            </ul>
            <div class="qv-actions-row">
                <button class="btn btn-primary" onclick="addToCartAndClose('${prod.id}')">Add to Collection</button>
                <button class="qv-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlistAndRedraw('${prod.id}', this)" aria-label="Add to Wishlist">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;

    document.getElementById("quickViewModal").classList.add("active");
    document.getElementById("quickViewOverlay").classList.add("active");
    document.body.style.overflow = "hidden";
}

function addToCartAndClose(productId) {
    addToCart(productId);
    document.getElementById("quickViewModal").classList.remove("active");
    document.getElementById("quickViewOverlay").classList.remove("active");
    document.body.style.overflow = "";
}

function toggleWishlistAndRedraw(productId, btnEl) {
    toggleWishlist(productId);
    const isActive = wishlist.includes(productId);
    if (isActive) {
        btnEl.classList.add("active");
        btnEl.querySelector("svg").setAttribute("fill", "currentColor");
    } else {
        btnEl.classList.remove("active");
        btnEl.querySelector("svg").setAttribute("fill", "none");
    }
    // Re-render product grid in background
    renderProducts(document.querySelector(".filter-tab.active")?.getAttribute("data-filter") || "all");
}

// ==========================================================================
// 10. Artisan Heritage Carousel Showcase
// ==========================================================================
function setupArtisanShowcase() {
    const prev = document.getElementById("artisanPrev");
    const next = document.getElementById("artisanNext");

    if (!prev || !next) return;

    prev.addEventListener("click", () => navigateArtisan(-1));
    next.addEventListener("click", () => navigateArtisan(1));
}

function navigateArtisan(dir) {
    currentArtisanIndex += dir;
    if (currentArtisanIndex < 0) {
        currentArtisanIndex = artisans.length - 1;
    } else if (currentArtisanIndex >= artisans.length) {
        currentArtisanIndex = 0;
    }

    const data = artisans[currentArtisanIndex];
    const imgEl = document.getElementById("artisanImg");
    const specialtyEl = document.getElementById("artisanSpecialty");
    const experienceEl = document.getElementById("artisanYears");
    const nameEl = document.getElementById("artisanName");
    const bioEl = document.getElementById("artisanBio");
    const indicatorEl = document.getElementById("artisanIndicator");

    // Fade animation trigger
    const container = document.querySelector(".artisan-showcase");
    container.style.opacity = "0.5";
    container.style.transform = "scale(0.99)";
    container.style.transition = "opacity 0.4s ease, transform 0.4s ease";

    setTimeout(() => {
        imgEl.src = data.image;
        specialtyEl.innerText = data.specialty;
        experienceEl.innerText = data.experience;
        nameEl.innerText = data.name;
        bioEl.innerText = data.bio;
        indicatorEl.innerText = `${currentArtisanIndex + 1} / ${artisans.length}`;

        container.style.opacity = "1";
        container.style.transform = "scale(1)";
    }, 400);
}

// ==========================================================================
// 11. Reveal-on-Scroll Effects
// ==========================================================================
function initRevealAnimations() {
    const reveals = document.querySelectorAll(".reveal, .reveal-fade-up, .reveal-scale-in, .reveal-slide-left, .reveal-slide-right");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-active");
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(r => observer.observe(r));
}

// ==========================================================================
// 12. Sticky Nav Header Transition
// ==========================================================================
// ==========================================================================
// 12. Unified scroll handler (header + scroll-spy + parallax) — rAF throttled
// One scroll listener feeding a single requestAnimationFrame loop avoids the
// jank/glitches caused by multiple synchronous scroll handlers.
// ==========================================================================
function initUnifiedScroll() {
    const header = document.getElementById("mainHeader");
    const navLinks = Array.from(document.querySelectorAll(".nav-menu a"));
    const heroContainer = document.querySelector(".hero-container");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Cache section offsets; refresh on resize (avoids layout reads each scroll)
    let sections = [];
    function cacheSections() {
        sections = Array.from(document.querySelectorAll("section[id], footer[id]")).map(s => ({
            id: s.getAttribute("id"),
            top: s.offsetTop,
            height: s.offsetHeight
        }));
    }
    cacheSections();
    window.addEventListener("resize", debounce(cacheSections, 200));

    let ticking = false;
    let lastActive = "";

    function onScroll() {
        const y = window.scrollY;

        // 1. Header solid state
        if (y > 50) header.classList.add("scrolled");
        else header.classList.remove("scrolled");

        // 2. Parallax (container only — never the video, so Ken Burns is untouched)
        if (!reduceMotion && heroContainer && y < window.innerHeight) {
            heroContainer.style.transform = `translate3d(0, ${y * 0.15}px, 0)`;
        }

        // 3. Scroll-spy (active nav link)
        const pos = y + 120;
        let current = "";
        for (const s of sections) {
            if (pos >= s.top && pos < s.top + s.height) { current = s.id; break; }
        }
        if (current !== lastActive) {
            lastActive = current;
            navLinks.forEach(link => {
                const href = link.getAttribute("href");
                link.classList.toggle("active", href === `#${current}` || (current === "" && href === "#"));
            });
        }

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });

    onScroll(); // initial
}

// Small debounce helper
function debounce(fn, wait) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

// ==========================================================================
// 13. Newsletter Form Handling
// ==========================================================================
function setupNewsletter() {
    const form = document.getElementById("newsletterForm");
    const success = document.getElementById("newsletterSuccess");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Simulating loading state
        const btn = form.querySelector("button");
        const originalText = btn.innerText;
        btn.innerText = "Dispatching...";
        btn.disabled = true;

        setTimeout(() => {
            form.style.display = "none";
            success.style.display = "flex";
            success.style.opacity = "0";
            success.style.transition = "opacity 0.5s ease";
            setTimeout(() => {
                success.style.opacity = "1";
            }, 50);
        }, 1500);
    });
}

// ==========================================================================
// 14. Luxury Loader Animation
// ==========================================================================
function initLoader() {
    const loader = document.getElementById("pageLoader");
    if (!loader) return;
    
    // Hide loader after a smooth delay
    setTimeout(() => {
        loader.classList.add("fade-out");
    }, 1500);
}

// ==========================================================================
// 15. Mouse Follow Glow Element
// ==========================================================================
function initMouseGlow() {
    const glow = document.getElementById("mouseGlow");
    if (!glow) return;

    // Skip entirely on touch / coarse pointers (no cursor to follow)
    if (window.matchMedia("(hover: none)").matches) return;

    let mx = 0, my = 0, ticking = false;

    document.addEventListener("mousemove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                glow.style.transform = `translate3d(${mx}px, ${my}px, 0) translate3d(-50%, -50%, 0)`;
                glow.style.opacity = "1";
                ticking = false;
            });
        }
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
        glow.style.opacity = "0";
    });
}

// ==========================================================================
// 16. Hero Parallax — now handled inside initUnifiedScroll (container only),
// which avoids conflicting with the Ken Burns zoom on the video element.
// ==========================================================================

// ==========================================================================
// 17. Animated Stat Counters
// ==========================================================================
function initAnimatedCounters() {
    const counters = document.querySelectorAll(".counter");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute("data-target"), 10);
                let count = 0;
                const duration = 2000; // Animation duration in ms
                const stepTime = 20; // Step update interval in ms
                const steps = duration / stepTime;
                const increment = target / steps;
                
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        counter.innerText = target.toLocaleString("en-IN");
                        clearInterval(timer);
                    } else {
                        counter.innerText = Math.floor(count).toLocaleString("en-IN");
                    }
                }, stepTime);
                
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(c => observer.observe(c));
}

// ==========================================================================
// 18. Testimonial Slider Carousel
// ==========================================================================
function initTestimonialSlider() {
    const track = document.getElementById("testimonialTrack");
    const prevBtn = document.getElementById("testimonialPrev");
    const nextBtn = document.getElementById("testimonialNext");
    const dotsContainer = document.getElementById("testimonialDots");
    const slides = document.querySelectorAll(".testimonial-slide");

    if (!track || slides.length === 0) return;

    let index = 0;
    let autoSlideInterval;

    // Create dot indicators
    slides.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener("click", () => {
            index = i;
            updateSlider();
            resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".slider-dot");

    function updateSlider() {
        track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
        dots.forEach((dot, i) => {
            if (i === index) dot.classList.add("active");
            else dot.classList.remove("active");
        });
    }

    function nextSlide() {
        index = index < slides.length - 1 ? index + 1 : 0;
        updateSlider();
    }

    function prevSlide() {
        index = index > 0 ? index - 1 : slides.length - 1;
        updateSlider();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // Auto-scroll every 5 seconds
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoSlide();
    });

    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoSlide();
    });

    // Start auto play initially
    startAutoSlide();
}


// ==========================================================================
// 19. Lightbox Gallery Viewer
// ==========================================================================
function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    const imgEl = document.getElementById("lightboxImg");
    const captionEl = document.getElementById("lightboxCaption");
    const closeBtn = document.getElementById("lightboxClose");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");

    // Collect gallery images
    const items = Array.from(document.querySelectorAll(".gallery-grid .grid-item"));
    const slides = items.map(item => {
        const img = item.querySelector("img");
        const title = item.querySelector(".gallery-item-title");
        return {
            src: img ? img.getAttribute("src") : "",
            alt: img ? img.getAttribute("alt") : "",
            caption: title ? title.textContent : ""
        };
    });

    let current = 0;

    function show(index) {
        current = (index + slides.length) % slides.length;
        const slide = slides[current];
        imgEl.src = slide.src;
        imgEl.alt = slide.alt;
        captionEl.textContent = slide.caption;
    }

    function open(index) {
        show(index);
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function close() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

    items.forEach((item, i) => {
        item.addEventListener("click", () => open(i));
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", (e) => { e.stopPropagation(); show(current - 1); });
    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); show(current + 1); });

    // Close on backdrop click
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) close();
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(current - 1);
        if (e.key === "ArrowRight") show(current + 1);
    });

    // Touch swipe support
    let touchStartX = 0;
    lightbox.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 50) {
            show(diff > 0 ? current - 1 : current + 1);
        }
    }, { passive: true });
}

// ==========================================================================
// 20. Button Ripple Effect
// ==========================================================================
function initButtonRipples() {
    const buttons = document.querySelectorAll(".btn, .category-btn, .filter-tab");
    buttons.forEach(btn => {
        btn.addEventListener("click", function (e) {
            const circle = document.createElement("span");
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;
            const rect = this.getBoundingClientRect();
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add("ripple");

            const existing = this.querySelector(".ripple");
            if (existing) existing.remove();

            this.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        });
    });
}

// ==========================================================================
// 21. Magnetic Buttons (desktop pointer only)
// ==========================================================================
function initMagneticButtons() {
    // Skip on touch devices and when reduced motion is preferred
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    const magnets = document.querySelectorAll(".btn-primary, .btn-secondary");
    const strength = 0.35;

    magnets.forEach(magnet => {
        magnet.addEventListener("mousemove", (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            magnet.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
        });
        magnet.addEventListener("mouseleave", () => {
            magnet.style.transform = "translate3d(0, 0, 0)";
        });
    });
}
