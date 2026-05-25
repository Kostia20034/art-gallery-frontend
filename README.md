# 🛍️ Product Store — Frontend

A React frontend for the Product API. Full stack product management app with JWT authentication, real-time CRUD operations, and pagination.

## 🌐 Live Demo
**https://product-frontend-vm4l.vercel.app**

## 🔗 Backend API
**https://product-api-production-949c.up.railway.app**

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + Vite | Frontend framework |
| Tailwind CSS | Styling |
| JavaScript ES6+ | Language |
| Docker + Nginx | Containerization |
| Vercel | Deployment |

---

## ✨ Features

```
✅ Login / Register with JWT authentication
✅ Token stored in localStorage (persists on refresh)
✅ Create, Edit, Delete products (protected)
✅ Browse and Search products (public)
✅ Pagination with Previous/Next navigation
✅ Loading states
✅ Error handling
✅ Responsive design with Tailwind CSS
✅ Connected to real Spring Boot REST API + PostgreSQL
```

---

## 🐳 Run with Docker

Make sure Docker Desktop is running and backend is started first:

```bash
# Start everything (frontend + backend + database)
cd Product-api
docker-compose up
```

Frontend runs at `http://localhost:3000` ✅

---

## ⚙️ Run Locally

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/Kostia20034/product-frontend.git
cd product-frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

Make sure backend is running at `http://localhost:8080`

---

## 🏗️ Project Structure

```
src/
├── App.jsx          # Main component — products page
├── Auth.jsx         # Login/Register component
├── ProductCard.jsx  # Individual product card with edit/delete
├── config.js        # API URL configuration
└── main.jsx         # Entry point
```

---

## 🔗 Backend Repository
[Product-api](https://github.com/Kostia20034/Product-api)

---

## 🔮 Roadmap

- [ ] React Router (multiple pages)
- [ ] Auto logout on token expiry
- [ ] Better error messages
- [ ] Loading spinners per action
- [ ] Product categories
