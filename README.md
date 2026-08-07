# 💊 Digiclinix Pharmacy

A modern, responsive, full-stack **Digital Pharmacy Web Application** built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Prisma ORM**, and **Neon PostgreSQL**.

The application provides a seamless online pharmacy experience with live product management, intelligent search & filtering, shopping cart functionality, prescription upload, responsive design, and a clean healthcare-focused user interface.

## 🌐 Live Demo

**Live Website:** https://digiclinixpharmacy.vercel.app/

---

# 📖 Overview

Digiclinix Pharmacy is a modern digital healthcare platform designed to simplify medicine discovery and healthcare services.

The application allows users to:

- Browse healthcare products
- Search medicines instantly
- Filter by category, stock, and prescription
- Upload prescriptions
- Contact the pharmacy
- Learn about the company
- Manage products through a complete CRUD system
- Add products to a persistent shopping cart

Built using the latest **Next.js App Router architecture**, the project follows clean code principles, reusable components, scalable folder organization, and responsive design best practices.

---

# ✨ Features

## 🏠 Home Page

- Responsive Hero Carousel
- Featured Products
- Trust Features
- Upload Prescription Banner
- WhatsApp Quick Order
- Responsive Hero Animations
- Dark / Light Theme
- Smooth Framer Motion Animations

---

## 💊 Products Module

- Live Product Catalog
- Global Navbar Search
- Debounced Product Search
- Category Filtering
- Stock Availability Filter
- Prescription Filter
- Product Sorting
- Pagination
- Product Details Modal
- Loading Skeletons
- Empty States
- Error States
- Responsive Product Cards

---

## 🛠 Product Management (CRUD)

- Add Product
- Edit Product
- Delete Product
- Product Details Modal
- Optimistic UI Updates
- Toast Notifications
- Client-side Validation

---

## 🛒 Shopping Cart

- Add to Cart
- Remove Item
- Quantity Controls
- Cart Drawer
- Persistent Local Storage
- Total Price Calculation
- Cart Badge
- Empty Cart State

---

## ℹ About Page

- Company Story
- Mission & Vision
- Core Values
- Healthcare Commitments
- Why Choose Us
- Statistics
- Store Location
- Contact CTA

---

## 📞 Contact Page

- Contact Information
- Contact Form
- Client-side Validation
- FAQ Accordion
- Google Maps Section
- WhatsApp Integration
- Success State

---

# 🎨 UI & UX Highlights

- Modern Healthcare Design
- Fully Responsive Layout
- Mobile First Approach
- Dark / Light Theme
- Glassmorphism Components
- Framer Motion Animations
- Accessible Components
- WCAG AA Color Contrast
- Reusable Design System
- High Resolution Local Assets

---

# ⚙ Tech Stack

## Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React
- next/image
- next/font
- next-themes

---

## Backend

- Next.js Route Handlers
- REST API
- Prisma ORM
- Server Components

---

## Database

- Neon PostgreSQL
- Prisma ORM

---

## State Management

- React Context API
- Cart Context
- Theme Provider
- Toast Provider
- React Hooks

---

## Deployment

- Vercel
- Neon PostgreSQL

---

# 📂 Project Structure

```
digiclinix-pharmacy
│
├── app/
│   ├── api/
│   ├── about/
│   ├── contact/
│   ├── products/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── about/
│   ├── cart/
│   ├── contact/
│   ├── home/
│   ├── layout/
│   ├── products/
│   ├── providers/
│   └── ui/
│
├── contexts/
├── hooks/
├── lib/
├── prisma/
├── public/
├── types/
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/digiclinix-pharmacy.git
```

```bash
cd digiclinix-pharmacy
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Create Environment Variables

Copy:

```bash
cp .env.example .env
```

Update your `.env`

```env
DATABASE_URL=your_neon_pooler_database_url

DIRECT_URL=your_neon_direct_database_url
```

---

## 4. Generate Prisma Client

```bash
npx prisma generate
```

---

## 5. Push Database Schema

```bash
npx prisma db push
```

---

## 6. Seed Sample Products (Optional)

```bash
npm run seed
```

---

## 7. Start Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 📡 REST API

| Method | Endpoint | Description |
|----------|--------------------|----------------------|
| GET | `/api/products` | Fetch all products |
| GET | `/api/products/:id` | Fetch single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

---

# 🌙 Theme Support

- Light Theme
- Dark Theme
- System Theme
- Persistent Theme Preference

---

# 📱 Responsive Design

Optimized for:

- Mobile
- Tablet
- Laptop
- Desktop

---

# ♿ Accessibility

- Semantic HTML
- Keyboard Navigation
- Focus Management
- ARIA Labels
- Screen Reader Friendly
- Visible Focus States
- WCAG AA Color Contrast

---

# ⚡ Performance Optimizations

- Next.js Image Optimization
- Lazy Loading
- Local Optimized Assets
- Server Components
- Memoized State
- Optimized Rendering
- Responsive Images
- Code Splitting

---

# 📸 Screenshots

Add screenshots of:

- Home Page
- Products Page
- Shopping Cart
- About Page
- Contact Page
- Dark Mode
- Mobile View

---

# 🔮 Future Enhancements

- User Authentication
- Order Management
- Online Payment Integration
- Wishlist
- Order History
- Inventory Dashboard
- Admin Role Management
- Email Notifications
- Analytics Dashboard

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Developer

**Mohan Kumar A**

**Full Stack Developer**

- 💼 LinkedIn: *(https://www.linkedin.com/in/mohan-kumar-sa/)*
- 🌐 Live Demo: https://digiclinix-pharmacy.vercel.app/

---

## ⭐ If you found this project helpful, please consider giving it a Star on GitHub!

If you like this project, don't forget to ⭐ the repository and share your feedback.
