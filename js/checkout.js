/* ==========================================================================
   ROYAL BITES — Order / Checkout page behaviour
   Depends on products.js, cart.js, validation.js.
   ========================================================================== */

(function () {
    "use strict";

    const LAST_ORDER_KEY = "royalBitesLastOrder";
    const ORDERS_KEY = "royalBitesOrders";

    const DELIVERY_OPTIONS = {
        standard: { label: "Standard Delivery", fee: DELIVERY_FEE, eta: "30 - 40 Minutes", freeAbove: FREE_DELIVERY_THRESHOLD },
        express: { label: "Express Delivery", fee: 80, eta: "20 - 25 Minutes", freeAbove: null },
        pickup: { label: "Store Pickup", fee: 0, eta: "15 - 20 Minutes", freeAbove: null }
    };

    const form = document.getElementById("orderForm");
    const summaryEl = document.getElementById("orderSummaryContent");
    const deliveryEstimateEl = document.getElementById("deliveryEstimate");
    let selectedDelivery = "standard";
    let selectedPayment = "cod";

    function currentTotals() {
        const totals = calculateTotals();
        const option = DELIVERY_OPTIONS[selectedDelivery];
        let delivery = option.fee;
        if (option.freeAbove !== null && totals.subtotal >= option.freeAbove) {
            delivery = 0;
        }
        const total = Math.max(0, totals.subtotal - totals.discount + delivery + totals.gst);
        return Object.assign({}, totals, { delivery: delivery, total: total, deliveryLabel: option.label, deliveryEta: option.eta });
    }

    function renderSummary() {
        const totals = currentTotals();

        if (totals.items.length === 0) {
            summaryEl.innerHTML =
                '<div class="empty-state py-4"><div class="emoji mb-2">🛒</div><h6 class="fw-bold">Your cart is empty</h6>' +
                '<a href="menu.html" class="btn btn-danger rounded-pill btn-sm mt-2">Explore Menu</a></div>';
            deliveryEstimateEl.innerHTML = "";
            if (form) form.querySelector('button[type="submit"]').disabled = true;
            return;
        }
        if (form) form.querySelector('button[type="submit"]').disabled = false;

        let rows = "";
        totals.items.forEach(function (i) {
            rows +=
                '<div class="d-flex align-items-center mb-3">' +
                '<img src="' + i.product.image + '" width="56" height="56" class="rounded-3 me-3" style="object-fit:contain;background:#f8f8f8;">' +
                '<div class="flex-grow-1"><h6 class="mb-0 small fw-bold">' + i.product.name + '</h6><small class="text-muted">Qty: ' + i.qty + '</small></div>' +
                '<div class="fw-bold small">' + formatPrice(i.lineTotal) + '</div>' +
                '</div>';
        });

        const couponRow = totals.couponCode
            ? '<div class="d-flex justify-content-between mb-2 text-success small"><span>Coupon (' + totals.couponCode + ')</span><span>− ' + formatPrice(totals.discount) + '</span></div>'
            : '';

        summaryEl.innerHTML =
            rows + '<hr>' +
            '<div class="d-flex justify-content-between mb-2"><span>Subtotal</span><span>' + formatPrice(totals.subtotal) + '</span></div>' +
            couponRow +
            '<div class="d-flex justify-content-between mb-2"><span>Delivery</span><span>' + (totals.delivery === 0 ? "FREE" : formatPrice(totals.delivery)) + '</span></div>' +
            '<div class="d-flex justify-content-between mb-2"><span>GST (5%)</span><span>' + formatPrice(totals.gst) + '</span></div>' +
            '<hr>' +
            '<div class="d-flex justify-content-between"><h4>Total</h4><h4 class="text-danger">' + formatPrice(totals.total) + '</h4></div>';

        deliveryEstimateEl.innerHTML =
            '<h4 class="fw-bold mb-0">🍗 Fresh & Hot</h4>' +
            '<p class="mb-0">Estimated ' + totals.deliveryLabel + '<br>' + totals.deliveryEta + '</p>';
    }

    // Delivery option selection
    document.querySelectorAll(".delivery-option").forEach(function (el) {
        el.addEventListener("click", function () {
            document.querySelectorAll(".delivery-option").forEach(function (d) { d.classList.remove("active"); });
            el.classList.add("active");
            el.querySelector('input[type="radio"]').checked = true;
            selectedDelivery = el.dataset.delivery;
            renderSummary();
        });
    });

    // Payment option selection
    document.querySelectorAll(".payment-option").forEach(function (el) {
        el.addEventListener("click", function () {
            document.querySelectorAll(".payment-option").forEach(function (d) { d.classList.remove("active"); });
            el.classList.add("active");
            el.querySelector('input[type="radio"]').checked = true;
            selectedPayment = el.dataset.payment;
            document.getElementById("cardFields").classList.toggle("d-none", selectedPayment !== "card");
        });
    });

    // Coupon apply on order page
    const orderCouponApplyBtn = document.getElementById("orderCouponApplyBtn");
    if (orderCouponApplyBtn) {
        orderCouponApplyBtn.addEventListener("click", function () {
            const input = document.getElementById("orderCouponInput");
            const result = applyCoupon(input.value);
            showToast(result.message, result.success ? "success" : "danger");
            renderSummary();
        });
    }

    function generateOrderId() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        const rand = Math.floor(1000 + Math.random() * 9000);
        return "RB-" + y + m + d + "-" + rand;
    }

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const totals = currentTotals();
            if (totals.items.length === 0) {
                showToast("Your cart is empty.", "danger");
                return;
            }

            const nameInput = document.getElementById("custName");
            const phoneInput = document.getElementById("custPhone");
            const emailInput = document.getElementById("custEmail");
            const addressInput = document.getElementById("custAddress");
            const cityInput = document.getElementById("custCity");
            const pincodeInput = document.getElementById("custPincode");

            let valid = true;
            valid = setFieldState(nameInput, Validate.name(nameInput.value)) && valid;
            valid = setFieldState(phoneInput, Validate.phone(phoneInput.value)) && valid;
            valid = setFieldState(emailInput, Validate.email(emailInput.value)) && valid;
            valid = setFieldState(addressInput, Validate.address(addressInput.value)) && valid;
            valid = setFieldState(cityInput, Validate.notEmpty(cityInput.value)) && valid;
            valid = setFieldState(pincodeInput, Validate.pincode(pincodeInput.value)) && valid;

            if (selectedPayment === "card") {
                const cardNumber = document.getElementById("cardNumber");
                const cardExpiry = document.getElementById("cardExpiry");
                const cardCvv = document.getElementById("cardCvv");
                valid = setFieldState(cardNumber, /^\d{16}$/.test(cardNumber.value.replace(/\s/g, ""))) && valid;
                valid = setFieldState(cardExpiry, /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.value.trim())) && valid;
                valid = setFieldState(cardCvv, /^\d{3}$/.test(cardCvv.value.trim())) && valid;
            }

            if (!valid) {
                showToast("Please fix the highlighted fields.", "danger");
                return;
            }

            const order = {
                id: generateOrderId(),
                date: new Date().toISOString(),
                customer: {
                    name: nameInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    email: emailInput.value.trim(),
                    address: addressInput.value.trim(),
                    city: cityInput.value.trim(),
                    pincode: pincodeInput.value.trim()
                },
                delivery: { option: selectedDelivery, label: totals.deliveryLabel, eta: totals.deliveryEta, fee: totals.delivery },
                payment: selectedPayment,
                items: totals.items.map(function (i) {
                    return { id: i.product.id, name: i.product.name, image: i.product.image, price: i.product.price, qty: i.qty, lineTotal: i.lineTotal };
                }),
                subtotal: totals.subtotal,
                discount: totals.discount,
                couponCode: totals.couponCode,
                gst: totals.gst,
                total: totals.total,
                status: "Confirmed"
            };

            localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
            const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
            allOrders.unshift(order);
            localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));

            clearCart();
            window.location.href = "order-success.html";
        });
    }

    renderSummary();
})();
