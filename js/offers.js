/* ==========================================================================
   ROYAL BITES — Offers page behaviour
   Depends on products.js and cart.js being loaded first.
   ========================================================================== */

(function () {
    "use strict";

    // Claim offer -> add the linked product to cart and go to cart page
    document.querySelectorAll(".claim-offer-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const productId = btn.dataset.productId;
            addToCart(productId, 1);
            showToast("Added to cart", "success");
            setTimeout(function () {
                window.location.href = "cart.html";
            }, 500);
        });
    });

    // Copy coupon code
    document.querySelectorAll(".copy-code-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const code = btn.dataset.code;
            navigator.clipboard.writeText(code).then(function () {
                showToast("Coupon copied!", "dark");
            });
        });
    });

    // Apply coupon form (also present on cart/order pages, but offers page has its own quick-apply)
    const couponForm = document.getElementById("offerCouponForm");
    if (couponForm) {
        couponForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const input = document.getElementById("offerCouponInput");
            const result = applyCoupon(input.value);
            showToast(result.message, result.success ? "success" : "danger");
        });
    }

    // Countdown timer for limited offers
    document.querySelectorAll("[data-countdown-hours]").forEach(function (box) {
        const hours = Number(box.dataset.countdownHours) || 24;
        const target = new Date(Date.now() + hours * 60 * 60 * 1000);

        function tick() {
            const now = new Date();
            let diff = target - now;
            if (diff <= 0) {
                box.innerHTML = '<span class="fw-bold text-danger">OFFER EXPIRED</span>';
                clearInterval(timer);
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            diff -= days * (1000 * 60 * 60 * 24);
            const hrs = Math.floor(diff / (1000 * 60 * 60));
            diff -= hrs * (1000 * 60 * 60);
            const mins = Math.floor(diff / (1000 * 60));
            diff -= mins * (1000 * 60);
            const secs = Math.floor(diff / 1000);
            box.querySelector('[data-u="d"]').textContent = String(days).padStart(2, "0");
            box.querySelector('[data-u="h"]').textContent = String(hrs).padStart(2, "0");
            box.querySelector('[data-u="m"]').textContent = String(mins).padStart(2, "0");
            box.querySelector('[data-u="s"]').textContent = String(secs).padStart(2, "0");
        }
        tick();
        const timer = setInterval(tick, 1000);
    });
})();
