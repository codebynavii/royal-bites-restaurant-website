/* ==========================================================================
   ROYAL BITES — Global site behaviour (every page)
   ========================================================================== */

(function () {
    "use strict";

    /* ---- Active nav link highlighting ---- */
    function setActiveNav() {
        const current = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".navbar-nav .nav-link[href]").forEach(function (link) {
            const href = link.getAttribute("href");
            if (href === current || (current === "" && href === "index.html")) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        });
    }

    /* ---- Collapse mobile navbar after clicking a link ---- */
    function collapseNavOnClick() {
        const nav = document.getElementById("mainNav");
        if (!nav) return;
        nav.querySelectorAll(".nav-link, .btn").forEach(function (el) {
            el.addEventListener("click", function () {
                if (nav.classList.contains("show") && window.bootstrap) {
                    const collapse = window.bootstrap.Collapse.getOrCreateInstance(nav);
                    collapse.hide();
                }
            });
        });
    }

    /* ---- Back to top button ---- */
    function initBackToTop() {
        const btn = document.getElementById("backToTop");
        if (!btn) return;
        window.addEventListener("scroll", function () {
            btn.classList.toggle("show", window.scrollY > 400);
        });
        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ---- Scroll reveal animations ---- */
    function initScrollReveal() {
        const targets = document.querySelectorAll(".reveal");
        if (!targets.length) return;
        if (!("IntersectionObserver" in window)) {
            targets.forEach(function (t) { t.classList.add("in-view"); });
            return;
        }
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        targets.forEach(function (t) { observer.observe(t); });
    }

    /* ---- Toast helper ----
       Usage: showToast("Added to cart", "success" | "danger" | "warning" | "dark")
    ---- */
    window.showToast = function (message, variant) {
        variant = variant || "dark";
        let container = document.getElementById("toastContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "toastContainer";
            container.className = "toast-container position-fixed bottom-0 end-0 p-3";
            container.style.zIndex = "1080";
            document.body.appendChild(container);
        }
        const toastEl = document.createElement("div");
        toastEl.className = "toast align-items-center text-white bg-" + variant + " border-0";
        toastEl.setAttribute("role", "alert");
        toastEl.innerHTML =
            '<div class="d-flex">' +
            '<div class="toast-body fw-semibold">' + message + "</div>" +
            '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
            "</div>";
        container.appendChild(toastEl);
        const toast = new bootstrap.Toast(toastEl, { delay: 2800 });
        toast.show();
        toastEl.addEventListener("hidden.bs.toast", function () { toastEl.remove(); });
    };

    document.addEventListener("DOMContentLoaded", function () {
        setActiveNav();
        collapseNavOnClick();
        initBackToTop();
        initScrollReveal();
        if (typeof updateCartCount === "function") updateCartCount();
    });
})();
