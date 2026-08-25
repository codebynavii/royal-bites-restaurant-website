# Royal Bites

**Crispy. Juicy. Irresistible.**

A polished, responsive, fully interactive restaurant ordering website for Royal Bites - a premium fried chicken, burgers & combos brand.

## Technologies

- HTML5
- CSS3
- Bootstrap 5.3
- Bootstrap Icons
- Vanilla JavaScript (no frameworks, no backend)

This is a **frontend-only** project. There is no server, database or build step - it runs entirely in the browser using `localStorage` for the cart, coupons and order history.

## Features

- Responsive Bootstrap 5 navbar with active-page highlighting, mobile collapse menu and a live cart badge
- Home page with hero, category shortcuts, best sellers, a live countdown offer, "why us", order process and testimonials
- Menu page with live search, category filtering and a product detail modal
- Shopping cart backed by `localStorage`, with quantity controls, coupon codes and automatic delivery/GST calculation
- Offers page with claimable deals, copy-to-clipboard coupon codes and a live countdown timer
- Order page with customer details, delivery option selection, payment method selection and a live order summary
- Order confirmation page with a generated order ID, and an order history page reading from `localStorage`
- Contact form and About page with real client-side validation and Bootstrap toasts (no `alert()`)
- Scroll-reveal animations, a back-to-top button, and zero console errors

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Menu | `menu.html` |
| Offers | `offers.html` |
| About Us | `about.html` |
| Contact | `contact.html` |
| Order Now (checkout) | `order.html` |
| Cart | `cart.html` |
| Order Success | `order-success.html` |
| My Orders | `orders.html` |

## Project Structure

```text
ROYAL-BITES/
├── index.html
├── menu.html
├── offers.html
├── about.html
├── contact.html
├── order.html
├── cart.html
├── order-success.html
├── orders.html
│
├── css/
│   └── style.css          # design tokens, navbar, cards, buttons, all shared styling
│
├── js/
│   ├── products.js        # single source of truth: product catalog + coupon codes
│   ├── cart.js             # localStorage cart engine (add/remove/qty/totals/coupons)
│   ├── main.js              # navbar active state, toasts, back-to-top, scroll reveal
│   ├── menu.js               # menu search, filtering, product modal
│   ├── offers.js              # claim offer, copy coupon, countdown timers
│   ├── validation.js           # reusable form field validators
│   └── checkout.js              # order form, delivery/payment selection, order creation
│
├── *.png                        # existing Royal Bites brand & food photography
└── README.md
```

## localStorage Keys

- `royalBitesCart` - current cart contents
- `royalBitesCoupon` - currently applied coupon code
- `royalBitesLastOrder` - the most recently placed order (read by the success page)
- `royalBitesOrders` - full order history (read by `orders.html`)

No card numbers, CVVs or other payment details are ever stored or transmitted - the card fields on the order page are a visual demo only.

## How To Run

1. Open the project folder in VS Code.
2. Install the **Live Server** extension (if not already installed).
3. Right-click `index.html`.
4. Select **Open with Live Server**.

No backend, database, or build step is required.

## Note

Two files from the original assets - `kfc_logo_img.png` and `kfc_logo_img2.png` - are the real-world KFC trademark and are **not used anywhere** in this site to avoid any brand/IP conflict.
