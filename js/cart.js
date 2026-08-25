/* ==========================================================================
   ROYAL BITES — Cart engine (localStorage backed)
   Depends on products.js being loaded first.
   ========================================================================== */

const CART_KEY = "royalBitesCart";
const COUPON_KEY = "royalBitesCoupon";

const DELIVERY_FEE = 40;
const FREE_DELIVERY_THRESHOLD = 999;
const GST_RATE = 0.05;

function getCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, qty) {
    qty = qty || 1;
    const cart = getCart();
    const existing = cart.find(function (item) { return item.id === Number(productId); });
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id: Number(productId), qty: qty });
    }
    saveCart(cart);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(function (item) { return item.id !== Number(productId); });
    saveCart(cart);
}

function increaseQuantity(productId) {
    const cart = getCart();
    const item = cart.find(function (i) { return i.id === Number(productId); });
    if (item) {
        item.qty += 1;
        saveCart(cart);
    }
}

function decreaseQuantity(productId) {
    const cart = getCart();
    const item = cart.find(function (i) { return i.id === Number(productId); });
    if (item) {
        item.qty = Math.max(1, item.qty - 1);
        saveCart(cart);
    }
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(COUPON_KEY);
    updateCartCount();
}

function getCartItemCount() {
    return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

function getAppliedCoupon() {
    try {
        const raw = localStorage.getItem(COUPON_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function setAppliedCoupon(code) {
    localStorage.setItem(COUPON_KEY, JSON.stringify({ code: code }));
}

function clearAppliedCoupon() {
    localStorage.removeItem(COUPON_KEY);
}

function applyCoupon(codeRaw) {
    const code = (codeRaw || "").trim().toUpperCase();
    const coupon = COUPONS[code];
    if (!coupon) {
        return { success: false, message: "Invalid or expired coupon." };
    }
    const totals = calculateTotals(null);
    if (totals.subtotal < coupon.minOrder) {
        return { success: false, message: "Add " + formatPrice(coupon.minOrder) + " more to use this coupon." };
    }
    setAppliedCoupon(code);
    return { success: true, message: "Coupon applied successfully!" };
}

function calculateTotals(couponCodeOverride) {
    const cart = getCart();
    const items = cart.map(function (item) {
        const product = getProductById(item.id);
        return product ? { product: product, qty: item.qty, lineTotal: product.price * item.qty } : null;
    }).filter(Boolean);

    const subtotal = items.reduce(function (sum, i) { return sum + i.lineTotal; }, 0);

    let couponCode = couponCodeOverride !== undefined ? couponCodeOverride : (getAppliedCoupon() || {}).code;
    let discount = 0;
    let couponInfo = null;

    if (couponCode && COUPONS[couponCode]) {
        couponInfo = COUPONS[couponCode];
        if (subtotal >= couponInfo.minOrder) {
            if (couponInfo.category) {
                const catSubtotal = items
                    .filter(function (i) { return i.product.category === couponInfo.category; })
                    .reduce(function (sum, i) { return sum + i.lineTotal; }, 0);
                discount = couponInfo.type === "percent" ? Math.round(catSubtotal * couponInfo.value / 100) : Math.min(couponInfo.value, catSubtotal);
            } else if (couponInfo.type === "percent") {
                discount = Math.round(subtotal * couponInfo.value / 100);
            } else {
                discount = Math.min(couponInfo.value, subtotal);
            }
        } else {
            couponCode = null;
            couponInfo = null;
        }
    }

    const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const gst = Math.round((subtotal - discount) * GST_RATE);
    const total = Math.max(0, subtotal - discount + delivery + gst);

    return {
        items: items,
        subtotal: subtotal,
        discount: discount,
        delivery: delivery,
        gst: gst,
        total: total,
        couponCode: couponCode || null,
        couponInfo: couponInfo
    };
}

function updateCartCount() {
    const count = getCartItemCount();
    document.querySelectorAll(".nav-cart-badge").forEach(function (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
    });
}

document.addEventListener("DOMContentLoaded", updateCartCount);
