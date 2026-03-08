# 🐾 LittlePaws

A full-featured pet marketplace and services discovery app built with React, Vite, Shadcn UI, and a JSON mock backend.

![LittlePaws Banner](https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=1200&h=400)

---

## ✨ Features

### 🛍️ Marketplace
- Browse **16+ premium pet products** across Foods, Medicines, Supplies, and Toys
- **Infinite scroll** — loads 8 products at a time using IntersectionObserver
- **Quick View modal** — view product details without leaving the page
- **Add to Cart** with animated green checkmark confirmation
- Search and category filters

### 🐕 Pet Listings
- Browse pets available for **adoption** (free) or **purchase**
- Filter by species (Dog, Cat, Rabbit) and listing type (Buy / Adopt)
- Detailed pet profiles with individual detail pages

### 🗺️ Discover & Map View
- Toggle between **List view** and an interactive **Map view**
- Map shows all nearby cafes, vets, and hotels with **colored pins per type**
- Click any pin for a popup with details and a booking/view button
- Powered by **OpenStreetMap + vanilla Leaflet.js**

### 🔥 Hot Deals & Promotions
- Homepage features a **Hot Deals section** with gradient promotion cards
- Each promo card shows the discount %, description, and a **copy-to-clipboard coupon code**
- Fully managed through the Admin Portal

### 🛒 Shopping Cart
- Persistent global cart powered by **Zustand**
- Animated **badge counter** on the cart icon updates instantly on every add
- Cart drawer with quantity controls, item removal, and subtotal
- Smooth **framer-motion** animations throughout

### 💳 Checkout
- **2-step checkout**: Shipping Information → Payment Details
- Live **credit card preview** that updates as you type
- Card number auto-formatting, expiry formatting, CVV masking
- Order posted to backend on submit → cart cleared → success screen

### 📅 Vet Appointment Booking
- Book appointments from any Vet service page
- Date picker + time slot selector
- Appointments saved to the mock backend

### 🏪 Merchant Admin Portal
- **Revenue chart** (last 6 months area chart via Recharts)
- **4 stat cards**: Revenue, Products, Orders, Appointments
- **Products tab** — full CRUD with image preview, inline edit
- **Orders tab** — view all placed orders
- **Appointments tab** — view all booked appointments
- **Promotions tab** — create and manage Hot Deals with discount %, coupon code, and expiry date

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + Shadcn UI |
| State | Zustand (with persistence) |
| Routing | React Router v7 |
| Animation | Framer Motion |
| Charts | Recharts |
| Map | Leaflet.js (vanilla, via dynamic import) |
| Mock API | json-server |
| Icons | Lucide React |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/PyaePhyoeAungppa/littlepaws.git
cd littlepaws

# Install dependencies
npm install --legacy-peer-deps
```

### Running Locally

Open **two terminals**:

```bash
# Terminal 1 — Start the mock API server (port 3001)
npm run server

# Terminal 2 — Start the Vite dev server (port 5173)
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
littlepaws/
├── db.json                  # Mock database (json-server)
├── src/
│   ├── api/
│   │   └── client.js        # API helper (fetchFromMock)
│   ├── components/
│   │   ├── cart/
│   │   │   └── CartDrawer.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx   # Search bar + filters
│   │   │   ├── BottomNav.jsx
│   │   │   └── Footer.jsx
│   │   ├── map/
│   │   │   └── ServiceMapView.jsx  # Leaflet map
│   │   └── ui/              # Shadcn UI components
│   ├── lib/
│   │   └── store.js         # Zustand cart store
│   └── pages/
│       ├── Home.jsx         # Hero + Hot Deals + Pets + Products
│       ├── Marketplace.jsx  # Products + infinite scroll + Quick View
│       ├── Pets.jsx         # Pet listings with filters
│       ├── PetDetails.jsx   # Individual pet page
│       ├── Discover.jsx     # Services + Map view toggle
│       ├── ServiceDetails.jsx  # Vet booking
│       ├── Checkout.jsx     # 2-step checkout with card form
│       └── merchant/
│           ├── Login.jsx
│           └── Dashboard.jsx  # Full admin portal
```

---

## 🔗 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/marketplace` | Product listings |
| `/pets` | Pet adoption & sales |
| `/pets/:id` | Pet detail page |
| `/discover` | Services (List / Map view) |
| `/service/:id` | Service detail + vet booking |
| `/checkout` | Shopping cart checkout |
| `/merchant/login` | Admin login |
| `/merchant/dashboard` | Admin portal |

---

## 📦 Available Scripts

```bash
npm run dev       # Start Vite dev server
npm run server    # Start json-server mock API
npm run build     # Production build
npm run preview   # Preview production build
```

---

## 📄 License

MIT — feel free to use this project for learning or as a starter template.
