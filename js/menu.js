/* ==========================================================================
   ROYAL BITES — Menu page: render, filter, search, product modal
   Depends on products.js and cart.js being loaded first.
   ========================================================================== */

(function () {
    "use strict";

    const grid = document.getElementById("menuGrid");
    const noResults = document.getElementById("noResults");
    const searchInput = document.getElementById("menuSearch");
    const filterButtons = document.querySelectorAll(".menu-filter-btn");
    const modalEl = document.getElementById("productModal");
    let activeCategory = "all";
    let activeSearch = "";
    let modalInstance = null;

    function matchesSearch(product, term) {
        if (!term) return true;
        const t = term.toLowerCase();
        return (
            product.name.toLowerCase().includes(t) ||
            product.category.toLowerCase().includes(t) ||
            product.description.toLowerCase().includes(t)
        );
    }

    function renderGrid() {
        const filtered = PRODUCTS.filter(function (p) {
            const categoryMatch = activeCategory === "all" || p.category === activeCategory;
            return categoryMatch && matchesSearch(p, activeSearch);
        });

        grid.innerHTML = "";

        if (filtered.length === 0) {
            noResults.classList.remove("d-none");
            return;
        }
        noResults.classList.add("d-none");

        filtered.forEach(function (p) {
            const col = document.createElement("div");
            col.className = "col";
            col.innerHTML =
                '<div class="card product-card h-100 position-relative">' +
                (p.badge ? '<span class="badge-bestseller">' + p.badge + '</span>' : '') +
                '<div class="product-img-wrap p-3 text-center d-flex align-items-center justify-content-center" style="height:190px;">' +
                '<img src="' + p.image + '" class="img-fluid" alt="' + p.name + '">' +
                '</div>' +
                '<div class="card-body d-flex flex-column">' +
                '<h5 class="card-title fw-bold" style="font-size:.95rem;">' + p.name + '</h5>' +
                '<div class="rating-stars mb-1">' + renderStars(p.rating) + '</div>' +
                '<p class="text-muted small flex-grow-1" style="min-height:40px;">' + p.description + '</p>' +
                '<div class="fw-bold fs-5 text-primary-rb mb-2">' + formatPrice(p.price) +
                (p.oldPrice ? ' <span class="text-muted text-decoration-line-through fs-6">' + formatPrice(p.oldPrice) + '</span>' : '') +
                '</div>' +
                '<div class="d-grid gap-2">' +
                '<button class="btn btn-outline-danger btn-sm fw-bold view-details-btn" data-id="' + p.id + '">View Details</button>' +
                '<button class="btn btn-danger btn-sm fw-bold add-to-cart-btn" data-id="' + p.id + '" aria-label="Add ' + p.name + ' to cart">Add To Cart</button>' +
                '</div></div></div>';
            grid.appendChild(col);
        });
    }

    function setActiveFilterButton(category) {
        filterButtons.forEach(function (btn) {
            btn.classList.toggle("btn-danger", btn.dataset.category === category);
            btn.classList.toggle("btn-outline-danger", btn.dataset.category !== category);
        });
    }

    filterButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            activeCategory = btn.dataset.category;
            setActiveFilterButton(activeCategory);
            renderGrid();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            activeSearch = searchInput.value.trim();
            renderGrid();
        });
    }

    function openProductModal(id) {
        const p = getProductById(id);
        if (!p || !modalEl) return;
        modalEl.querySelector(".modal-img").src = p.image;
        modalEl.querySelector(".modal-img").alt = p.name;
        modalEl.querySelector(".modal-name").textContent = p.name;
        modalEl.querySelector(".modal-desc").textContent = p.description;
        modalEl.querySelector(".modal-ingredients").textContent = p.ingredients;
        modalEl.querySelector(".modal-rating").innerHTML = renderStars(p.rating) + ' <span class="text-muted small">(' + p.rating + ')</span>';
        modalEl.querySelector(".modal-price").textContent = formatPrice(p.price);
        const qtyInput = modalEl.querySelector(".modal-qty");
        qtyInput.value = 1;
        const addBtn = modalEl.querySelector(".modal-add-btn");
        addBtn.dataset.id = p.id;

        modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    }

    grid.addEventListener("click", function (e) {
        const viewBtn = e.target.closest(".view-details-btn");
        const addBtn = e.target.closest(".add-to-cart-btn");
        if (viewBtn) {
            openProductModal(viewBtn.dataset.id);
        } else if (addBtn) {
            addToCart(addBtn.dataset.id, 1);
            showToast("Added to cart", "success");
        }
    });

    if (modalEl) {
        modalEl.querySelector(".modal-qty-minus").addEventListener("click", function () {
            const input = modalEl.querySelector(".modal-qty");
            input.value = Math.max(1, Number(input.value) - 1);
        });
        modalEl.querySelector(".modal-qty-plus").addEventListener("click", function () {
            const input = modalEl.querySelector(".modal-qty");
            input.value = Number(input.value) + 1;
        });
        modalEl.querySelector(".modal-add-btn").addEventListener("click", function () {
            const id = this.dataset.id;
            const qty = Number(modalEl.querySelector(".modal-qty").value) || 1;
            addToCart(id, qty);
            showToast("Added to cart", "success");
            modalInstance.hide();
        });
    }

    // Pre-select category from ?category= query param (used by home page category cards)
    const params = new URLSearchParams(window.location.search);
    const preselect = params.get("category");
    if (preselect && CATEGORY_LABELS[preselect]) {
        activeCategory = preselect;
    }
    setActiveFilterButton(activeCategory);
    renderGrid();
})();
