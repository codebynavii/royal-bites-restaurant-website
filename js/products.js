/* ==========================================================================
   ROYAL BITES — Shared product catalog
   Single source of truth for products, prices & images used across
   home, menu, offers, cart, order and checkout pages.
   ========================================================================== */

const PRODUCTS = [
    {
        id: 1,
        name: "Royal 8 Piece Bucket",
        category: "chicken",
        price: 699,
        oldPrice: 849,
        image: "chicken_bucket.png",
        rating: 4.8,
        badge: "BESTSELLER",
        description: "8 pieces of our signature crispy fried chicken, marinated in Royal Bites' secret spice blend and fried to perfection.",
        ingredients: "Chicken, Royal spice blend, breading, sunflower oil."
    },
    {
        id: 2,
        name: "Royal 12 Piece Bucket",
        category: "chicken",
        price: 999,
        oldPrice: 1249,
        image: "chicken_img1.png",
        rating: 4.9,
        badge: "BESTSELLER",
        description: "12 pieces of crispy, juicy fried chicken - perfect for sharing with family and friends.",
        ingredients: "Chicken, Royal spice blend, breading, sunflower oil."
    },
    {
        id: 3,
        name: "2 Pc Chicken Meal",
        category: "combos",
        price: 249,
        oldPrice: null,
        image: "chicken_img2.png",
        rating: 4.6,
        badge: "",
        description: "2 pcs of crispy chicken served with a regular fries and a refreshing soft drink.",
        ingredients: "Chicken, potato fries, soft drink."
    },
    {
        id: 4,
        name: "Royal Chicken Burger",
        category: "burgers",
        price: 159,
        oldPrice: null,
        image: "burger.png",
        rating: 4.7,
        badge: "BESTSELLER",
        description: "Crispy chicken fillet stacked with fresh lettuce and Royal Bites' signature sauce in a soft bun.",
        ingredients: "Chicken fillet, bun, lettuce, signature sauce."
    },
    {
        id: 5,
        name: "Spicy Chicken Burger",
        category: "burgers",
        price: 179,
        oldPrice: null,
        image: "burger.png",
        rating: 4.6,
        badge: "",
        description: "A fiery spicy chicken fillet burger topped with jalapeno mayo for those who like it hot.",
        ingredients: "Spicy chicken fillet, bun, jalapeno mayo."
    },
    {
        id: 6,
        name: "Regular Fries",
        category: "fries",
        price: 89,
        oldPrice: null,
        image: "french_fries1.png",
        rating: 4.5,
        badge: "",
        description: "Crispy, golden and perfectly seasoned fries - the ideal side for any meal.",
        ingredients: "Potato, sunflower oil, Royal seasoning."
    },
    {
        id: 7,
        name: "Peri Peri Fries",
        category: "fries",
        price: 109,
        oldPrice: null,
        image: "french_fries1.png",
        rating: 4.4,
        badge: "",
        description: "Crispy fries tossed in tangy peri-peri seasoning for an extra kick.",
        ingredients: "Potato, sunflower oil, peri-peri seasoning."
    },
    {
        id: 8,
        name: "Royal Family Combo",
        category: "combos",
        price: 449,
        oldPrice: 549,
        image: "french_freis.png",
        rating: 4.8,
        badge: "BESTSELLER",
        description: "Crispy chicken, golden fries and a chilled Royal Bites drink - a full feast for the family.",
        ingredients: "Chicken, fries, soft drink."
    },
    {
        id: 9,
        name: "Chicken & Fries Combo",
        category: "combos",
        price: 329,
        oldPrice: null,
        image: "chicken_with_fries.png",
        rating: 4.7,
        badge: "",
        description: "Crispy chicken pieces served with a generous side of golden fries.",
        ingredients: "Chicken, potato fries."
    },
    {
        id: 10,
        name: "Royal Cheese Pizza",
        category: "pizza",
        price: 349,
        oldPrice: null,
        image: "pizza.png",
        rating: 4.6,
        badge: "",
        description: "A loaded chicken pizza topped with mozzarella, fresh herbs and Royal Bites sauce.",
        ingredients: "Pizza base, mozzarella, chicken, herbs, tomato sauce."
    }
];

const CATEGORY_LABELS = {
    all: "All",
    chicken: "Chicken",
    burgers: "Burgers",
    combos: "Combos",
    fries: "Fries",
    pizza: "Pizza"
};

const BESTSELLER_IDS = [1, 2, 4, 8, 9, 10];

const COUPONS = {
    ROYAL20: { type: "percent", value: 20, label: "20% OFF", minOrder: 0, description: "20% off your entire order" },
    WELCOME50: { type: "flat", value: 50, label: "₹50 OFF", minOrder: 300, description: "₹50 off orders above ₹300" },
    CHICKEN10: { type: "percent", value: 10, label: "10% OFF Chicken", minOrder: 0, category: "chicken", description: "10% off chicken category items" }
};

function getProductById(id) {
    return PRODUCTS.find(function (p) { return p.id === Number(id); });
}

function formatPrice(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
}

function renderStars(rating) {
    const full = Math.round(rating);
    let out = "";
    for (let i = 0; i < 5; i++) {
        out += i < full ? "★" : "☆";
    }
    return out;
}
